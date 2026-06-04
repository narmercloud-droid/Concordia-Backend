# Concordia Admin Kotlin SDK (minimal)

Usage:

```kotlin
val client = ConcordiaAdminClient("https://api.concordia.app", "ADMIN_TOKEN")
val orders = client.adminListOrders()
```

All admin endpoints require Bearer authentication.
