import type { JSX } from "react";
import { getClients } from "@/server/content/clients";

/**
 * Faithful CSS marquee (two identical slides), now DB-driven via getClients()
 * with a hardcoded fallback. Markup/classes are unchanged so the original CSS
 * animation is preserved. `className` matches each PHP include's wrapper.
 */
export default async function ClientLogos({
  className = "logo-slider",
}: {
  className?: string;
}): Promise<JSX.Element> {
  const clients = await getClients();

  const slide = (key: string): JSX.Element => (
    <div className="logos-slide" key={key}>
      {clients.map((c, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${key}-${c.id}-${i}`}
          src={c.logo}
          width={c.width ?? undefined}
          height={c.height ?? undefined}
          alt="OUR CLIENTS"
        />
      ))}
    </div>
  );

  return (
    <div className={className}>
      {slide("a")}
      {slide("b")}
    </div>
  );
}
