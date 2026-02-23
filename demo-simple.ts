import dotenv from 'dotenv';

dotenv.config();

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function demoAgentWorkflow() {
  console.log('🤖 Autonomous AI Agent Marketplace Demo\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  try {
    // Scenario: A client needs a comprehensive research report
    console.log('📋 Scenario: Client requests comprehensive research report');
    console.log('   URL: https://techcrunch.com/ai-trends-2026\n');
    
    await sleep(1000);
    
    console.log('🔍 Step 1: Client discovers Summarizer Agent in marketplace');
    console.log('   Agent: Content Summarizer');
    console.log('   Service: Research Report Generation');
    console.log('   Price: $0.10 USDC\n');
    
    await sleep(1500);
    
    console.log('💼 Step 2: Summarizer Agent receives job request');
    console.log('   Status: Analyzing requirements...');
    console.log('   Decision: Need to call Researcher + Analyzer agents\n');
    
    await sleep(1500);
    
    // Transaction 1: Summarizer calls Researcher
    console.log('📞 Step 3: Summarizer → Researcher Agent');
    console.log('   Service: Web Scraping');
    console.log('   Payment: $0.02 USDC on Base');
    
    await fetch('http://localhost:4000/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `tx-${Date.now()}-1`,
        from: '0xA06eA83bB0276d9B4449e3C1d71A92295e89b65A', // Summarizer
        to: '0x5EfCC65Be948E20E53b6Fc0893385063157B68bd', // Researcher
        amount: '0.02',
        service: 'Web Scraping',
        timestamp: Date.now()
      })
    });
    
    console.log('   ✅ Payment settled on Base Sepolia');
    console.log('   ✅ Data extracted: 2,450 words, 15 headings\n');
    
    await sleep(2000);
    
    // Transaction 2: Summarizer calls Analyzer
    console.log('📞 Step 4: Summarizer → Analyzer Agent');
    console.log('   Service: Sentiment Analysis');
    console.log('   Payment: $0.03 USDC on Base');
    
    await fetch('http://localhost:4000/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `tx-${Date.now()}-2`,
        from: '0xA06eA83bB0276d9B4449e3C1d71A92295e89b65A', // Summarizer
        to: '0x2a6AD501974a51dDEcA30de59d25eE5Ed6cC9704', // Analyzer
        amount: '0.03',
        service: 'Sentiment Analysis',
        timestamp: Date.now()
      })
    });
    
    console.log('   ✅ Payment settled on Base Sepolia');
    console.log('   ✅ Analysis complete: Positive sentiment (87% confidence)\n');
    
    await sleep(2000);
    
    // Transaction 3: Client pays Summarizer
    console.log('📞 Step 5: Client → Summarizer Agent');
    console.log('   Service: Research Report');
    console.log('   Payment: $0.10 USDC on Base');
    
    await fetch('http://localhost:4000/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `tx-${Date.now()}-3`,
        from: '0xF4C8B3bece6FBD8C88ae4Ef829097440a3CAa4dD', // Client
        to: '0xA06eA83bB0276d9B4449e3C1d71A92295e89b65A', // Summarizer
        amount: '0.10',
        service: 'Research Report Generation',
        timestamp: Date.now()
      })
    });
    
    console.log('   ✅ Payment settled on Base Sepolia');
    console.log('   ✅ Report delivered to client\n');
    
    await sleep(1000);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 Workflow Summary:');
    console.log('   • 3 autonomous agents collaborated');
    console.log('   • 3 on-chain payments on Base Sepolia');
    console.log('   • Total value transferred: $0.15 USDC');
    console.log('   • Execution time: ~8 seconds');
    console.log('   • Zero human intervention\n');
    
    console.log('💰 Agent Earnings:');
    console.log('   • Researcher:  +$0.02 USDC');
    console.log('   • Analyzer:    +$0.03 USDC');
    console.log('   • Summarizer:  +$0.05 USDC (net profit)\n');
    
    console.log('🎉 Autonomous agent economy in action!');
    console.log('   View live updates: http://localhost:5173/activity');
    console.log('   Dashboard: http://localhost:5173/dashboard\n');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

demoAgentWorkflow();
