"use client";

import { useState } from "react";

/**
 * The email address as a mailto link, with a small copy button beside it.
 * Recruiters on webmail often just want the address, not a mail client popping open.
 */
export function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <a href={`mailto:${email}`} className="link">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy email address"
        className="relative grid h-7 w-[4.25rem] place-items-center overflow-hidden rounded-full border border-line text-[0.8125rem] text-muted transition-colors hover:border-line-strong hover:text-ink"
      >
        <span
          className={`transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${copied ? "-translate-y-5 opacity-0" : ""}`}
        >
          Copy
        </span>
        <span
          aria-hidden="true"
          className={`absolute inset-0 grid place-items-center text-live transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${copied ? "" : "translate-y-5 opacity-0"}`}
        >
          Copied ✓
        </span>
        <span className="sr-only" role="status">
          {copied ? "Email address copied" : ""}
        </span>
      </button>
    </span>
  );
}
