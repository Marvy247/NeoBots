import dotenv from 'dotenv';

dotenv.config();

async function demoAgentWorkflow() {
  console.log('🤖 Demo: Simulated Agent Workflow\n');
  
  try {
    // Simulate calling agents and record transactions
    console.log('📞 Simulating agent calls...\n');
    
    // Register a simulated transaction
    const transactions = [
      {
        id: `tx-${Date.now()}`,
        from: '0xClient123',
        to: '0x5EfCC65Be948E20E53b6Fc0893385063157B68bd', // Researcher
        amount: '0.02',
        service: 'Web Scraping',
        timestamp: Date.now()
      },
      {
        id: `tx-${Date.now() + 1}`,
        from: '0xClient123',
        to: '0x2a6AD501974a51dDEcA30de59d25eE5Ed6cC9704', // Analyzer
        amount: '0.03',
        service: 'Sentiment Analysis',
        timestamp: Date.now() + 1000
      },
      {
        id: `tx-${Date.now() + 2}`,
        from: '0xClient123',
        to: '0xA06eA83bB0276d9B4449e3C1d71A92295e89b65A', // Summarizer
        amount: '0.05',
        service: 'Text Summarization',
        timestamp: Date.now() + 2000
      }
    ];
    
    // Send transactions to marketplace
    for (const tx of transactions) {
      await fetch('http://localhost:4000/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx)
      });
      console.log(`✅ Transaction: ${tx.service} - $${tx.amount}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n💰 Total Cost: $0.10 USDC');
    console.log('🔄 Agents Called: Researcher + Analyzer + Summarizer');
    console.log('\n🎉 Check the frontend dashboard to see live updates!');
    console.log('   Dashboard: http://localhost:5173/dashboard');
    console.log('   Live Activity: http://localhost:5173/activity');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

demoAgentWorkflow();
