import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Agent {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  wallet: string;
  price: string;
  category: string;
  rating: number;
  totalJobs: number;
  earnings: string;
  status: 'online' | 'offline' | 'busy';
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  service: string;
  timestamp: number;
}

interface MarketplaceStats {
  totalAgents: number;
  totalTransactions: number;
  totalVolume: string;
  activeJobs: number;
}

interface MarketplaceContextType {
  agents: Agent[];
  transactions: Transaction[];
  stats: MarketplaceStats;
  loading: boolean;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const API_URL = 'http://localhost:4000/api';
const WS_URL = 'ws://localhost:4100';

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<MarketplaceStats>({
    totalAgents: 0,
    totalTransactions: 0,
    totalVolume: '0.00',
    activeJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    console.log('Fetching marketplace data...');
    Promise.all([
      fetch(`${API_URL}/agents`).then(r => r.json()),
      fetch(`${API_URL}/transactions`).then(r => r.json()),
      fetch(`${API_URL}/stats`).then(r => r.json())
    ]).then(([agentsData, txData, statsData]) => {
      console.log('Agents:', agentsData);
      console.log('Transactions:', txData);
      console.log('Stats:', statsData);
      setAgents(agentsData);
      setTransactions(txData);
      setStats(statsData);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch marketplace data:', err);
      setLoading(false);
    });

    // WebSocket for real-time updates
    console.log('Connecting to WebSocket...');
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => console.log('✅ WebSocket connected');
    ws.onerror = (err) => console.error('WebSocket error:', err);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data);
      
      if (data.type === 'agent_registered') {
        setAgents(prev => [...prev, data.agent]);
      } else if (data.type === 'job_completed') {
        setTransactions(prev => [data.transaction, ...prev]);
        // Update agent stats
        setAgents(prev => prev.map(a => 
          a.id === data.job.providerAgent 
            ? { ...a, totalJobs: a.totalJobs + 1, earnings: (parseFloat(a.earnings) + parseFloat(data.job.price)).toFixed(2) }
            : a
        ));
      }
    };

    return () => ws.close();
  }, []);

  return (
    <MarketplaceContext.Provider value={{ agents, transactions, stats, loading }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
}
