import { redirect } from 'next/navigation';

// Export generateMetadata for dynamic metadata generation
export async function generateMetadata() {
  return {
    title: "Admin | BoilboX",
    description: "Admin access is currently handled via the Studio.",
    openGraph: {
      title: "Admin | BoilboX",
      description: "Admin access is currently handled via the Studio.",
      type: "website",
      url: "https://boilox.com/admin",
    },
    twitter: {
      card: "summary_large_image",
      title: "Admin | BoilboX",
      description: "Admin access is currently handled via the Studio.",
    },
  };
}

export default function AdminPage() {
	redirect('/studio');
}
