/** Page container: 76rem max, 20px gutter on phones. */
export const container = "mx-auto w-full max-w-[76rem] px-5 sm:px-8";
/** 12-column grid used by every section so margins line up down the page. */
export const grid = "grid grid-cols-12 gap-x-6";

export function SectionHeading({ index, title, id }: { index: string; title: string; id: string }) {
  return (
    <div className={`${grid} items-baseline border-t border-rule pt-6`}>
      <p className="meta col-span-12 mb-3 md:col-span-3 md:mb-0" aria-hidden="true">
        § {index}
      </p>
      <h2 id={id} className="col-span-12 text-h2 md:col-span-9">
        {title}
      </h2>
    </div>
  );
}
