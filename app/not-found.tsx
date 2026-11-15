import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap page-top flex flex-1 flex-col justify-center">
      <p className="mono">404</p>
      <h1 className="h-display mt-6">
        Nothing hung <b>on this wall.</b>
      </h1>
      <p className="mt-6 text-ink-2">
        That page doesn&rsquo;t exist.{" "}
        <Link href="/" className="link-u text-ink">
          Back to the start
        </Link>
        .
      </p>
    </div>
  );
}
