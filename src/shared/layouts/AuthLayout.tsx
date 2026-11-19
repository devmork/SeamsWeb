import { Particles } from '@/components/ui/particles';

interface AuthLayoutProps {
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Form side — warm paper canvas with a quiet auth card */}
      <div className="flex flex-col gap-4 bg-canvas-soft p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-sm flex-col rounded-xl bg-surface p-6 text-ink shadow-soft ring-1 ring-hairline">
            <div className="flex-1">{children}</div>

            {footer && <div className="mt-8">{footer}</div>}

            <div className="mt-2 text-center text-xs text-ink-faint">
              Powered by CCS - Developers v0.0.0
            </div>
          </div>
        </div>
      </div>

      {/* The single "night" band — deep indigo with a lit constellation */}
      <div className="relative hidden overflow-hidden bg-night lg:block">
        <img
          src="/assets/backgrounds/dmc-building-nighty.png"
          alt="St. Lasalle Building"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-b from-night-deep/70 via-night/60 to-night-deep/80" />

        <Particles className="absolute inset-0" quantity={150} />

        <div className="relative flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
          <img
            src="/assets/logos/dmc-logo-white.png"
            alt="DMC College Foundation Logo"
            className="h-24 w-24 drop-shadow-lg"
          />
          <h1 className="type-display-1 text-white drop-shadow-md">SEAMS</h1>
        </div>

        <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-white/60">
          Copyright © 2026 Powered by College of Computer Studies.
        </div>
      </div>
    </div>
  );
}
