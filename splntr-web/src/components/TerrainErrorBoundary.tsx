"use client";

import { Component, type ReactNode } from "react";

/**
 * Catches any render-time failure inside the WebGL hero (context creation
 * errors, shader compile failures on unusual GPUs, etc.) so it degrades to
 * the CSS fallback grid instead of leaving a blank hero — and logs the real
 * error to the console so it's diagnosable from a screenshot.
 */
export default class TerrainErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error("[TerrainHero] render error, falling back to static grid:", error, info);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
