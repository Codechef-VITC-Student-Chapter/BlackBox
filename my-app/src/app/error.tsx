"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="glass-panel max-w-lg space-y-6 p-8 text-center">
      <div className="font-mono text-sm uppercase tracking-[0.25em] text-danger">
        Runtime Error
      </div>
      <h2 className="font-heading text-3xl font-bold text-text">
        Recovery interface crashed
      </h2>
      <p className="font-mono text-sm text-secondary-text">
        The current route failed to render. Retry the recovery sequence.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg border border-primary/50 px-5 py-3 font-mono text-sm text-primary transition-colors hover:bg-primary hover:text-background"
      >
        RETRY
      </button>
    </div>
  );
}
