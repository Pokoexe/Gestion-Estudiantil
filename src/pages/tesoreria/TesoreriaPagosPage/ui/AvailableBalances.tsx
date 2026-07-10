import type { Currency } from "@shared/services/actions/tesoreria";

type AvailableItem = {
  currency: Currency;
  value: number;
  icon: React.FC<{ style?: React.CSSProperties }>;
  ac: { bg: string; fg: string };
  hint: string;
};

type Props = {
  available: AvailableItem[];
  money: (n: number) => string;
};

export function AvailableBalances({ available, money }: Props) {
  return (
    <div className="lg:col-span-1 flex flex-col gap-4">
      {available.map((k) => {
        const Icon = k.icon;
        return (
          <div key={k.currency} className="bg-edu-surface rounded-edu-card p-5 border border-edu-border-soft flex flex-col gap-2.5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-edu-ink-500 text-xs font-medium m-0 uppercase tracking-[0.05em]">Disponible · {k.currency}</p>
                <p className="text-edu-ink text-[1.6rem] font-bold mt-1 m-0">{money(k.value)}</p>
              </div>
              <div className="w-10 h-10 rounded-edu-control flex items-center justify-center shrink-0" style={{ backgroundColor: k.ac.bg }}>
                <Icon style={{ width: "20px", height: "20px", color: k.ac.fg }} />
              </div>
            </div>
            <p className="text-edu-ink-400 text-xs m-0">{k.hint}</p>
          </div>
        );
      })}
    </div>
  );
}
