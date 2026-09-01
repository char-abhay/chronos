"use client";

import { Component, type ReactNode } from "react";
import { setSceneActive } from "@/lib/scene/sceneState";

/**
 * Keeps a failure in the sky from taking down the portfolio.
 *
 * The decorative layers -- ScrollProvider, Atmosphere, SceneRoot, Chrome
 * -- all mount in the root layout, above `{children}`. Without a
 * boundary, a render throw anywhere in the WebGL tree unwinds past
 * <main> to the React root and production serves a blank page reading
 * "Application error". A bug in the star field would cost a visitor the
 * resume. Scene.tsx claims the canvas is decorative in the strictest
 * sense; this file is what makes that structurally true rather than a
 * statement of intent.
 *
 * The fallback is deliberately `null`. A broken sky should look like no
 * sky -- the CSS atmosphere underneath is already a designed still
 * frame, and an apology rendered over it would be worse than silence.
 *
 * A class is not a style choice: getDerivedStateFromError and
 * componentDidCatch are the only error-catching API React exposes, and
 * neither has a hook equivalent.
 */
export class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    /* React unmounts the subtree on error, so Scene's cleanup effect
       should already have run this. It is called again anyway: the
       entire purpose of this file is to not depend on the failing path
       behaving correctly on its way down. Without it the 2D star field
       stays suppressed and the sky is empty rather than merely flat. */
    setSceneActive(false);
    console.error("[scene] WebGL layer failed, falling back to the CSS atmosphere", error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
