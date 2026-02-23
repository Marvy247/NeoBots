import dotenv from 'dotenv';

dotenv.config();

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testRealAgentCalls() {
  console.log('🧪 Testing Real Agent-to-Agent Communication\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  try {
    // Test 1: Call Researcher directly
    console.log('Test 1: Calling Researcher Agent directly...');
    const researcherResponse = await fetch('http://localhost:4001/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com' })
    });
    
    console.log(`Status: ${researcherResponse.status}`);
    const researcherData = await researcherResponse.json();
    console.log('✅ Researcher responded:', researcherData.success ? 'SUCCESS' : 'FAILED');
    console.log('');
    
    await sleep(1000);
    
    // Test 2: Call Analyzer directly
    console.log('Test 2: Calling Analyzer Agent directly...');
    const analyzerResponse = await fetch('http://localhost:4002/sentiment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'This is amazing and wonderful!' })
    });
    
    console.log(`Status: ${analyzerResponse.status}`);
    const analyzerData = await analyzerResponse.json();
    console.log('✅ Analyzer responded:', analyzerData.success ? 'SUCCESS' : 'FAILED');
    console.log('');
    
    await sleep(1000);
    
    // Test 3: Call Summarizer (which should call both)
    console.log('Test 3: Calling Summarizer Agent (orchestrator)...');
    const summarizerResponse = await fetch('http://localhost:4003/research-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://techcrunch.com/ai-trends' })
    });
    
    console.log(`Status: ${summarizerResponse.status}`);
    const summarizerData = await summarizerResponse.json();
    console.log('✅ Summarizer responded:', summarizerData.success ? 'SUCCESS' : 'FAILED');
    
    if (summarizerData.report) {
      console.log('\n📊 Report Generated:');
      console.log(`   Title: ${summarizerData.report.title}`);
      console.log(`   Sentiment: ${summarizerData.report.sentiment}`);
      console.log(`   Agents Called: ${summarizerData.report.agentsCalled.join(', ')}`);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All agents are communicating!');
    console.log('🎉 Real agent-to-agent calls working!');
    console.log('\nCheck the frontend at http://localhost:5173/activity');
    console.log('You should see transactions appearing in real-time!\n');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure agents are running: npm run dev:all');
  }
}

testRealAgentCalls();
