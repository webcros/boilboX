import { Suspense } from "react";
import SignInClient from "./SignInClient";

const resolveNextPath = (value?: string | string[]) => {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate?.startsWith("/") && !candidate.startsWith("//")
    ? candidate
    : "/profile";
};

function SignInFallback() {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-24 animate-fade-in">
      <div className="max-w-lg mx-auto text-center text-gray-500 dark:text-gray-300">
        Loading sign in...
      </div>
    </div>
  );
}

export default function SignInPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const nextPath = resolveNextPath(searchParams?.next);

  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInClient nextPath={nextPath} />
    </Suspense>
  );
}
