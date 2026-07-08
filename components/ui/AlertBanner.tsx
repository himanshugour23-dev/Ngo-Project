import { AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

interface AlertBannerProps {
  isComplete: boolean;
  missingFields: string[];
}

export function AlertBanner({ isComplete, missingFields }: AlertBannerProps) {
  if (isComplete) {
    return (
      <div className="flex items-center gap-4 px-5 py-4 rounded-xl border" style={{
        background: 'linear-gradient(135deg, #e8f5ee 0%, #d4edd9 100%)',
        borderColor: 'rgba(26,92,58,0.2)',
        fontFamily: 'Nunito, sans-serif'
      }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#1a5c3a' }}>
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm" style={{ color: '#1a5c3a', fontWeight: 700 }}>Profile Complete — You're ready to volunteer!</p>
          <p className="text-xs mt-0.5" style={{ color: '#2e7a50' }}>NGOs can now discover you and match you with needs in your area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 px-5 py-4 rounded-xl border" style={{
      background: 'linear-gradient(135deg, #fef8f0 0%, #fceedd 100%)',
      borderColor: 'rgba(194,90,42,0.25)',
      fontFamily: 'Nunito, sans-serif'
    }}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--accent)' }}>
        <AlertTriangle className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm" style={{ color: '#7a2c0a', fontWeight: 700 }}>
          Complete your profile to start volunteering
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#a04020' }}>
          Fill in all required fields before NGOs can see and match you with opportunities.
        </p>
        {missingFields.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {missingFields.map(f => (
              <span key={f} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(194,90,42,0.12)', color: '#a04020' }}>
                <ChevronRight className="w-3 h-3" />
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
