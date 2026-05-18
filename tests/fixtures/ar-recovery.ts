export const fixtures = {
  tenants: [
    { id: "tenant-1", name: "Acme Corp" },
    { id: "tenant-2", name: "Global Industries" },
  ],
  cabinets: [
    { id: "cabinet-1", name: "Premium Accounting" },
  ],
  users: [
    { id: "user-1", email: "admin@acme.com", role: "TENANT_ADMIN" },
    { id: "user-2", email: "accountant@premium.com", role: "CABINET_ADMIN" },
  ],
  invoices: [
    { id: "inv-1", amount: 1000, status: "UNPAID", dueDate: "2026-05-01" },
  ],
};
