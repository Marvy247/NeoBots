import { PinionClient, payX402Service } from 'pinion-os';

const SUMMARIZER_URL = 'http://localhost:4003';

async function demoAgentWorkflow() {
  console.log('🤖 Demo: Autonomous Agent Workflow\n');
  
  // Initialize client (in production, this would be an agent's wallet)
  const client = new PinionClient({
    privateKey: process.env.DEMO_PRIVATE_KEY || process.env.MARKETPLACE_PRIVATE_KEY!
  });
  
  console.log(`📍 Client wallet: ${client.signer.address}\n`);
  
  try {
    // Call the Summarizer agent, which will orchestrate calls to other agents
    console.log('📞 Calling Summarizer Agent to create research report...');
    console.log('   (Summarizer will call Researcher and Analyzer agents)\n');
    
    const result = await payX402Service(client.signer, `${SUMMARIZER_URL}/research-report`, {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://example.com/article'
      }),
      maxAmount: '100000' // $0.10 USDC max
    });
    
    console.log('✅ Research Report Generated!\n');
    console.log('📊 Report Details:');
    console.log(JSON.stringify(result.data.report, null, 2));
    console.log('\n💰 Total Cost: $0.10 USDC');
    console.log('🔄 Agents Called: Researcher ($0.02) + Analyzer ($0.03) + Summarizer ($0.05)');
    console.log('\n🎉 Autonomous agent workflow complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure all agents are running:');
    console.log('   npm run dev:all');
  }
}

demoAgentWorkflow();
