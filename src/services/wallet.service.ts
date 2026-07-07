export const getWallet = async () => { /* Implementation */ };

export const WITHDRAW_PAYOUT_METHODS = ['bank', 'ewallet'];

export const requestWithdraw = async (data) => {
  const { amount, payoutMethod, providerName, accountNumber, accountName } = data;

  if (!WITHDRAW_PAYOUT_METHODS.includes(payoutMethod)) {
    throw new Error('Metode penarikan tidak valid');
  }

  if (!amount || !providerName || !accountNumber || !accountName) {
    throw new Error('Lengkapi data penarikan');
  }

  /* Implementation */
};
