# Concordia Swift SDK (minimal)

Usage example (async callback):

```swift
import ConcordiaSDK
let client = ConcordiaClient()
client.request(path: "/api/auth/login", method: "POST", body: nil) { data, resp, err in
    // handle
}
```
