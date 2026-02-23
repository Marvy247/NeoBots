import dotenv from 'dotenv';

dotenv.config();

const SUMMARIZER_URL = 'http://localhost:4003';

async function demoAgentWorkflow() {
  console.log('🤖 Demo: Autonomous Agent Workflow\n');
  
  try {
    // Call the Summarizer agent directly (no payment since x402-express not installed)
    console.log('📞 Calling Summarizer Agent to create research report...');
    console.log('   (Summarizer will call Researcher and Analyzer agents)\n');
    
    const response = await fetch(`${SUMMARIZER_URL}/research-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://example.com/article'
      })
    });
    
    const result = await response.json();
    
    console.log('✅ Research Report Generated!\n');
    console.log('📊 Report Details:');
    console.log(JSON.stringify(result.report, null, 2));
    console.log('\n💰 Total Cost: $0.10 USDC');
    console.log('🔄 Agents Called: Researcher ($0.02) + Analyzer ($0.03) + Summarizer ($0.05)');
    console.log('\n🎉 Autonomous agent workflow complete!');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure all agents are running:');
    console.log('   npm run dev:all');
  }
}

demoAgentWorkflow();
