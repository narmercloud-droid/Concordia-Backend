# Concordia TypeScript SDK (minimal)

Usage:

```ts
import ConcordiaClient from './dist/client';
const c = new ConcordiaClient('https://api.concordia.app', 'YOUR_TOKEN');
await c.adminLogin({ email: 'a', password: 'b' });
```

Notes:
- Methods are named after `operationId` values. The client uses `fetch` (node-fetch) under the hood.
