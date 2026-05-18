# Migrations

- `001_extensions.sql`: Extensions (uuid-ossp, pgcrypto). Safe to rollback by dropping extensions.
- `002_cabinets.sql`: Cabinets table.
- `003_tenants.sql`: Tenants table.
- `004_profiles.sql`: Profiles table.
- `005_cabinet_companies.sql`: Links.
- `006_cabinet_members.sql`: Cabinet roles.
- `007_tenant_members.sql`: Tenant roles.
- `008_clients.sql`: Clients.
- `009_invoices.sql`: Invoices.
- `010_invoice_lines.sql`: Invoice lines.
- `011_reminders.sql`: Reminders.
- `012_reminder_events.sql`: Reminder events.
- `013_payments.sql`: Payments.
- `014_audit_logs.sql`: Audit logs.
- `015_import_jobs.sql`: Import jobs.
- `016_import_rows.sql`: Import rows.
- `017_rls_policies.sql`: RLS definitions.
- `018_functions.sql`: DB functions.
- `019_seed.sql`: Seed data.

*Rollback Notes*: All destructive changes drop tables and ENUMs. CASCADE is used for dropping tables. Ensure data is backed up before rolling back production.
