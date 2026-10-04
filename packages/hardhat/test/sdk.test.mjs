import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PrivateKey, TopicCreateTransaction, TopicMessageSubmitTransaction, Transaction, TransactionId, AccountId} from '@hashgraph/sdk';
test('SDK can serialize and round-trip a protected topic creation',async()=>{
  const key=PrivateKey.generateED25519();
  const tx=new TopicCreateTransaction().setSubmitKey(key.publicKey).setNodeAccountIds([AccountId.fromString('0.0.3')]).setTransactionId(TransactionId.fromString('0.0.1001@1700000000.000000001')).freeze();
  const signed=await tx.sign(key);
  const decoded=Transaction.fromBytes(signed.toBytes());
  assert.equal(decoded.submitKey.toString(),key.publicKey.toString());
});
test('SDK can serialize and round-trip an HCS commitment message',()=>{
  const tx=new TopicMessageSubmitTransaction().setTopicId('0.0.1002').setMessage('{"schema":"ravasend.receipt.v1","commitment":"synthetic"}').setNodeAccountIds([AccountId.fromString('0.0.3')]).setTransactionId(TransactionId.fromString('0.0.1001@1700000000.000000002')).freeze();
  const decoded=Transaction.fromBytes(tx.toBytes());
  assert.equal(decoded.topicId.toString(),'0.0.1002');
  assert.match(Buffer.from(decoded.message).toString(),/ravasend.receipt.v1/);
});
