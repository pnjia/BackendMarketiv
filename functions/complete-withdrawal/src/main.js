import { Client, Databases, ID, Permission, Query, Role } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  try {
    const env = getEnv();
    const withdrawalDoc = parseBody(req);
    if (!withdrawalDoc?.$id) return json(res, { error: "Missing withdrawal payload" }, 400);

    const databases = createDatabasesClient(env);
    const withdrawal = await databases.getDocument(
      env.databaseId, env.withdrawalsCollectionId, withdrawalDoc.$id
    );

    if (withdrawal.status !== "pending") {
      return json(res, { status: "ignored", reason: `withdrawal is ${withdrawal.status}` });
    }

    const action = withdrawalDoc.status;

    // --- Reject path ---
    if (action === "rejected") {
      if (!withdrawalDoc.rejectionReason) {
        return json(res, { error: "rejectionReason wajib diisi" }, 400);
      }
      await databases.updateDocument(
        env.databaseId, env.withdrawalsCollectionId, withdrawal.$id,
        { status: "rejected", rejectionReason: withdrawalDoc.rejectionReason }
      );
      log(`Withdrawal ${withdrawal.$id} rejected`);
      return json(res, { status: "ok", result: "rejected" });
    }

    // --- Approve / processed path ---
    const wallet = await findWallet(databases, env, withdrawal.userId);
    if (!wallet) throw new Error(`Wallet not found for user ${withdrawal.userId}`);

    const currentBalance = Number(wallet.balance) || 0;
    const amount = Number(withdrawal.amount) || 0;
    if (currentBalance < amount) {
      return json(res, { error: "Balance tidak mencukupi" }, 409);
    }

    await databases.updateDocument(
      env.databaseId, env.walletsCollectionId, wallet.$id,
      { balance: currentBalance - amount }
    );

    await ensureTransaction(databases, env, {
      userId: withdrawal.userId,
      amount,
      type: "withdrawal",
      referenceId: withdrawal.$id,
      referenceType: "withdrawal",
      status: "completed",
    });

    await databases.updateDocument(
      env.databaseId, env.withdrawalsCollectionId, withdrawal.$id,
      {
        status: "processed",
        processedAt: new Date().toISOString(),
        processedBy: withdrawalDoc.processedBy || null,
        transferProofUrl: withdrawalDoc.transferProofUrl || null,
        adminNote: withdrawalDoc.adminNote || null,
      }
    );

    log(`Withdrawal ${withdrawal.$id} processed for ${withdrawal.userId}`);
    return json(res, { status: "ok", result: "processed" });
  } catch (err) {
    error(err?.stack || err?.message || String(err));
    if (err?.statusCode) return json(res, { error: err.message }, err.statusCode);
    return json(res, { error: "Internal server error" }, 500);
  }
};

function getEnv() {
  const env = {
    appwriteEndpoint: process.env.APPWRITE_FUNCTION_API_ENDPOINT || process.env.APPWRITE_ENDPOINT,
    appwriteProjectId: process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID,
    appwriteApiKey: process.env.APPWRITE_API_KEY,
    databaseId: process.env.APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_DB_ID,
    walletsCollectionId: process.env.WALLETS_COLLECTION_ID || process.env.NEXT_PUBLIC_WALLET_COLLECTION || "wallets",
    transactionsCollectionId: process.env.TRANSACTIONS_COLLECTION_ID || process.env.NEXT_PUBLIC_TRANSACTION_COLLECTION || "transactions",
    withdrawalsCollectionId: process.env.WITHDRAWALS_COLLECTION_ID || process.env.NEXT_PUBLIC_WITHDRAWAL_COLLECTION || "withdrawals",
  };
  const missing = Object.entries(env).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length > 0) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  return env;
}

function createDatabasesClient(env) {
  const client = new Client().setEndpoint(env.appwriteEndpoint).setProject(env.appwriteProjectId).setKey(env.appwriteApiKey);
  return new Databases(client);
}

function parseBody(req) {
  if (req.bodyJson && typeof req.bodyJson === "object") return req.bodyJson;
  const rawBody = req.bodyText || req.body || "{}";
  return typeof rawBody === "object" ? rawBody : JSON.parse(rawBody);
}

async function findWallet(databases, env, userId) {
  const result = await databases.listDocuments(env.databaseId, env.walletsCollectionId, [
    Query.equal("userId", userId),
    Query.limit(1),
  ]);
  return result.documents[0] || null;
}

async function ensureTransaction(databases, env, transaction) {
  const existing = await databases.listDocuments(env.databaseId, env.transactionsCollectionId, [
    Query.equal("referenceId", transaction.referenceId),
    Query.equal("referenceType", transaction.referenceType),
    Query.equal("type", transaction.type),
    Query.limit(1),
  ]);
  if (existing.documents[0]) return existing.documents[0];

  return databases.createDocument(
    env.databaseId,
    env.transactionsCollectionId,
    ID.unique(),
    transaction,
    [Permission.read(Role.user(transaction.userId))]
  );
}

function json(res, body, statusCode = 200) {
  return res.json(body, statusCode, { "content-type": "application/json" });
}
