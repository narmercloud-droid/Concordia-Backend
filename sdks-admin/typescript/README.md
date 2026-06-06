# Concordia Admin TypeScript SDK (minimal)

Usage:

```ts
import ConcordiaAdminClient from './dist/client';
const c = new ConcordiaAdminClient('https://api.concordia.app', 'ADMIN_TOKEN');
await c.adminListOrders();
```

All admin endpoints require `Bearer` auth. Pass token to the constructor.
