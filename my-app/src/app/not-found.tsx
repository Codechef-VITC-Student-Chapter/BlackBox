export default function NotFound() {
  return (
    <section className="glass-panel max-w-xl space-y-4 p-8 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-danger">
        404
      </p>
      <h1 className="font-heading text-4xl font-bold text-text">
        Route not found
      </h1>
      <p className="font-mono text-sm text-secondary-text">
        This recovery path does not exist.
      </p>
    </section>
  );
}
