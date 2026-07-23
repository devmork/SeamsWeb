import { Particles } from '@/components/ui/particles';

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/src/assets/backgrounds/dmc-building-nighty.png"
          alt="St. Lasalle Building"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.10] dark:grayscale"
        />

        <Particles className="absolute inset-0" quantity={150} />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <img
            src="/src/assets/logos/dmc-logo-white.png"
            alt="DMC College Foundation Logo"
            className="h-50 w-50 drop-shadow-lg"
          />
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-4xl font-extrabold italic tracking-wide text-white drop-shadow-md">
              SEAMS
            </h1>
          </div>
        </div>

        {/* Footer credit */}
        <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-white/60">
          Copyright © 2026 Powered by College of Computer Studies.
        </div>
      </div>
    </div>
  );
}
