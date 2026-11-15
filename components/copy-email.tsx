"use client";

import { useState } from "react";

/**
 * The email address as a mailto link, with a small copy button beside it.
 * Recruiters on webmail often just want the address, not a mail client popping open.
 * `big` sets the address at display size (contact page, footer).
 */
export function CopyEmail({ email, big = false }: { email: string; big?: boolean }) {
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
    <span className={`inline-flex flex-wrap items-end gap-x-5 gap-y-3 ${big ? "" : "items-baseline"}`}>
      <a href={`mailto:${email}`} className={big ? "mail" : "link"}>
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy email address"
        className="relative mb-1 grid h-8 w-[6.5rem] place-items-center overflow-hidden border border-line-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3 transition-colors hover:border-ink hover:text-ink"
      >
        <span className={`transition-[transform,opacity] duration-300 ${copied ? "-translate-y-5 opacity-0" : ""}`}>Copy</span>
        <span
          aria-hidden="true"
          className={`absolute inset-0 grid place-items-center text-ink transition-[transform,opacity] duration-300 ${copied ? "" : "translate-y-5 opacity-0"}`}
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
