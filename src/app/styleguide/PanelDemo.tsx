"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";

/** Isolates the only client state on the style guide. */
export function PanelDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open panel
      </Button>

      <Panel open={open} onClose={() => setOpen(false)} title="Profile">
        <div className="space-y-4 text-secondary">
          <p>
            Tab moves only within this panel. Escape closes it. When it
            closes, focus returns to the button that opened it — check the
            focus ring lands back on “Open panel”.
          </p>
          <p>
            Content inside a panel is plain document flow: headings, lists,
            links. No scroll narrative, no 3D, nothing that needs
            explaining.
          </p>
          <a
            href="#panel"
            className="inline-block text-secondary underline underline-offset-4"
          >
            A focusable link, to test the trap
          </a>
        </div>
      </Panel>
    </>
  );
}
