export const DATABASE_ID = process.env.NEXT_PUBLIC_DB_ID || '6a3110bf000de5a04844';

export const COLLECTIONS = {
  users: process.env.NEXT_PUBLIC_USER_COLLECTION || 'users',
  umkmProfiles: process.env.NEXT_PUBLIC_UMKM_PROFILE_COLLECTION || 'umkm_profiles',
  creatorProfiles: process.env.NEXT_PUBLIC_CREATOR_COLLECTION || 'creator_profiles',
  creatorSocialAccounts: process.env.NEXT_PUBLIC_CREATOR_SOCIAL_ACCOUNT_COLLECTION || 'creator_social_accounts',
  creatorPortfolios: process.env.NEXT_PUBLIC_CREATOR_PORTFOLIO_COLLECTION || 'creator_portfolios',
  userStorageUsage: process.env.NEXT_PUBLIC_USER_STORAGE_USAGE_COLLECTION || 'user_storage_usage',
  userFiles: process.env.NEXT_PUBLIC_USER_FILES_COLLECTION || 'user_files',
  rateCards: process.env.NEXT_PUBLIC_RATE_CARD_COLLECTION || 'rate_cards',
  wallets: process.env.NEXT_PUBLIC_WALLET_COLLECTION || 'wallets',
  payments: process.env.NEXT_PUBLIC_PAYMENT_COLLECTION || 'payments',
  transactions: process.env.NEXT_PUBLIC_TRANSACTION_COLLECTION || 'transactions',
  escrows: process.env.NEXT_PUBLIC_ESCROW_COLLECTION || 'escrows',
  withdrawals: process.env.NEXT_PUBLIC_WITHDRAWAL_COLLECTION || 'withdrawals',
} as const;

export const FUNCTIONS = {
  createUserProfile: process.env.NEXT_PUBLIC_CREATE_USER_PROFILE_FUNCTION_ID || 'create-user-profile',
  validateAndUpload: process.env.NEXT_PUBLIC_VALIDATE_AND_UPLOAD_FUNCTION_ID || 'validate-and-upload',
  deleteFile: process.env.NEXT_PUBLIC_DELETE_FILE_FUNCTION_ID || 'delete-file',
  createPayment: process.env.NEXT_PUBLIC_CREATE_PAYMENT_FUNCTION_ID || 'create-payment',
} as const;
