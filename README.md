# Ravasend HCS payment receipts

An original experimental Scaffold-HBAR template: publish a privacy-preserving commitment to a synthetic payment through Hedera Consensus Service (HCS), then independently verify it using a mirror node. This is not Ravasend's live settlement infrastructure.

## Quick start

Requires Node >=20.18.3 and npm. Run from the repository root:

```sh
npm install
npm test
npm run lint
npm run build
npm run dev
```

Visit http://localhost:3000. The verifier is read-only and requires no wallet. It expects a real testnet topic ID, message sequence and commitment from the publisher script; it does not display fabricated sample evidence.

## Publish a real testnet receipt

Create and fund a Hedera **testnet** account using https://portal.hedera.com/faucet. Copy `packages/hardhat/.env.example` to `packages/hardhat/.env` locally, enter its account ID and private key, and generate a private random salt as described there. Never paste keys into a submission or commit them.

```sh
npm run receipt
```

This creates a submit-key-protected HCS topic (unless you supplied one) and posts a synthetic USD 125.00 payment commitment. It prints the topic, sequence, commitment, transaction ID, Hashscan link and mirror link. Testnet HBAR fees apply. Only the schema and SHA-256 commitment are public. Save the printed evidence, NOT the .env file.

```sh
npm run verify -- 0.0.YOUR_TOPIC 1 YOUR_COMMITMENT
```

Paste those same values into the web app. Mirror indexing may take time; retry if the message is not yet available.

## Architecture and security boundaries

- `packages/hardhat`: Node publisher using the Hedera SDK, deterministic commitment library, tests and Hardhat configuration. No Solidity contract is needed for HCS.
- `packages/nextjs`: Next.js verifier using the public testnet mirror-node REST API.
- Canonical fields: schema version, payment ID, positive integer minor-unit amount, currency and status. A private random salt prevents straightforward enumeration of low-entropy payment fields.
- HCS is load-bearing: it supplies public consensus ordering and timestamped publication. No database is trusted by the verifier.
- A matching hash proves publication only. It does **not** prove that funds moved or that an operator's claim was truthful. Protect the salt and original record separately.
- Repeated submissions produce separate HCS messages; this prototype is not a production ledger or idempotent payout system. No customer funds are handled.
- The frontend never receives an operator key. Publisher execution stays local. There is no public write endpoint.

## Bounty submission checklist

1. Publish this original repository under MIT, including the lockfile.
2. Run `npm create scaffold-hbar@latest -- --template YOUR_ORG/YOUR_REPO` in a clean directory. Then repeat install/test/lint/build and launch the verifier.
3. Run a real testnet publication and include its Hashscan and mirror links in your submission.
4. Record a short walkthrough showing successful verification and explain publication versus settlement.

Public repository: https://github.com/openreva/ravasend-hbar-receipts. The official scaffold CLI successfully created a clean copy on 4 October 2026. Clean installation, seven tests, lint, production build and a running home-route HTTP 200 check passed. Testnet transaction evidence remains pending. Do not submit placeholders as transaction evidence.

## Current validation status

Seven offline tests pass, including SDK transaction serialization, and the Next.js production build and TypeScript checks pass. No funded-network transaction has been run yet. Dependency scanning currently reports unresolved upstream/transitive advisories, including a critical protobuf advisory in the installed SDK tree; version overrides require a clean-install verification before relying on them. This prototype is not security-audited and must not be used with real funds or customer data.
