/**
 * @file src/components/brand/ProductFamily.tsx
 * @desc /brand's product family section, passed to BrandPage at the end: each tool's icon, hue
 *       and accent color, with its icon to download. Only haruhime.moe shows it; a tool's own
 *       /brand links here through BrandPage's Family section instead.
 * @author David @dvhsh (https://dvh.sh)
 * @created Sun Oct 4, 2026
 * @modified Sun Oct 4, 2026
 */

import { palette } from "@haruhimemoe/brand/palette";
import { Card, linkClasses } from "@haruhimemoe/ui";
import { TOOLS } from "@/constants/tools";

/**
 * @function ProductFamily
 * @returns {JSX.Element} the product family card, one item per tool
 */
export function ProductFamily() {
  return (
    <Card title="Product family">
      <p className="mb-4 text-sm">
        Each tool has its own icon and hue. The rest of its palette follows from the hue, the same
        way as the colors above.
      </p>
      <ul className="grid gap-4 sm:grid-cols-3">
        {TOOLS.map((tool) => {
          const hex = palette(tool.hue).h1;
          return (
            <li key={tool.name} className="flex items-center gap-3">
              {/* biome-ignore lint/performance/noImgElement: static SVG, no optimization needed */}
              <img src={`/${tool.icon}`} alt="" width={64} height={64} className="size-12" />
              <span className="text-sm">
                <span className="block font-bold text-c1">{tool.name}</span>
                <span className="flex items-center gap-2 text-c4">
                  <span
                    aria-hidden="true"
                    className="size-3 rounded-full"
                    style={{ backgroundColor: hex }}
                  />
                  hue {tool.hue}, {hex}
                </span>
                <a
                  href={`/${tool.icon}`}
                  download
                  className={linkClasses({ className: "mt-1 block" })}
                >
                  Download {tool.name} icon
                </a>
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
