import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <span className="inline-block rounded-full bg-pink-100 p-3 text-3xl text-pink-600 mb-4">🍨</span>
      
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-display">
        We could not find that page
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        The treat or page you are looking for may have been removed or doesn't exist.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-3 text-xs font-bold text-white shadow-md shadow-pink-500/25 transition-all hover:from-pink-700 hover:to-rose-600 active:scale-[0.98]"
      >
        Back to the shop
      </Link>
    </div>
  );
}