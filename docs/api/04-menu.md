### Menu API

Response envelope: menu controllers use controller `wrap()` and return the Api-style envelope: `{ success: true, data: ... }` on success and `{ success: false, error: { code, message } }` on error.

### Public: Get Menu
Method: GET
URL: /api/menu/
Auth: Public
Controller: `MenuController.listMenu` → `menuService.listCategories`
Description: Returns menu categories and items (customer-facing). Route is cached (`cacheMiddleware` with short TTL).

#### Response
- 200: JSON array of categories, each with items and variants. Example (simplified):

```json
[ { "id": "cat_1", "name": "Pizzas", "items": [ { "id": "itm_1", "name": "Margherita", "variants": [ { "id": "v_1", "price": 12.5 } ] } ] } ]
```

- Errors: `500` on backend/DB failure.

---

### Admin: Categories & Items & Variants (CRUD)
These endpoints are protected and require `adminAuth` + `adminRole("manager")` for manager-level operations, or `verifyAdmin` in some admin sub-routers.

#### Categories
- `POST /api/menu/category` — create category — `MenuController.createCategory` — Body: category object — returns created `Category`.
- `PUT /api/menu/category/:id` — update category — `MenuController.updateCategory` — Body: partial category — returns updated `Category`.
- `DELETE /api/menu/category/:id` — delete category — `MenuController.deleteCategory` — returns `{ success: true }`.

#### Items
- `POST /api/menu/item` (or `POST /api/menuItems/`) — create item — `MenuController.createItem` — Body: item object (name, categoryId, description, base price, variants, addOns) — returns created `Item`.
- `PUT /api/menu/item/:id` — update item — `MenuController.updateItem` — returns updated `Item`.
- `DELETE /api/menu/item/:id` — delete item — `MenuController.deleteItem` — returns `{ success: true }`.

#### Variants
- `POST /api/menu/variant` — create variant — `MenuController.createVariant` — Body: variant details — returns created `Variant`.
- `PUT /api/menu/variant/:id` — update variant — `MenuController.updateVariant` — returns updated `Variant`.
- `DELETE /api/menu/variant/:id` — delete variant — `MenuController.deleteVariant` — returns `{ success: true }`.

#### Availability (terminal controls)
- `PUT /api/menu/item/:id/availability` — `MenuController.setItemAvailability` — Body: `{ available: boolean }` — used by terminals to mark sold-out items.
- `PUT /api/menu/variant/:id/availability` — `MenuController.setVariantAvailability` — Body: `{ available: boolean }`.

Notes:
- Controllers delegate to `menuService` which persists via Prisma. See `09-schemas.md` for menu-related Zod schemas and Prisma models.
