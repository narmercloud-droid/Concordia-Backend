# Concordia Admin Swift SDK (minimal)

Usage:

```swift
import ConcordiaAdminSDK
let client = ConcordiaAdminClient(baseUrl: "https://api.concordia.app", token: "ADMIN_TOKEN")
let orders = try await client.adminListOrders()
```

All admin endpoints require Bearer authentication.
