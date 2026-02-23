import { createSkillServer, skill } from 'pinion-os/server';
import { PinionClient, payX402Service } from 'pinion-os';
import cron from 'node-cron';

const PORT = process.env.SUMMARIZER_PORT || 4003;
const WALLET = process.env.SUMMARIZER_PRIVATE_KEY!;
const MARKETPLACE_URL = 'http://localhost:4020';
const RESEARCHER_URL = 'http://localhost:4001';
const ANALYZER_URL = 'http://localhost:4002';

const pinion = new PinionClient({ privateKey: WALLET });

async function registerAgent() {
  try {
    await payX402Service(pinion.signer, `${MARKETPLACE_URL}/register`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Content Summarizer',
        description: 'Summarizes long text, creates reports by calling other agents',
        endpoint: `http://localhost:${PORT}`,
        wallet: pinion.signer.address,
        price: '0.05',
        category: 'summarization'
      }),
      maxAmount: '10000'
    });
    console.log('✅ Registered with marketplace');
  } catch (err) {
    console.log('⚠️  Registration pending:', err.message);
  }
}

const server = createSkillServer({
  payTo: WALLET,
  network: (process.env.PINION_NETWORK as any) || 'base',
});

server.add(skill('summarize', {
  price: '$0.05',
  endpoint: '/summarize',
  handler: async (req, res) => {
    const { text, maxLength = 200 } = req.body;
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const targetSentences = Math.max(1, Math.floor(sentences.length * 0.3));
    
    // Simple extractive summarization - take first and important sentences
    const summary = sentences.slice(0, targetSentences).join('. ') + '.';
    
    res.json({ 
      success: true, 
      summary: summary.slice(0, maxLength),
      originalLength: text.length,
      summaryLength: summary.length,
      compressionRatio: ((summary.length / text.length) * 100).toFixed(1) + '%'
    });
  }
}));

server.add(skill('research-report', {
  price: '$0.10',
  endpoint: '/research-report',
  handler: async (req, res) => {
    const { url } = req.body;
    
    try {
      // Call researcher agent to scrape
      console.log('📞 Calling Researcher Agent...');
      const scrapeResult = await payX402Service(pinion.signer, `${RESEARCHER_URL}/scrape`, {
        method: 'POST',
        body: JSON.stringify({ url }),
        maxAmount: '20000'
      });
      
      const scrapedData = scrapeResult.data;
      const fullText = [
        scrapedData.title,
        ...scrapedData.headings,
        ...scrapedData.paragraphs
      ].join(' ');
      
      // Call analyzer agent for sentiment
      console.log('📞 Calling Analyzer Agent...');
      const sentimentResult = await payX402Service(pinion.signer, `${ANALYZER_URL}/sentiment`, {
        method: 'POST',
        body: JSON.stringify({ text: fullText }),
        maxAmount: '30000'
      });
      
      // Create report
      const report = {
        url,
        title: scrapedData.title,
        summary: scrapedData.paragraphs[0]?.slice(0, 300) + '...',
        sentiment: sentimentResult.data.sentiment,
        sentimentScore: sentimentResult.data.score,
        keyPoints: scrapedData.headings.slice(0, 5),
        totalCost: '0.10',
        agentsCalled: ['Researcher', 'Analyzer'],
        timestamp: new Date().toISOString()
      };
      
      // Notify marketplace of job completion
      await payX402Service(pinion.signer, `${MARKETPLACE_URL}/job-complete`, {
        method: 'POST',
        body: JSON.stringify({
          jobId: `job-${Date.now()}`,
          result: report
        }),
        maxAmount: '10000'
      });
      
      res.json({ success: true, report });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}));

server.listen(PORT, () => {
  console.log(`📝 Summarizer Agent on http://localhost:${PORT}`);
  registerAgent();
});

cron.schedule('*/5 * * * *', registerAgent);
