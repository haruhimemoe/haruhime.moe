/**
 * @file src/components/showcase/TabsDemo.tsx
 * @desc /ui's Tabs demo: a Write / Preview / Both tab list with its three panels, tied by tabId
 *       and tabPanelId. A client component because the chosen tab is state.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

"use client";

import { type TabItem, Tabs, tabId, tabPanelId } from "@haruhimemoe/ui";
import { useState } from "react";
import { Demo } from "@/components/showcase/Demo";

type View = "write" | "preview" | "both";

const TABS: readonly TabItem<View>[] = [
  { id: "write", label: "Write" },
  { id: "preview", label: "Preview" },
  { id: "both", label: "Both" },
];

const PANELS: Record<View, string> = {
  write: "The BBCode source, as you type it.",
  preview: "The post as osu! shows it.",
  both: "Source and preview side by side.",
};

/**
 * @function TabsDemo
 * @returns {JSX.Element} the Tabs demo with its panels, then tabId and tabPanelId
 */
export function TabsDemo() {
  const [view, setView] = useState<View>("write");
  return (
    <>
      <Demo
        name="Tabs"
        note="An ARIA tab list for panels on the same page. Left and Right move and wrap, Home and End jump; only the chosen tab is in the Tab order."
      >
        <Tabs label="Editor view" idPrefix="ui-tabs" tabs={TABS} value={view} onChange={setView} />
        {TABS.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={tabPanelId("ui-tabs", tab.id)}
            aria-labelledby={tabId("ui-tabs", tab.id)}
            hidden={tab.id !== view}
            className="text-c2 text-sm"
          >
            {PANELS[tab.id]}
          </div>
        ))}
      </Demo>
      <Demo
        name="tabId"
        note={`The id of a tab's button: tabId("ui-tabs", "write") is "${tabId("ui-tabs", "write")}".`}
      />
      <Demo
        name="tabPanelId"
        note={`The id of its panel: tabPanelId("ui-tabs", "write") is "${tabPanelId("ui-tabs", "write")}".`}
      />
    </>
  );
}
