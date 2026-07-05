{/* Matrícula y asistencia + resumen académico */ }
<div className="grid grid-cols-[1.7fr_1fr] gap-4 items-stretch">
    {/* Gráfico principal */}
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
        <SectionHeader title="Matrícula y asistencia" hint="Últimos 6 meses" />
        <div className="px-3 pt-[18px] pb-2 flex-1">
            <div className="flex gap-[18px] px-2.5 pb-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-edu-ink-500">
                    <span className="w-2.5 h-2.5 rounded-[3px] bg-edu-primary" /> Matrícula
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-edu-ink-500">
                    <span className="w-2.5 h-2.5 rounded-[3px] bg-edu-purple" /> Asistencia %
                </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={ENROLLMENT} margin={{ top: 6, right: 12, left: -8, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradMatricula" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color.primary} stopOpacity={0.28} />
                            <stop offset="100%" stopColor={color.primary} stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gradAsistencia" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color.purple} stopOpacity={0.22} />
                            <stop offset="100%" stopColor={color.purple} stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={color.borderSoft} vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: color.ink500 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={40} domain={[540, 640]} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: color.ink400 }} axisLine={false} tickLine={false} width={32} domain={[70, 100]} />
                    <Tooltip content={<TooltipBox />} />
                    <Area yAxisId="left" type="monotone" dataKey="matricula" name="Matrícula" stroke={color.primary} strokeWidth={2.5} fill="url(#gradMatricula)" dot={{ r: 3, fill: color.primary, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <Area yAxisId="right" type="monotone" dataKey="asistencia" name="Asistencia %" stroke={color.purple} strokeWidth={2.5} fill="url(#gradAsistencia)" dot={{ r: 3, fill: color.purple, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>

    {/* Resumen académico */}
    <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
        <SectionHeader title="Resumen académico" />
        <div className="p-4 flex flex-col gap-3">
            {[
                { label: "Promedio institucional", value: "15,8", unit: "/20", tone: accent.blue, bar: 79 },
                { label: "Asistencia promedio", value: "91", unit: "%", tone: accent.purple, bar: 91 },
                { label: "Materias en reparación", value: "6", unit: "materias", tone: accent.amber, bar: 24 },
            ].map((item) => (
                <div key={item.label} className="bg-edu-subtle rounded-edu-control px-4 py-3.5 border border-edu-border-soft">
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-[0.78rem] text-edu-ink-500 font-medium">{item.label}</span>
                        <span className="text-[1.1rem] font-bold text-edu-ink">
                            {item.value}
                            <span className="text-[0.72rem] text-edu-ink-400 font-medium"> {item.unit}</span>
                        </span>
                    </div>
                    <div className="h-1.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
                        <div
                            className="h-full rounded-edu-pill"
                            style={{ width: `${item.bar}%`, backgroundColor: item.tone.fg }}
                        />
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>


{/* Cierre de lapso */ }
<div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden flex flex-col">
    <SectionHeader title="Cierre de lapso" hint="2026-I" />
    <div className="px-5 py-[18px] flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-3 bg-edu-primary-50 rounded-edu-control px-4 py-3.5">
            <div className="w-10 h-10 rounded-edu-control bg-edu-surface flex items-center justify-center shrink-0">
                <CalendarDays style={{ width: "20px", height: "20px", color: color.primary }} />
            </div>
            <div>
                <div className="text-[0.72rem] text-edu-ink-500 font-medium uppercase tracking-[0.05em]">Fin del lapso</div>
                <div className="text-[1.05rem] font-bold text-edu-ink">31 jul 2026</div>
            </div>
        </div>

        <div>
            <div className="flex justify-between items-baseline mb-2">
                <span className="text-[0.8rem] text-edu-ink-500 font-medium">Progreso del período</span>
                <span className="text-[0.9rem] font-bold text-edu-primary">65 %</span>
            </div>
            <div className="h-2.5 bg-edu-border-soft rounded-edu-pill overflow-hidden">
                <div className="h-full w-[65%] rounded-edu-pill bg-[linear-gradient(90deg,#1a56db,#7c3aed)]" />
            </div>
            <div className="text-[0.72rem] text-edu-ink-400 mt-1.5">Faltan 30 días para el cierre</div>
        </div>

        <div className="flex flex-col gap-2.5 mt-0.5">
            <span className="text-[0.72rem] text-edu-ink-500 font-semibold uppercase tracking-[0.05em]">Hitos</span>
            {MILESTONES.map((m) => (
                <div key={m.label} className="flex items-center gap-2.5">
                    {m.done ? (
                        <CheckCircle2 style={{ width: "18px", height: "18px", color: color.success, flexShrink: 0 }} />
                    ) : (
                        <Circle style={{ width: "18px", height: "18px", color: color.ink300, flexShrink: 0 }} />
                    )}
                    <span className={`text-[0.85rem] font-medium ${m.done ? "text-edu-ink-700" : "text-edu-ink-500"}`}>{m.label}</span>
                    <span
                        className={`ml-auto text-[0.68rem] font-semibold px-2 py-0.5 rounded-edu-pill ${m.done ? "bg-edu-success-bg text-edu-success" : "bg-edu-subtle text-edu-ink-400"}`}
                    >
                        {m.done ? "Completado" : "Pendiente"}
                    </span>
                </div>
            ))}
        </div>
    </div>
</div>