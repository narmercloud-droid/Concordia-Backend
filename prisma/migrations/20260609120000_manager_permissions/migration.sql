CREATE TABLE IF NOT EXISTS "ManagerPermissionPolicy" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "permissions" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "ManagerPermissionPolicy_pkey" PRIMARY KEY ("id")
);

INSERT INTO "ManagerPermissionPolicy" ("id", "permissions", "updatedAt")
VALUES (
    'default',
    '{
        "dashboard": true,
        "orders": true,
        "menu_view": true,
        "menu_edit_prices": true,
        "menu_edit_availability": true,
        "hours_view": true,
        "hours_edit": true,
        "delivery_view": true,
        "delivery_edit": true,
        "customers_view": true,
        "customers_export": false,
        "customers_automation": false,
        "offers_view": true,
        "offers_edit": true
    }'::jsonb,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;
