import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          BYOB
        </Link>
      </div>
    </header>
  );
}
