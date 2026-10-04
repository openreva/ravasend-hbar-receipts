'use client';
import {useState} from 'react';
export default function Home() {
 const [topic,setTopic]=useState(''); const [sequence,setSequence]=useState(''); const [hash,setHash]=useState(''); const [result,setResult]=useState(''); const [busy,setBusy]=useState(false);
 async function verify(event:React.FormEvent) {event.preventDefault();setBusy(true);setResult('');try {
  if(!/^0\.0\.\d+$/.test(topic)||!/^\d+$/.test(sequence)||! /^[a-f0-9]{64}$/.test(hash)) throw new Error('Enter a valid topic, sequence and 64-character commitment.');
  const response=await fetch(`https://testnet.mirrornode.hedera.com/api/v1/topics/${topic}/messages/${sequence}`);
  if(!response.ok) throw new Error(`Mirror node returned ${response.status}. New messages may need time to index.`);
  const row=await response.json();const payload=JSON.parse(atob(row.message));
  if(payload.schema!=='ravasend.receipt.v1'||payload.commitment!==hash) throw new Error('Commitment does not match this message.');
  setResult(`Verified publication • Consensus timestamp ${row.consensus_timestamp}`);
 }catch(error){setResult(error instanceof Error?error.message:'Verification failed');}finally{setBusy(false);}}
 return <main><nav><strong>ravasend<span> / builders</span></strong><small>HEDERA TESTNET</small></nav><section><p className="eyebrow">PAYMENT RECEIPTS, WITHOUT THE PERSONAL DATA</p><h1>A receipt anyone<br/>can verify.</h1><p className="lead">Anchor a salted payment commitment on Hedera Consensus Service. Independently check its publication through the public mirror node.</p><form onSubmit={verify}><h2>Verify a commitment</h2><label>Topic ID<input required placeholder="0.0.123456" value={topic} onChange={e=>setTopic(e.target.value)}/></label><label>Message sequence<input required placeholder="1" value={sequence} onChange={e=>setSequence(e.target.value)}/></label><label>SHA-256 commitment<input required placeholder="64 lowercase hexadecimal characters" value={hash} onChange={e=>setHash(e.target.value)}/></label><button disabled={busy}>{busy?'Checking…':'Verify on Hedera →'}</button><p role="status">{result}</p></form><aside>This verifies a recorded commitment—not settlement, solvency or the truth of the original payment. Experimental developer template. Use synthetic data only.</aside></section></main>;
}
