import { Client, PrivateKey, TopicCreateTransaction, TopicMessageSubmitTransaction } from '@hashgraph/sdk';
import { commitment, message } from '../lib/receipt.mjs';
const { HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY, RECEIPT_SALT } = process.env;
if (!HEDERA_ACCOUNT_ID || !HEDERA_PRIVATE_KEY || !RECEIPT_SALT) throw new Error('Configure the local .env using .env.example');
const key = PrivateKey.fromString(HEDERA_PRIVATE_KEY);
const client = Client.forTestnet().setOperator(HEDERA_ACCOUNT_ID,key);
try {
  let topicId = process.env.HEDERA_TOPIC_ID;
  if (!topicId) {
    const created = await new TopicCreateTransaction().setTopicMemo('Synthetic payment commitments; not settlement').setSubmitKey(key.publicKey).execute(client);
    topicId = (await created.getReceipt(client)).topicId.toString();
  }
  const payment = {id:'demo-payment-001',amountMinor:12500,currency:'USD',status:'settled'};
  const hash = commitment(payment, RECEIPT_SALT);
  const tx = await new TopicMessageSubmitTransaction().setTopicId(topicId).setMessage(message(hash)).execute(client);
  const receipt = await tx.getReceipt(client);
  console.log(JSON.stringify({network:'testnet',topicId,sequence:receipt.topicSequenceNumber.toString(),commitment:hash,transactionId:tx.transactionId.toString(),hashscan:`https://hashscan.io/testnet/transaction/${tx.transactionId}`,mirror:`https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages/${receipt.topicSequenceNumber}`},null,2));
} finally { client.close(); }
