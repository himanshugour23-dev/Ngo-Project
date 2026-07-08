interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function SectionCard({ title, icon, children, fullWidth }: SectionCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 border ${fullWidth ? 'col-span-full' : ''}`}
      style={{
        background: 'var(--card)',
        borderColor: 'var(--border)',
        fontFamily: 'Nunito, sans-serif',
        boxShadow: '0 1px 8px rgba(30,42,26,0.05)',
      }}
    >
      <div className="flex items-center gap-2 mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        {icon && (
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(26,92,58,0.1)', color: 'var(--primary)' }}>
            {icon}
          </span>
        )}
        <h3 className="text-sm uppercase tracking-widest" style={{ color: 'var(--muted-foreground)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
