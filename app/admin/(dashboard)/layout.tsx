import { requireAdmin } from "@/lib/auth/guards";
import { adminNavForRole } from "@/components/admin/admin-nav";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin("/admin");
  const items = adminNavForRole(user.role);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar
        items={items}
        user={{ name: user.name, email: user.email, role: user.role }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar user={{ name: user.name, role: user.role }} />
        <main id="main" className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
