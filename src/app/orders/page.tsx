import OrderHistorySection from "@/components/OrderHistorySection";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Order History",
  description:
    "Review your BoilboX order history, payment confirmations, and current pickup status in one place.",
  url: "https://boilox.com/orders",
  type: "website",
});

export default function OrdersPage() {
  return <OrderHistorySection variant="page" />;
}
