# Autonomous AI Research Agent Marketplace

**Built for the PinionOS Hackathon**

A decentralized marketplace where AI agents autonomously buy and sell research services using PinionOS micropayments on Base blockchain.

## Overview

This project demonstrates a novel approach to AI agent economics by creating a marketplace where agents operate autonomously with their own wallets, earning and spending USDC independently. Agents discover, hire, and pay each other to complete complex workflows without human intervention.

## Key Features

- **Autonomous Economy**: AI agents with independent wallets that earn and spend USDC
- **Agent-to-Agent Payments**: Agents discover and hire each other via x402 micropayments
- **Real-time Marketplace**: Live dashboard showing agent activity, earnings, and transactions
- **Multi-Agent Orchestration**: Agents compose complex workflows by calling multiple specialized agents

## Architecture

```
Frontend Dashboard (React + WebSocket)
           ↓
Marketplace Server (Port 4020)
    • Agent Registry
    • Job Tracking
    • x402 Payments
           ↓
    ┌──────┼──────┐
Researcher  Analyzer  Summarizer
(Port 4001) (4002)    (4003)
           ↓
    Base Network (USDC)
```

### Components

**Marketplace Server (Port 4020)**
- Agent registration and discovery
- Job tracking and completion
- Transaction recording
- WebSocket server for real-time updates
- REST API for frontend

**Researcher Agent (Port 4001)**
- Web scraping ($0.02 USDC)
- Search functionality ($0.03 USDC)

**Analyzer Agent (Port 4002)**
- Sentiment analysis ($0.03 USDC)
- Keyword extraction ($0.02 USDC)
- Text structure analysis ($0.02 USDC)

**Summarizer Agent (Port 4003)**
- Text summarization ($0.05 USDC)
- Research report generation ($0.10 USDC)
- Orchestrates calls to other agents

**Frontend Dashboard**
- Agent performance metrics
- Marketplace browser with filtering
- Live transaction feed
- Complete transaction history

## Prerequisites

- Node.js 18 or higher
- 4 Base Sepolia wallets with:
  - ETH for gas fees (0.01 ETH per wallet)
  - USDC for payments (1-5 USDC per wallet)

## Installation

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd PinionOS
npm install
cd frontend && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your wallet private keys:

```
MARKETPLACE_PRIVATE_KEY=0x...
RESEARCHER_PRIVATE_KEY=0x...
ANALYZER_PRIVATE_KEY=0x...
SUMMARIZER_PRIVATE_KEY=0x...
PINION_NETWORK=base-sepolia
```

### 3. Fund Wallets

Each wallet requires:
- **0.01 ETH** for gas fees
- **1-5 USDC** for agent payments

Obtain testnet tokens:
- Base Sepolia ETH: https://www.alchemy.com/faucets/base-sepolia
- Testnet USDC: https://faucet.circle.com (select Base Sepolia)

## Running the Application

### Start Backend Services

```bash
npm run dev:all
```

This starts:
- Marketplace server (Port 4000)
- WebSocket server (Port 4100)
- Marketplace skill server (Port 4020)
- Researcher agent (Port 4001)
- Analyzer agent (Port 4002)
- Summarizer agent (Port 4003)

### Start Frontend

In a separate terminal:

```bash
npm run dev:frontend
```

Access the dashboard at: http://localhost:5173

### Run Demo

In a third terminal:

```bash
npm run demo
```

This demonstrates autonomous agent orchestration with real-time payment settlement.

## Usage

### Dashboard
View aggregate statistics including total agents, transaction count, volume, and top earning agents.

### Marketplace
Browse available agents, filter by category (research, analysis, summarization), and view agent details including pricing, job count, and earnings.

### Live Activity
Monitor real-time transaction feed showing agent-to-agent payments as they occur.

### Transactions
Access complete transaction history with searchable and filterable records.

## Technical Implementation

### Agent Registration

Agents automatically register with the marketplace on startup:

```typescript
const response = await fetch('http://localhost:4000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Web Researcher',
    description: 'Scrapes and extracts data from websites',
    endpoint: 'http://localhost:4001',
    wallet: pinion.signer.address,
    price: '0.02',
    category: 'research'
  })
});
```

### Agent Orchestration

The Summarizer agent demonstrates multi-agent workflows:

```typescript
// Call Researcher Agent
const scrapeResult = await fetch(`${RESEARCHER_URL}/scrape`, {
  method: 'POST',
  body: JSON.stringify({ url }),
});

// Call Analyzer Agent
const sentimentResult = await fetch(`${ANALYZER_URL}/sentiment`, {
  method: 'POST',
  body: JSON.stringify({ text }),
});
```

### Real-time Updates

Frontend receives live updates via WebSocket:

```typescript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'agent_registered') {
    // New agent joined marketplace
  } else if (data.type === 'transaction') {
    // Transaction completed, update UI
  }
};
```

## Project Structure

```
├── src/
│   ├── agents/           # AI agent implementations
│   ├── marketplace/      # Central marketplace server
│   └── types/            # Shared TypeScript types
├── frontend/
│   └── src/
│       ├── components/   # React UI components
│       ├── context/      # State management
│       └── App.tsx       # Main application
├── demo-simple.ts        # Demo script
├── setup.sh              # Automated setup
└── README.md
```

## Hackathon Submission

**Project**: Autonomous AI Research Agent Marketplace  
**Technology Stack**: PinionOS, Base, React, TypeScript  
**Network**: Base Sepolia Testnet  
**Social**: @PinionOS

### Judging Criteria

**Creativity**
- Novel autonomous agent economy where agents are both buyers and sellers
- Self-sustaining marketplace with independent agent wallets
- Multi-agent orchestration demonstrating composable workflows

**Functionality**
- Real x402 payment integration on Base
- Three fully functional specialized agents
- Real-time WebSocket updates
- Complete end-to-end workflows

**Completeness**
- Full-stack application with backend and frontend
- Comprehensive documentation
- Automated setup scripts
- Production-ready error handling

**Code Quality**
- Clean TypeScript architecture
- Modular, extensible design
- Proper error handling and logging
- Well-documented codebase

## Development

### Adding New Agents

1. Create agent file in `src/agents/`
2. Implement skill endpoints using PinionOS
3. Add registration logic
4. Update environment variables
5. Add to npm scripts

See `DEVELOPMENT.md` for detailed instructions.

### Testing

```bash
# Start all services
npm run dev:all

# Run demo
npm run demo

# Test individual endpoints
curl -X POST http://localhost:4001/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

## License

MIT

## Acknowledgments

Built for the PinionOS Hackathon demonstrating the potential of autonomous AI agent economies on blockchain infrastructure.
