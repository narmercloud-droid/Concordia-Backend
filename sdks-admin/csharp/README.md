# Concordia Admin C# SDK (minimal)

Usage:

```csharp
using ConcordiaAdminSdk;
var client = new ConcordiaAdminClient("https://api.concordia.app", "ADMIN_TOKEN");
var orders = await client.adminListOrders();
```

All admin endpoints require Bearer authentication.
