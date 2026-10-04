const [topic, sequence, expected] = process.argv.slice(2);
if (!/^0\.0\.\d+$/.test(topic || '') || !/^\d+$/.test(sequence || '') || !/^[a-f0-9]{64}$/.test(expected || '')) throw new Error('Usage: npm run verify -- TOPIC_ID SEQUENCE COMMITMENT');
const response = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/topics/${topic}/messages/${sequence}`);
if (!response.ok) throw new Error(`Mirror response ${response.status}; wait for indexing and retry`);
const row = await response.json();
const payload = JSON.parse(Buffer.from(row.message,'base64').toString('utf8'));
if (payload.schema !== 'ravasend.receipt.v1' || payload.commitment !== expected) throw new Error('Commitment mismatch');
console.log(`Verified commitment at consensus timestamp ${row.consensus_timestamp}. This proves publication, not payment settlement.`);
