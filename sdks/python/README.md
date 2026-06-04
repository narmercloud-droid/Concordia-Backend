# Concordia Python SDK (minimal)

Usage:

```py
from concordia_client import ConcordiaClient
c = ConcordiaClient(base_url='https://api.concordia.app', token='TOKEN')
resp = c.adminLogin({'email':'a','password':'b'})
```
