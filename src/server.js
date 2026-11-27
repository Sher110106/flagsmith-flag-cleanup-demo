import http from 'node:http';
import { checkout } from './checkout.js';
import { closeFlags, flagsFor } from './flags.js';
import { renderHome } from './home.js';
import { canTakePayments } from './payments.js';
import { search } from './search.js';

const PRODUCTS = [
  { id: 1, name: 'Trail running shoes', price: 89 },
  { id: 2, name: 'Running socks', price: 12 },
  { id: 3, name: 'Rain jacket', price: 120 },
  { id: 4, name: 'Water bottle', price: 18 },
];

async function readJson(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}

function send(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const userId = req.headers['x-user-id'] ?? 'anonymous';
  const flags = await flagsFor(userId);

  try {
    if (req.method === 'GET' && url.pathname === '/') {
      return send(res, 200, renderHome({ name: userId }, flags));
    }
    if (req.method === 'GET' && url.pathname === '/search') {
      return send(res, 200, search(PRODUCTS, url.searchParams.get('q') ?? '', flags));
    }
    if (req.method === 'POST' && url.pathname === '/checkout') {
      if (!canTakePayments(flags)) {
        return send(res, 503, { error: 'Payments are paused. Try again soon.' });
      }
      const { cart = [] } = await readJson(req);
      return send(res, 200, checkout(cart, flags));
    }
    send(res, 404, { error: 'not found' });
  } catch (err) {
    send(res, 500, { error: err.message });
  }
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`demo-shop on http://localhost:${port}`));

process.on('SIGINT', async () => {
  await closeFlags();
  process.exit(0);
});
