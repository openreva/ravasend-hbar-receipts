import { createHash } from 'node:crypto';
export function commitment(payment, salt) {
  if (typeof salt !== 'string' || salt.length < 32) throw new Error('A private salt of at least 32 characters is required');
  if (!payment || typeof payment.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(payment.id)) throw new Error('Invalid payment ID');
  if (!Number.isSafeInteger(payment.amountMinor) || payment.amountMinor <= 0) throw new Error('Positive integer amount required');
  if (!/^[A-Z]{3}$/.test(payment.currency)) throw new Error('Invalid currency');
  if (!['settled','reversed'].includes(payment.status)) throw new Error('Invalid status');
  const canonical = JSON.stringify([1,payment.id,payment.amountMinor,payment.currency,payment.status]);
  return createHash('sha256').update(salt + ':' + canonical).digest('hex');
}
export function message(hash) {
  if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error('Invalid commitment');
  return JSON.stringify({schema:'ravasend.receipt.v1',commitment:hash});
}
