# Concordia Admin Python SDK (minimal)

Usage:

```py
from concordia_admin_client import ConcordiaAdminClient
c = ConcordiaAdminClient(token='ADMIN_TOKEN')
orders = c.adminListOrders()
```

All admin endpoints require Bearer authentication.
