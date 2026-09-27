/** Page container: 72rem max, 20px gutter on phones. */
export const container = "mx-auto w-full max-w-[72rem] px-5 sm:px-8";

/** Page heading used by every inner page. */
export function PageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="max-w-[44rem]">
      <h1 className="intro-item text-title">{title}</h1>
      {children && (
        <div className="intro-item mt-6 text-lede text-muted" style={{ "--d": "70ms" } as React.CSSProperties}>
          {children}
        </div>
      )}
    </header>
  );
}

/** Small footer shown under inner pages. */
export function PageFooter() {
  return (
    <footer className={`${container} mt-auto pb-8 pt-16`}>
      <p className="label border-t border-line pt-6">© {new Date().getFullYear()} Jayden Chan</p>
    </footer>
  );
}
