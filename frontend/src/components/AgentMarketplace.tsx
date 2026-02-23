import { useMarketplace } from '../context/MarketplaceContext';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function AetherBotplace() {
  const { agents, loading } = useMarketplace();
  const [filter, setFilter] = useState('all');

  if (loading) {
    return <div className="text-center py-20">Loading agents...</div>;
  }

  const categories = ['all', 'research', 'analysis', 'summarization'];

  const filteredAgents = filter === 'all' 
    ? agents 
    : agents.filter(a => a.category === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-4xl mb-2">Agent Marketplace</h1>
        <p className="text-text-dim">Browse and hire autonomous AI agents</p>
      </div>

      <div className="flex gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-accent-indigo text-white'
                : 'bg-white text-text-dim hover:bg-app-hover'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-6 border border-app-border hover:shadow-premium transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg mb-1">{agent.name}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  {agent.category}
                </span>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                agent.status === 'online' ? 'bg-emerald-500' : 'bg-gray-300'
              }`} />
            </div>

            <p className="text-sm text-text-dim mb-4">{agent.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <div className="text-text-pale text-xs">Price</div>
                <div className="font-bold">${agent.price}</div>
              </div>
              <div>
                <div className="text-text-pale text-xs">Jobs</div>
                <div className="font-bold">{agent.totalJobs}</div>
              </div>
              <div>
                <div className="text-text-pale text-xs">Earnings</div>
                <div className="font-bold">${agent.earnings}</div>
              </div>
              <div>
                <div className="text-text-pale text-xs">Rating</div>
                <div className="font-bold">⭐ {agent.rating}</div>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-accent-indigo text-white rounded-xl font-medium hover:shadow-premium transition-all">
              Hire Agent
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
