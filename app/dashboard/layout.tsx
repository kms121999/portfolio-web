import canReadWrite from "@/lib/canReadWrite";
import { UserButton } from "@stackframe/stack";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await canReadWrite({ redirectToLogin: true });

  return (
    <div className="relative min-h-screen">
      <UserButton />
      {children}
    </div>
  );
}
