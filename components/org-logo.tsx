import Image from "next/image";
import type { Role } from "@/content/types";

/**
 * An organisation's logo on a small square tile. Tiles keep fixed colours in both
 * themes (white for logos, ink for typeset marks), like the site's other plates.
 * Decorative: the organisation's name is always in the text beside it.
 */
export function OrgLogo({ role, size = 56 }: { role: Pick<Role, "org" | "logo" | "mark">; size?: number }) {
  const style = { width: size, height: size } as React.CSSProperties;
  if (role.logo) {
    const cover = role.logo.fit === "cover";
    return (
      <span className={`logo-tile ${cover ? "" : "logo-tile--pad"}`} style={style} aria-hidden="true">
        <Image src={role.logo.src} alt="" fill sizes={`${size * 2}px`} className={cover ? "object-cover" : "object-contain"} />
      </span>
    );
  }
  const mark = role.mark ?? role.org.charAt(0);
  return (
    <span className="logo-tile logo-tile--mark" style={{ ...style, fontSize: size * (mark.length > 1 ? 0.3 : 0.4) }} aria-hidden="true">
      {mark}
    </span>
  );
}
