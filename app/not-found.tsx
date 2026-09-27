import Link from "next/link";
import { container } from "@/components/container";

export default function NotFound() {
  return (
    <div className={`${container} stagger flex flex-1 flex-col justify-center py-16`}>
      <p className="label">404</p>
      <h1 className="mt-3 text-title">Nothing detected here.</h1>
      <p className="mt-5 text-lede text-muted">
        That page doesn&rsquo;t exist.{" "}
        <Link href="/" className="link-u text-ink">
          Back to the start
        </Link>
        .
      </p>
    </div>
  );
}
