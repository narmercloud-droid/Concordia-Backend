# Concordia C# SDK (minimal)

Usage:

```csharp
using ConcordiaSdk;
var client = new ConcordiaClient("https://api.concordia.app", "TOKEN");
var resp = await client.adminLoginAsync(new { email = "a", password = "b" });
```
