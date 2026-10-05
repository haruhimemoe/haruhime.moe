/**
 * @file src/components/showcase/MapDemos.tsx
 * @desc /ui's map display demos (ui 0.16.0): MapCard rows and cards over no background, the
 *       cover and a blurred cover, MapSetCard, MapGroup, MapCover, mapCoverUrl,
 *       MAP_STATUS_LABELS, MapPreviewButton, stopMapPreview and MapCopyScope. The maps are real
 *       osu! maps used as sample data, values rounded. Server-rendered.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Oct 5, 2026
 * @modified Mon Oct 5, 2026
 */

import {
  MAP_STATUS_LABELS,
  MapCard,
  MapCopyScope,
  MapCover,
  MapGroup,
  MapPreviewButton,
  MapSetCard,
  mapCoverUrl,
} from "@haruhimemoe/ui";
import { Demo } from "@/components/showcase/Demo";
import { StopPreviewDemo } from "@/components/showcase/StopPreviewDemo";

/** Sample data: xi - FREEDOM DiVE [FOUR DIMENSIONS], values rounded. */
const DIVE = {
  beatmapsetId: 39804,
  artist: "xi",
  title: "FREEDOM DiVE",
  version: "FOUR DIMENSIONS",
  creator: "Nakagawa-Kanon",
  starRating: 7.04,
  cs: 4,
  ar: 9,
  od: 8,
  hp: 6,
  bpm: 222,
  lengthSeconds: 263,
  status: "ranked",
} as const;
const BACKGROUNDS = ["none", "cover", "blur"] as const;

/**
 * @function MapDemos
 * @returns {JSX.Element} one demo per map display export
 */
export function MapDemos() {
  return (
    <>
      <Demo
        name="MapCard"
        note="One map from plain props, as a row or a card, over no background, its cover or a blurred cover. Sample data: a real osu! map, values rounded. Copy ID is on in the rows."
      >
        <MapCopyScope>
          <ul className="flex flex-col gap-2">
            {BACKGROUNDS.map((background) => (
              <MapCard
                key={background}
                as="li"
                beatmapId={129891}
                map={DIVE}
                background={background}
                slot={{ label: "NM1" }}
                copyId
              />
            ))}
          </ul>
        </MapCopyScope>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {BACKGROUNDS.map((background) => (
            <MapCard
              key={background}
              layout="card"
              beatmapId={129891}
              map={DIVE}
              background={background}
              titleAs="h4"
            />
          ))}
        </div>
      </Demo>

      <Demo
        name="MapSetCard"
        note="A set and its difficulties, each with Copy ID named by version. Sample data."
      >
        <MapSetCard
          beatmapsetId={292301}
          artist="xi"
          title="Blue Zenith"
          creator="Asphyxia"
          status="ranked"
          difficulties={[
            {
              beatmapId: 658127,
              version: "FOUR DIMENSIONS",
              stars: 7.3,
              stats: { ar: 9.3, bpm: 200 },
            },
          ]}
          copyId
        />
      </Demo>

      <Demo
        name="MapGroup"
        note="A bucket: heading with count of target, its maps and a dashed row per empty slot. Sample data."
      >
        <MapGroup title="NM" count={1} target={3} detail="Nomod" emptySlots={2} headingLevel={4}>
          <MapCard
            as="li"
            beatmapId={129891}
            map={DIVE}
            slot={{ label: "NM1" }}
            density="compact"
          />
        </MapGroup>
      </Demo>

      <Demo
        name="MapCover"
        note="A set's cover as a plain lazy image, sized from osu!'s file. With no set id it is a b5 placeholder."
      >
        <div className="flex flex-wrap items-end gap-3">
          <MapCover beatmapsetId={39804} className="size-12" />
          <MapCover beatmapsetId={null} className="size-12" />
          <MapCover
            beatmapsetId={39804}
            size="cover"
            alt="FREEDOM DiVE cover (sample)"
            className="w-full max-w-md"
          />
        </div>
      </Demo>

      <Demo
        name="mapCoverUrl"
        note="The assets.ppy.sh cover URL for a set and size, or null for an id that isn't a positive whole number."
      >
        <code className="break-all text-c2 text-sm">{mapCoverUrl(39804, "card")}</code>
      </Demo>

      <Demo name="MAP_STATUS_LABELS" note="How osu!'s set statuses read on a card.">
        <p className="text-c2 text-sm">{Object.values(MAP_STATUS_LABELS).join(", ")}</p>
      </Demo>

      <Demo
        name="MapPreviewButton"
        note="Plays the set's preview clip from b.ppy.sh at half volume; one clip per page."
      >
        <div className="size-12">
          <MapPreviewButton beatmapsetId={39804} song="xi - FREEDOM DiVE" />
        </div>
      </Demo>

      <Demo name="stopMapPreview" note="Stops whatever clip is playing, for route changes.">
        <StopPreviewDemo />
      </Demo>

      <Demo
        name="MapCopyScope"
        note="Inside one scope only the Copy ID pressed last says Copied. The MapCard rows above share one."
      >
        <MapCopyScope>
          <ul className="flex flex-col gap-2">
            <MapCard as="li" beatmapId={129891} map={DIVE} density="compact" copyId />
            <MapCard as="li" beatmapId={658127} density="compact" copyId />
          </ul>
        </MapCopyScope>
      </Demo>
    </>
  );
}
