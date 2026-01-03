import { ThemeProvider } from "@/context/ThemeContext";
import { AdminLayout as AdminLayoutComponent } from "@/components/AdminLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AdminLayoutComponent>{children}</AdminLayoutComponent>
    </ThemeProvider>
  );
}



