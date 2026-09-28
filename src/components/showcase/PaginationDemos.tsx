/**
 * @file src/components/showcase/PaginationDemos.tsx
 * @desc /ui's Pagination demo: links on the first, a middle and the last page, then buttons for
 *       results fetched in place, with no known page count. A client component because the link
 *       builder and the button mode's page change are callbacks.
 * @author David @dvhsh (https://dvh.sh)
 * @created Mon Sep 28, 2026
 * @modified Mon Sep 28, 2026
 */

"use client";

import { Pagination } from "@haruhimemoe/ui";
import { useState } from "react";
import { Demo } from "@/components/showcase/Demo";

/** The sample results in button mode run out after this page. */
const LAST_BUTTON_PAGE = 3;

/**
 * @function pageHref
 * @param page {number} a page number
 * @returns {string} a link back to /ui's Actions group; the page ignores the query
 */
const pageHref = (page: number): string => `/ui?page=${page}#actions`;

/**
 * @function PaginationDemos
 * @returns {JSX.Element} the Pagination demo in link and button mode
 */
export function PaginationDemos() {
  const [page, setPage] = useState(1);
  return (
    <Demo
      name="Pagination"
      note="Links around the page count on the first, a middle and the last page. Then buttons for results fetched in place, where the page count isn't known."
    >
      <Pagination
        aria-label="Pages, first page example"
        page={1}
        pageCount={5}
        hrefFor={pageHref}
      />
      <Pagination
        aria-label="Pages, middle page example"
        page={3}
        pageCount={5}
        hrefFor={pageHref}
      />
      <Pagination aria-label="Pages, last page example" page={5} pageCount={5} hrefFor={pageHref} />
      <Pagination
        aria-label="Pages, button example"
        page={page}
        pageCount={null}
        hasNext={page < LAST_BUTTON_PAGE}
        onPageChange={setPage}
      />
    </Demo>
  );
}
