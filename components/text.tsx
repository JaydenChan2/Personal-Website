import { isTodo, type Text } from "@/content/types";

/** Renders content text, or a visible TODO chip for a placeholder. */
export function T({ value }: { value: Text }) {
  if (isTodo(value)) return <span className="todo">TODO: {value.todo}</span>;
  return <>{value}</>;
}

/** Link whose href may still be a placeholder; renders the TODO chip instead of a dead link. */
export function MaybeLink({
  href,
  children,
  className = "link",
}: {
  href: Text;
  children: React.ReactNode;
  className?: string;
}) {
  if (isTodo(href)) {
    return (
      <span>
        {children} <span className="todo">TODO: {href.todo}</span>
      </span>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
      {external && <ArrowOut />}
    </a>
  );
}

export function ArrowOut() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="ml-[0.2em] inline-block size-[0.7em] -translate-y-[0.05em] align-baseline"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M3.5 8.5l5-5M4.5 3.5h4v4" />
    </svg>
  );
}
