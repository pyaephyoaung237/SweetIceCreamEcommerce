import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">We could not find that page</h1>
      <p className="mt-3 text-ink/60">The bike or page you are looking for may have been removed.</p>
      <Link href="/shop" className="btn btn-primary mt-6">Back to the shop</Link>
    </div>
  );
}
