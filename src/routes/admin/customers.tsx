import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { admin } from "@/lib/api";
import type { AdminCustomer } from "@/lib/api";
import { PageHeader, StatusBadge, LoadingRow, ErrorBanner, EmptyState } from "@/components/status";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({ meta: [{ title: "Customers — CopyTrade Pro Admin" }] }),
  component: AdminCustomers,
});

function AdminCustomers() {
  const queryClient = useQueryClient();
  const customersQuery = useQuery<{ customers: AdminCustomer[] }>({
    queryKey: ["admin", "customers"],
    queryFn: admin.listCustomers,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });

  const setActive = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => admin.setCustomerActive(id, active),
    onSuccess: invalidate,
  });
  const activate = useMutation({
    mutationFn: (id: string) => admin.activateCustomer(id),
    onSuccess: invalidate,
  });

  return (
    <>
      <PageHeader title="Customers" description="Every registered customer and their current status." />

      <div className="card-surface overflow-hidden">
        {customersQuery.isPending ? (
          <div className="px-5">
            <LoadingRow />
          </div>
        ) : customersQuery.isError ? (
          <div className="p-5">
            <ErrorBanner message="Could not load customers." />
          </div>
        ) : customersQuery.data && customersQuery.data.customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-5 py-2.5 text-left font-medium">Email</th>
                  <th className="px-5 py-2.5 text-left font-medium">Access</th>
                  <th className="px-5 py-2.5 text-left font-medium">MT5</th>
                  <th className="px-5 py-2.5 text-left font-medium">Copying</th>
                  <th className="px-5 py-2.5 text-left font-medium">Account</th>
                  <th className="px-5 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customersQuery.data.customers.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium text-ink">{c.email}</td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={c.access_status === "active" ? "good" : "idle"}>
                        {c.access_status === "active" ? "Active" : "No access"}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={c.mt5_connected ? "good" : "idle"}>
                        {c.mt5_connected ? "Connected" : "Not connected"}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={c.copy_enabled ? "good" : "idle"}>
                        {c.copy_enabled ? "On" : "Off"}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={c.is_active ? "good" : "bad"}>
                        {c.is_active ? "Enabled" : "Disabled"}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => activate.mutate(c.id)}
                          disabled={activate.isPending}
                          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-secondary disabled:opacity-60"
                        >
                          Activate 30d
                        </button>
                        <button
                          onClick={() => setActive.mutate({ id: c.id, active: !c.is_active })}
                          disabled={setActive.isPending}
                          className={
                            c.is_active
                              ? "rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-secondary disabled:opacity-60"
                              : "rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                          }
                        >
                          {c.is_active ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState message="No customers have registered yet." />
          </div>
        )}
      </div>
      {(setActive.isError || activate.isError) && (
        <div className="mt-4">
          <ErrorBanner message="That action failed. Please try again." />
        </div>
      )}
    </>
  );
}
