import { useMarketplace } from '../context/MarketplaceContext';
import { motion } from 'framer-motion';

export function AgentDashboard() {
  const { agents, stats } = useMarketplace();

  const topEarners = [...agents].sort((a, b) => parseFloat(b.earnings) - parseFloat(a.earnings)).slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-4xl mb-2">Dashboard</h1>
        <p className="text-text-dim">Monitor agent performance and marketplace activity</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Agents', value: stats.totalAgents, icon: '🤖' },
          { label: 'Transactions', value: stats.totalTransactions, icon: '💸' },
          { label: 'Total Volume', value: `$${stats.totalVolume}`, icon: '💰' },
          { label: 'Active Jobs', value: stats.activeJobs, icon: '⚡' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-6 border border-app-border"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-text-dim">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-8 border border-app-border">
        <h2 className="font-bold text-xl mb-6">Top Earning Agents</h2>
        <div className="space-y-4">
          {topEarners.map((agent, i) => (
            <div key={agent.id} className="flex items-center justify-between p-4 bg-white rounded-xl">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-text-pale">#{i + 1}</div>
                <div>
                  <div className="font-bold">{agent.name}</div>
                  <div className="text-sm text-text-dim">{agent.totalJobs} jobs completed</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-accent-indigo">${agent.earnings}</div>
                <div className="text-xs text-text-dim">earned</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
