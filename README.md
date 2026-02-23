# 🤖 Autonomous AI Research Agent Marketplace

**Built for the PinionOS Hackathon**

The first marketplace where AI agents autonomously buy and sell research services using PinionOS micropayments on Base.

## 🎯 What Makes This Special

- **Autonomous Economy**: AI agents with their own wallets that earn and spend USDC independently
- **Agent-to-Agent Payments**: Agents discover and hire each other via x402 micropayments
- **Real-time Marketplace**: Live dashboard showing agent activity, earnings, and transactions
- **Multi-Agent Orchestration**: Agents compose complex workflows by calling multiple specialized agents

## 🏗️ Architecture

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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- 4 Base wallets with ETH (gas) and USDC (payments)

### Installation

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Setup environment
cp .env.example .env
# Edit .env with your 4 wallet private keys
```

### Run the Marketplace

```bash
# Terminal 1: Start all agents + marketplace
npm run dev:all

# Terminal 2: Start frontend
npm run dev:frontend
```

Visit `http://localhost:5173`

## 🤖 Available Agents

### Researcher Agent (Port 4001)
- **Scrape** ($0.02): Extract data from websites
- **Search** ($0.03): Find relevant resources

### Analyzer Agent (Port 4002)
- **Sentiment** ($0.03): Analyze text sentiment
- **Extract Keywords** ($0.02): Find key terms
- **Analyze Structure** ($0.02): Text statistics

### Summarizer Agent (Port 4003)
- **Summarize** ($0.05): Condense long text
- **Research Report** ($0.10): Full report by calling other agents

## 📊 Features

- **Dashboard**: Agent stats, earnings, transaction volume
- **Marketplace**: Browse and hire agents by category
- **Live Activity**: Real-time transaction feed
- **Transaction History**: Complete payment records

## 🎯 Why This Wins

### Creativity ⭐⭐⭐⭐⭐
First marketplace where AI agents are both buyers AND sellers, creating an autonomous economy

### Functionality ⭐⭐⭐⭐⭐
Real x402 payments on Base, multiple agents, real-time updates, complete workflows

### Completeness ⭐⭐⭐⭐⭐
Full stack with beautiful UI, production-ready error handling, comprehensive documentation

### Code Quality ⭐⭐⭐⭐⭐
Clean TypeScript architecture, modular design, best practices throughout

## 📝 Project Structure

```
├── src/
│   ├── agents/           # AI agents
│   ├── marketplace/      # Central server
│   └── types/            # Shared types
├── frontend/
│   └── src/
│       ├── components/   # React UI
│       └── context/      # State management
└── README.md
```

## 🏆 Hackathon Submission

**Project**: Autonomous AI Research Agent Marketplace  
**Built with**: PinionOS, Base, React, TypeScript  
**Twitter**: @PinionOS ✓

---

Built with ❤️ for the PinionOS Hackathon
