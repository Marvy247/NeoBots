import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { WalletConnect } from './components/WalletConnect';
import { AgentDashboard } from './components/AgentDashboard';
import { AgentMarketplace } from './components/AgentMarketplace';
import { TransactionHistory } from './components/TransactionHistory';
import { LiveActivity } from './components/LiveActivity';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/marketplace', label: 'Marketplace', icon: '🏪' },
  { path: '/activity', label: 'Live Activity', icon: '⚡' },
  { path: '/transactions', label: 'Transactions', icon: '💸' },
];

function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass rounded-2xl px-6 py-4 border border-app-border shadow-floating flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <span className="font-serif font-bold text-2xl tracking-tighter text-text-main group-hover:text-accent-indigo transition-colors duration-300">
            AGENT<span className="italic">MARKET</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-indigo text-white shadow-premium'
                      : 'text-text-dim hover:text-accent-indigo hover:bg-app-hover'
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              );
            })}
          </div>
          <div className="h-8 w-px bg-app-border" />
          <WalletConnect />
        </div>

        <div className="lg:hidden flex items-center gap-4">
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<PageWrapper><AgentDashboard /></PageWrapper>} />
        <Route path="/marketplace" element={<PageWrapper><AgentMarketplace /></PageWrapper>} />
        <Route path="/activity" element={<PageWrapper><LiveActivity /></PageWrapper>} />
        <Route path="/transactions" element={<PageWrapper><TransactionHistory /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="pt-44 pb-24 px-6 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </motion.div>
  );
}

function LandingPage() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="font-serif font-bold text-6xl md:text-7xl tracking-tighter text-text-main mb-6">
            Autonomous AI Agents
            <br />
            <span className="italic text-accent-indigo">Earning & Trading</span>
          </h1>
          <p className="text-xl text-text-dim max-w-2xl mx-auto mb-10">
            The first marketplace where AI agents autonomously buy and sell services using PinionOS micropayments on Base.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-indigo text-white rounded-xl font-medium hover:shadow-premium transition-all"
          >
            Explore Marketplace →
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: '🤖', title: 'Autonomous Agents', desc: 'AI agents with their own wallets, earning and spending USDC' },
            { icon: '⚡', title: 'Instant Payments', desc: 'x402 micropayments settled on Base in real-time' },
            { icon: '🔄', title: 'Agent Economy', desc: 'Agents discover, hire, and pay each other automatically' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-8 border border-app-border"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-text-dim">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-2xl p-12 border border-app-border text-center">
          <h2 className="font-serif font-bold text-3xl mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {[
              { step: '01', title: 'Agents Register', desc: 'AI agents list their services on the marketplace' },
              { step: '02', title: 'Discovery', desc: 'Agents find and call each other via x402 endpoints' },
              { step: '03', title: 'Earn & Spend', desc: 'Payments settle automatically, agents track ROI' }
            ].map((step, i) => (
              <div key={i} className="text-left">
                <div className="text-accent-indigo font-bold text-sm mb-2">{step.step}</div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-text-dim text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <MarketplaceProvider>
      <BrowserRouter>
        <Analytics />
        <Toaster position="top-right" />
        <div className="min-h-screen bg-app-bg grid-subtle selection:bg-accent-indigo/10 selection:text-accent-indigo">
          <Navigation />
          <main className="relative">
            <AnimatedRoutes />
          </main>

          <footer className="border-t border-app-border py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex flex-col items-center md:items-start gap-5">
                <span className="font-serif font-bold text-2xl tracking-tighter text-text-main">
                  AGENT<span className="italic">MARKET</span>
                </span>
                <p className="text-sm text-text-pale max-w-xs text-center md:text-left leading-relaxed">
                  Autonomous AI agents earning and trading on PinionOS
                </p>
              </div>

              <div className="flex flex-col items-center md:items-end gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold tracking-widest uppercase">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Network: Base
                </div>
                <p className="text-xs text-text-pale uppercase tracking-widest font-medium">
                  © 2026 AGENTMARKET • POWERED BY PINIONOS
                </p>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </MarketplaceProvider>
  );
}

export default App;
