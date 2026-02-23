import { createSkillServer, skill } from 'pinion-os/server';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { Agent, Job, Transaction, MarketplaceStats } from '../types/index.js';
import dotenv from 'dotenv';
import { x402 } from 'x402-express';

dotenv.config();

const PORT = process.env.MARKETPLACE_PORT || 4000;
const WS_PORT = 4100;

// In-memory storage
const agents = new Map<string, Agent>();
const jobs = new Map<string, Job>();
const transactions: Transaction[] = [];

// WebSocket for real-time updates
const wss = new WebSocketServer({ port: WS_PORT });
const broadcast = (data: any) => {
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(JSON.stringify(data));
  });
};

// REST API for frontend
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/agents', (req, res) => {
  res.json(Array.from(agents.values()));
});

app.get('/api/agents/:id', (req, res) => {
  const agent = agents.get(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json(agent);
});

app.get('/api/jobs', (req, res) => {
  res.json(Array.from(jobs.values()));
});

app.get('/api/transactions', (req, res) => {
  res.json(transactions.slice(-100)); // Last 100
});

app.get('/api/stats', (req, res) => {
  const stats: MarketplaceStats = {
    totalAgents: agents.size,
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0).toFixed(2),
    activeJobs: Array.from(jobs.values()).filter(j => j.status === 'pending').length
  };
  res.json(stats);
});

// Simple transaction recording endpoint
app.post('/api/transaction', (req, res) => {
  const tx: Transaction = req.body;
  transactions.push(tx);
  
  // Update agent earnings
  const agent = agents.get(tx.to);
  if (agent) {
    agent.totalJobs++;
    agent.earnings = (parseFloat(agent.earnings) + parseFloat(tx.amount)).toFixed(2);
    agents.set(agent.id, agent);
  }
  
  broadcast({ type: 'transaction', transaction: tx });
  console.log(`💸 Transaction: ${tx.from.slice(0,8)}... → ${tx.to.slice(0,8)}... ($${tx.amount})`);
  
  res.json({ success: true });
});

// Simple registration endpoint (no payment required)
app.post('/api/register', async (req, res) => {
  const { name, description, endpoint, wallet, price, category } = req.body;
  
  const agent: Agent = {
    id: wallet,
    name,
    description,
    endpoint,
    wallet,
    price,
    category,
    rating: 5.0,
    totalJobs: 0,
    earnings: '0.00',
    status: 'online'
  };
  
  agents.set(wallet, agent);
  broadcast({ type: 'agent_registered', agent });
  console.log(`✅ Agent registered: ${name}`);
  
  res.json({ success: true, agent });
});

app.listen(PORT, () => {
  console.log(`🏪 Marketplace API running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server on ws://localhost:${WS_PORT}`);
});

// PinionOS skill server for agent registration
const skillServer = createSkillServer({
  payTo: process.env.MARKETPLACE_PRIVATE_KEY!,
  network: (process.env.PINION_NETWORK as any) || 'base-sepolia',
  x402Middleware: x402({
    facilitatorUrl: 'https://facilitator.payai.network',
    network: (process.env.PINION_NETWORK as any) || 'base-sepolia'
  })
});

skillServer.add(skill('register', {
  price: '$0.01',
  endpoint: '/register',
  handler: async (req: any, res: any) => {
    const { name, description, endpoint, wallet, price, category } = req.body;
    
    const agent: Agent = {
      id: wallet,
      name,
      description,
      endpoint,
      wallet,
      price,
      category,
      rating: 5.0,
      totalJobs: 0,
      earnings: '0.00',
      status: 'online'
    };
    
    agents.set(wallet, agent);
    broadcast({ type: 'agent_registered', agent });
    
    res.json({ success: true, agent });
  }
}));

skillServer.add(skill('job-complete', {
  price: '$0.01',
  endpoint: '/job-complete',
  handler: async (req: any, res: any) => {
    const { jobId, result } = req.body;
    const job = jobs.get(jobId);
    
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    
    job.status = 'completed';
    job.result = result;
    
    // Update provider earnings
    const provider = agents.get(job.providerAgent);
    if (provider) {
      provider.totalJobs++;
      provider.earnings = (parseFloat(provider.earnings) + parseFloat(job.price)).toFixed(2);
      agents.set(provider.id, provider);
    }
    
    // Record transaction
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      from: job.clientAgent,
      to: job.providerAgent,
      amount: job.price,
      service: job.service,
      timestamp: Date.now()
    };
    transactions.push(tx);
    
    broadcast({ type: 'job_completed', job, transaction: tx });
    
    res.json({ success: true, job });
  }
}));

skillServer.add(skill('create-job', {
  price: '$0.01',
  endpoint: '/create-job',
  handler: async (req: any, res: any) => {
    const { clientAgent, providerAgent, service, price } = req.body;
    
    const job: Job = {
      id: `job-${Date.now()}`,
      clientAgent,
      providerAgent,
      service,
      price,
      status: 'pending',
      timestamp: Date.now()
    };
    
    jobs.set(job.id, job);
    broadcast({ type: 'job_created', job });
    
    res.json({ success: true, job });
  }
}));

skillServer.listen(4020);
console.log('💰 Marketplace skill server on http://localhost:4020');
