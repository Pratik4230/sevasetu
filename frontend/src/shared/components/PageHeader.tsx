interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="rounded-2xl border border-emerald-200/70 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-emerald-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-emerald-800/80">{subtitle}</p>}
    </div>
  );
}
