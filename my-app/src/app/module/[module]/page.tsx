import { GAME_CONFIG } from "@/config/game";

type ModulePageProps = {
  params: Promise<{
    module: string;
  }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { module } = await params;

  return (
    <section className="glass-panel w-full max-w-3xl p-8 text-left">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-primary">
        Current Module
      </p>
      <h1 className="mt-4 font-heading text-4xl font-bold text-white">
        Module {module}
      </h1>
      <p className="mt-6 font-mono text-sm leading-7 text-secondary-text">
        Core platform access is active. Future module teams can replace this
        screen with their module UI while keeping the shared authentication,
        progress, submission, scoring, and route protection layers.
      </p>
      <div className="mt-8 border-t border-border pt-6 font-mono text-xs uppercase tracking-widest text-secondary-text">
        Modules {GAME_CONFIG.firstModule}-{GAME_CONFIG.totalModules} are
        guarded centrally.
      </div>
    </section>
  );
}
