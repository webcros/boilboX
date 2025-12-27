import ClientAdmin from './ClientAdmin';

// Export generateMetadata for dynamic metadata generation
export async function generateMetadata() {
  return {
    title: "Admin Dashboard | BoilboX",
    description: "Manage your BoilboX website content, menu items, and analytics from the admin dashboard.",
    openGraph: {
      title: "Admin Dashboard | BoilboX",
      description: "Manage your BoilboX website content, menu items, and analytics from the admin dashboard.",
      type: "website",
      url: "https://boilox.com/admin",
    },
    twitter: {
      card: "summary_large_image",
      title: "Admin Dashboard | BoilboX",
      description: "Manage your BoilboX website content, menu items, and analytics from the admin dashboard.",
    },
  };
}

export default function AdminPage() {
  return <ClientAdmin />;
}
