### Offers API

### Validate Offer
Method: POST
URL: /api/offers/validate
Auth: Public (used by frontend or checkout flow)
Description: Validate an offer/promo code against an order payload.

Response envelope: route uses `res.json()` directly (ad-hoc). The route returns a detailed validation object on success or `{ error: "..." }` on failure.

#### Request
- Body: `{ code: string, order: object }
`
- Example:
```json
{ "code": "SUMMER20", "order": { "total": 2500 } }
```

#### Response
- 200: Offer validation result object (service-dependent), example: `{ valid: true, discount: 500, reason?: null }`
- 400: `{ error: "Offer code is required." }` or `{ error: "Invalid offer code." }`
- 500: `{ error: "Unable to validate offer." }`

#### Successful response (detailed)
The `offerService.validateOffer` returns a detailed validation object. Fields observed from `src/services/offer.service.ts`:

```json
{
	"valid": true,
	"code": "SUMMER20",
	"description": "20% off",
	"discountPct": 20,
	"discountAmt": 0,
	"freeDelivery": false,
	"minOrder": 1000,
	"expiresAt": "2026-08-01T00:00:00.000Z",
	"total": 2500,
	"discount": 500,
	"finalTotal": 2000
}
```

Errors:
- `400` — missing `code` or validation failure (service returns `{ valid: false, reason }` which the route maps to `400` with `reason`).
- `500` — unexpected server error.

Notes:
- Use `finalTotal` and `discount` fields to apply the discount in checkout flows. `discount` is computed from `discountPct` and `discountAmt`.
