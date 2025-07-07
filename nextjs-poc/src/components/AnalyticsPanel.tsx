interface AnalyticsMetric {
  label: string;
  value: string | number;
}

interface AnalyticsPanelProps {
  metrics: AnalyticsMetric[];
}

export const AnalyticsPanel = ({ metrics }: AnalyticsPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Snapshot</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {metrics.map(m => (
          <div key={m.label} className="text-center">
            <p className="text-2xl font-bold text-gray-900 mb-1">{m.value}</p>
            <p className="text-sm text-gray-600">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 