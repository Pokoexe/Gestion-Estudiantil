import { useLanding } from "./functions/useLanding";
import { LandingView } from "./ui/LandingView";

export function LandingPage() {
  const { config, onLogin, onEnroll } = useLanding();
  return (
    <div className="min-h-screen w-full">
      <LandingView config={config} onLogin={onLogin} onEnroll={onEnroll} />
    </div>
  );
}
