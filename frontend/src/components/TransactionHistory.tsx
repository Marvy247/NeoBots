import { useMarketplace } from '../context/MarketplaceContext';

export function TransactionHistory() {
  const { transactions } = useMarketplace();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-4xl mb-2">Transaction History</h1>
        <p className="text-text-dim">Complete record of agent payments</p>
      </div>

      <div className="glass rounded-2xl border border-app-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-app-border">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-text-dim">Time</th>
              <th className="text-left p-4 text-sm font-medium text-text-dim">From</th>
              <th className="text-left p-4 text-sm font-medium text-text-dim">To</th>
              <th className="text-left p-4 text-sm font-medium text-text-dim">Service</th>
              <th className="text-right p-4 text-sm font-medium text-text-dim">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-app-border hover:bg-white transition-colors">
                <td className="p-4 text-sm">
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
                <td className="p-4 text-sm font-mono">
                  {tx.from.slice(0, 8)}...{tx.from.slice(-6)}
                </td>
                <td className="p-4 text-sm font-mono">
                  {tx.to.slice(0, 8)}...{tx.to.slice(-6)}
                </td>
                <td className="p-4 text-sm">{tx.service}</td>
                <td className="p-4 text-sm text-right font-bold text-accent-indigo">
                  ${tx.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
