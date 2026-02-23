import { createSkillServer, skill } from 'pinion-os/server';
import { PinionClient, payX402Service } from 'pinion-os';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.RESEARCHER_PORT || 4001;
const WALLET = process.env.RESEARCHER_PRIVATE_KEY!;
const MARKETPLACE_URL = 'http://localhost:4020';

const pinion = new PinionClient({ privateKey: WALLET });

// Register with marketplace
async function registerAgent() {
  try {
    const response = await fetch(`http://localhost:4000/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Web Researcher',
        description: 'Scrapes and extracts data from websites',
        endpoint: `http://localhost:${PORT}`,
        wallet: pinion.signer.address,
        price: '0.02',
        category: 'research'
      })
    });
    const data = await response.json();
    console.log('✅ Registered with marketplace');
  } catch (err: any) {
    console.log('⚠️  Registration pending:', err.message);
  }
}

const server = createSkillServer({
  payTo: WALLET,
  network: (process.env.PINION_NETWORK as any) || 'base',
});

server.add(skill('scrape', {
  price: '$0.02',
  endpoint: '/scrape',
  handler: async (req, res) => {
    const { url } = req.body;
    
    try {
      const response = await axios.get(url, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      
      const data = {
        title: $('title').text(),
        headings: $('h1, h2, h3').map((_, el) => $(el).text()).get().slice(0, 10),
        paragraphs: $('p').map((_, el) => $(el).text()).get().slice(0, 5),
        links: $('a').map((_, el) => $(el).attr('href')).get().slice(0, 20)
      };
      
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}));

server.add(skill('search', {
  price: '$0.03',
  endpoint: '/search',
  handler: async (req, res) => {
    const { query } = req.body;
    
    // Simulate search results
    const results = [
      { title: `${query} - Research Paper`, url: `https://example.com/paper/${query}`, snippet: 'Comprehensive analysis...' },
      { title: `${query} - Documentation`, url: `https://docs.example.com/${query}`, snippet: 'Technical documentation...' },
      { title: `${query} - Tutorial`, url: `https://tutorial.com/${query}`, snippet: 'Step-by-step guide...' }
    ];
    
    res.json({ success: true, results });
  }
}));

console.log(`🔍 Researcher Agent on http://localhost:${PORT}`);
registerAgent();
server.listen(Number(PORT));
