# Prisma migration notes (audit)

## Duplicate timestamps (do not rename on applied DBs)

- `20260610120000_branch_paypal_credentials`
- `20260610120000_customer_password`

Both share the same timestamp prefix. On databases where migrations already applied, leave history as-is.

Near-duplicate names:

- `20260602163937_add_order_issue_model`
- `20260602165440_add_order_issue_model` (narrower follow-up; name is misleading)

For **fresh** databases only, consider squashing before first migrate. Never rewrite `_prisma_migrations` rows on production.
