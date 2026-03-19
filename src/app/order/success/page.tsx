import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Order Success | BoilboX",
  description: "Your BoilboX payment was successful.",
  url: "https://boilox.com/order/success",
  type: "website",
});

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const orderId =
    typeof searchParams?.orderId === "string" ? searchParams.orderId : "";

  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-3xl p-12">
        <h1 className="text-3xl md:text-4xl font-black mb-4">
          Payment Successful
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">
          Thanks for your order. We&apos;ve received your payment and will start
          preparing your meal.
        </p>
        {orderId && (
          <div className="mb-8 text-xs uppercase tracking-[0.18em] text-gray-400">
            Order ID:{" "}
            <span className="font-black text-gray-700 dark:text-gray-200">
              {orderId}
            </span>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={
              orderId
                ? `/track-order?orderId=${encodeURIComponent(orderId)}`
                : "/track-order"
            }
            className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary-hover text-bg-dark font-extrabold flex items-center justify-center"
          >
            Track Order
          </Link>
          <Link
            href="/orders"
            className="h-12 px-8 rounded-2xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
          >
            Order History
          </Link>
          <Link
            href="/menu"
            className="h-12 px-8 rounded-2xl border border-gray-200 dark:border-white/10 font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
          >
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
}
