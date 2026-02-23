export interface Agent {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  wallet: string;
  price: string;
  category: 'research' | 'analysis' | 'summarization';
  rating: number;
  totalJobs: number;
  earnings: string;
  status: 'online' | 'offline' | 'busy';
}

export interface Job {
  id: string;
  clientAgent: string;
  providerAgent: string;
  service: string;
  price: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  result?: any;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  service: string;
  timestamp: number;
  txHash?: string;
}

export interface MarketplaceStats {
  totalAgents: number;
  totalTransactions: number;
  totalVolume: string;
  activeJobs: number;
}
