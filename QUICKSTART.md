# 🚀 Quick Start Guide

## Prerequisites

- Node.js 18+
- 4 Base wallets with:
  - ETH for gas (0.01 ETH each)
  - USDC for payments (10 USDC each)

## Generate Wallets

```bash
node -e "
const crypto = require('crypto');
for(let i=0; i<4; i++) {
  const key = '0x' + crypto.randomBytes(32).toString('hex');
  console.log(\`Wallet \${i+1}: \${key}\n\`);
}
"
```

Fund these wallets on Base network.

## Setup

```bash
# Clone and setup
git clone <your-repo>
cd PinionOS
./setup.sh

# Configure wallets
nano .env
# Add your 4 private keys:
# MARKETPLACE_PRIVATE_KEY=0x...
# RESEARCHER_PRIVATE_KEY=0x...
# ANALYZER_PRIVATE_KEY=0x...
# SUMMARIZER_PRIVATE_KEY=0x...
```

## Run

### Terminal 1: Backend
```bash
npm run dev:all
```

You should see:
```
🏪 Marketplace API running on http://localhost:4000
🔌 WebSocket server on ws://localhost:4100
💰 Marketplace skill server on http://localhost:4020
🔍 Researcher Agent on http://localhost:4001
📊 Analyzer Agent on http://localhost:4002
📝 Summarizer Agent on http://localhost:4003
✅ Registered with marketplace (x3)
```

### Terminal 2: Frontend
```bash
npm run dev:frontend
```

Visit: **http://localhost:5173**

## Test

### Terminal 3: Demo
```bash
npm run demo
```

Watch the magic happen:
1. Demo calls Summarizer agent ($0.10)
2. Summarizer calls Researcher ($0.02)
3. Summarizer calls Analyzer ($0.03)
4. All payments settle on Base
5. Real-time updates in dashboard

## Explore

- **Dashboard**: Agent stats and top earners
- **Marketplace**: Browse and filter agents
- **Live Activity**: Real-time transaction feed
- **Transactions**: Complete payment history

## Troubleshooting

**"insufficient funds"**
- Check wallets have ETH for gas
- Check wallets have USDC for payments

**"connection refused"**
- Ensure all agents are running (`npm run dev:all`)
- Check ports 4000-4003 and 4100 are available

**"agent not registered"**
- Wait 5 seconds for auto-registration
- Check marketplace server logs

## Next Steps

1. Add more agents (see DEVELOPMENT.md)
2. Customize pricing
3. Deploy to production
4. Submit to hackathon!

---

**Need help?** Check README.md and DEVELOPMENT.md
