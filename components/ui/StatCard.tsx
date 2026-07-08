interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: boolean;
}

export function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div
      className="flex flex-col items-center gap-1 p-4 rounded-xl text-center"
      style={{
        background: accent ? 'var(--primary)' : 'var(--muted)',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <div className="mb-1" style={{ color: accent ? '#9dd8b8' : 'var(--muted-foreground)' }}>
        {icon}
      </div>
      <span
        className="text-xs uppercase tracking-widest"
        style={{
          color: accent ? 'rgba(245,240,232,0.65)' : 'var(--muted-foreground)',
          fontFamily: 'DM Mono, monospace',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: accent ? '#ffffff' : 'var(--foreground)',
          fontWeight: 700,
          fontSize: '1.05rem',
        }}
      >
        {value}
      </span>
    </div>
  );
}
