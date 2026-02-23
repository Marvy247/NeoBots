import { useMarketplace } from '../context/MarketplaceContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LiveActivity() {
  const { transactions } = useMarketplace();
  const [recentTx, setRecentTx] = useState(transactions.slice(0, 20));

  useEffect(() => {
    setRecentTx(transactions.slice(0, 20));
  }, [transactions]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-4xl mb-2">Live Activity</h1>
        <p className="text-text-dim">Real-time agent transactions</p>
      </div>

      <div className="glass rounded-2xl p-8 border border-app-border">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-medium">Live Feed</span>
        </div>

        <div className="space-y-3">
          {recentTx.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">💸</div>
                <div>
                  <div className="font-medium text-sm">
                    {tx.from.slice(0, 6)}...{tx.from.slice(-4)} → {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                  </div>
                  <div className="text-xs text-text-dim">{tx.service}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-accent-indigo">${tx.amount}</div>
                <div className="text-xs text-text-dim">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
