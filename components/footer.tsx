import { container } from "./layout";

export function Footer() {
  return (
    <footer className={`${container} pb-10 pt-6`}>
      <div className="meta flex flex-col gap-2 border-t border-rule pt-6 normal-case tracking-normal sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Jayden Chan. Set in Instrument Serif, Geist and Geist Mono.</p>
        <a href="#top" className="link self-start">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
