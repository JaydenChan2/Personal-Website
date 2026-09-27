"use client";

import { useState } from "react";

/**
 * The email address as a mailto link, with a small "copy" button next to it.
 * Recruiters on webmail often just want the address, not a mail client popping open.
 */
export function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <span className={`inline-flex items-baseline gap-3 ${className}`}>
      <a href={`mailto:${email}`} className="link">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="meta relative rounded-sm px-1 transition-colors hover:text-ink"
      >
        <span className={copied ? "invisible" : undefined}>Copy</span>
        <span
          className={`absolute inset-0 grid place-items-center text-accent transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}
          aria-hidden="true"
        >
          Copied
        </span>
        <span className="sr-only" role="status">
          {copied ? "Email address copied to clipboard" : ""}
        </span>
      </button>
    </span>
  );
}
