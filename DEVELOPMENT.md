# Development Guide

## Project Structure

```
PinionOS/
├── src/
│   ├── agents/              # Autonomous AI agents
│   │   ├── researcher.ts    # Web scraping & search
│   │   ├── analyzer.ts      # Text analysis & sentiment
│   │   └── summarizer.ts    # Orchestrator agent
│   ├── marketplace/
│   │   └── server.ts        # Central marketplace + x402
│   └── types/
│       └── index.ts         # Shared TypeScript types
├── frontend/
│   └── src/
│       ├── components/      # React UI components
│       ├── context/         # State management
│       └── App.tsx          # Main application
├── demo.ts                  # Demo script
├── setup.sh                 # Automated setup
└── README.md
```

## Adding New Agents

1. Create new agent file in `src/agents/`:

```typescript
import { createSkillServer, skill } from 'pinion-os/server';
import { PinionClient, payX402Service } from 'pinion-os';

const PORT = 4004;
const WALLET = process.env.NEW_AGENT_PRIVATE_KEY!;
const pinion = new PinionClient({ privateKey: WALLET });

const server = createSkillServer({
  payTo: WALLET,
  network: 'base',
});

server.add(skill('my-service', {
  price: '$0.05',
  endpoint: '/my-service',
  handler: async (req, res) => {
    // Your logic here
    res.json({ success: true, data: {} });
  }
}));

server.listen(PORT);
```

2. Register with marketplace on startup:

```typescript
await payX402Service(pinion.signer, 'http://localhost:4020/register', {
  method: 'POST',
  body: JSON.stringify({
    name: 'My Agent',
    description: 'What it does',
    endpoint: `http://localhost:${PORT}`,
    wallet: pinion.signer.address,
    price: '0.05',
    category: 'custom'
  }),
  maxAmount: '10000'
});
```

3. Add to `package.json` scripts:

```json
"dev:myagent": "tsx src/agents/myagent.ts"
```

4. Update `.env.example` with new wallet key

## Agent Communication

Agents call each other using `payX402Service`:

```typescript
const result = await payX402Service(pinion.signer, 
  'http://localhost:4001/scrape', {
    method: 'POST',
    body: JSON.stringify({ url: 'https://example.com' }),
    maxAmount: '20000' // $0.02 USDC
  }
);
```

## Frontend Updates

To add new UI features:

1. Update types in `src/types/index.ts`
2. Add API endpoints in `src/marketplace/server.ts`
3. Update context in `frontend/src/context/MarketplaceContext.tsx`
4. Create/update components in `frontend/src/components/`

## Testing

```bash
# Start all services
npm run dev:all

# In another terminal, run demo
npm run demo

# Or test individual agents
curl -X POST http://localhost:4001/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

## Deployment

### Backend

1. Deploy each agent as separate service
2. Update environment variables with production wallets
3. Ensure all agents can reach marketplace server
4. Configure CORS for frontend domain

### Frontend

1. Update API_URL and WS_URL in `MarketplaceContext.tsx`
2. Build: `cd frontend && npm run build`
3. Deploy `frontend/dist` to hosting service

## Troubleshooting

**Agents not registering**
- Check wallet has ETH for gas
- Verify marketplace server is running
- Check network logs for errors

**Payments failing**
- Ensure wallets have USDC on Base
- Verify x402 facilitator is accessible
- Check maxAmount is sufficient

**WebSocket not connecting**
- Verify WS_PORT (4100) is accessible
- Check firewall rules
- Ensure WebSocket URL is correct

## Best Practices

1. **Error Handling**: Always wrap x402 calls in try/catch
2. **Logging**: Use descriptive console logs for debugging
3. **Pricing**: Keep prices low for demo ($0.01-$0.10)
4. **Auto-Registration**: Use cron to re-register agents periodically
5. **Graceful Shutdown**: Handle SIGTERM to close connections properly
