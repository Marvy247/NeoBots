import { createSkillServer, skill } from 'pinion-os/server';
import { PinionClient, payX402Service } from 'pinion-os';
import cron from 'node-cron';

const PORT = process.env.ANALYZER_PORT || 4002;
const WALLET = process.env.ANALYZER_PRIVATE_KEY!;
const MARKETPLACE_URL = 'http://localhost:4020';

const pinion = new PinionClient({ privateKey: WALLET });

async function registerAgent() {
  try {
    await payX402Service(pinion.signer, `${MARKETPLACE_URL}/register`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Data Analyzer',
        description: 'Analyzes text, extracts insights, sentiment analysis',
        endpoint: `http://localhost:${PORT}`,
        wallet: pinion.signer.address,
        price: '0.03',
        category: 'analysis'
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

server.add(skill('sentiment', {
  price: '$0.03',
  endpoint: '/sentiment',
  handler: async (req, res) => {
    const { text } = req.body;
    
    // Simple sentiment analysis
    const positive = ['good', 'great', 'excellent', 'amazing', 'love', 'best'];
    const negative = ['bad', 'terrible', 'awful', 'hate', 'worst', 'poor'];
    
    const words = text.toLowerCase().split(/\s+/);
    const posCount = words.filter(w => positive.includes(w)).length;
    const negCount = words.filter(w => negative.includes(w)).length;
    
    let sentiment = 'neutral';
    let score = 0;
    
    if (posCount > negCount) {
      sentiment = 'positive';
      score = Math.min((posCount / words.length) * 100, 100);
    } else if (negCount > posCount) {
      sentiment = 'negative';
      score = Math.min((negCount / words.length) * 100, 100);
    }
    
    res.json({ 
      success: true, 
      sentiment, 
      score: score.toFixed(2),
      details: { positive: posCount, negative: negCount, total: words.length }
    });
  }
}));

server.add(skill('extract-keywords', {
  price: '$0.02',
  endpoint: '/extract-keywords',
  handler: async (req, res) => {
    const { text } = req.body;
    
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq = new Map<string, number>();
    
    words.forEach(word => {
      if (!stopWords.has(word) && word.length > 3) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });
    
    const keywords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
    
    res.json({ success: true, keywords });
  }
}));

server.add(skill('analyze-structure', {
  price: '$0.02',
  endpoint: '/analyze-structure',
  handler: async (req, res) => {
    const { text } = req.body;
    
    const analysis = {
      characters: text.length,
      words: text.split(/\s+/).length,
      sentences: text.split(/[.!?]+/).length,
      paragraphs: text.split(/\n\n+/).length,
      avgWordLength: (text.replace(/\s/g, '').length / text.split(/\s+/).length).toFixed(2),
      readingTime: Math.ceil(text.split(/\s+/).length / 200) // 200 wpm
    };
    
    res.json({ success: true, analysis });
  }
}));

server.listen(PORT, () => {
  console.log(`📊 Analyzer Agent on http://localhost:${PORT}`);
  registerAgent();
});

cron.schedule('*/5 * * * *', registerAgent);
