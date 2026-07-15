export default function HiddenAccessPage() {
  return (
    <section className="glass-panel max-w-xl space-y-4 p-8 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-primary">
        Access Node
      </p>
      <h1 className="font-heading text-4xl font-bold text-text">
        Hidden route detected
      </h1>
      <p className="font-mono text-sm text-secondary-text">
        This recovery path is online and waiting for validation.
      </p>
    </section>
  );
}
