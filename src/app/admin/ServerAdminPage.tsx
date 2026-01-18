import { getCurrentAdmin } from '@/actions/adminAuth';
import { AdminLayout } from '@/components/AdminLayout';
import ClientAdmin from './ClientAdmin';

export default async function ServerAdminPage() {
  const user = await getCurrentAdmin();
  
  return (
    <AdminLayout user={user}>
      <ClientAdmin />
    </AdminLayout>
  );
}