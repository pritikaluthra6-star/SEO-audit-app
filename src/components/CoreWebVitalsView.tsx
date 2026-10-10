import React, { useState } from 'react';
import { CoreWebVitalsData } from '../types/seo';
import { 
  Zap, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  Activity, 
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { runPageSpeed } from '../services/api';

interface CoreWebVitalsViewProps {
  initialData?: CoreWebVitalsData;
  targetUrl: string;
}

export const CoreWebVitalsView: React.FC<CoreWebVitalsViewProps> = ({
  initialData,
  targetUrl,
}) => {
  const [data, setData] = useState<CoreWebVitalsData | undefined>(initialData);
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRunAnalysis = async (selectedDevice: 'mobile' | 'desktop') => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await runPageSpeed(targetUrl, selectedDevice);
      setData(result);
      setDevice(selectedDevice);
    } catch (err: any) {
      setErrorMsg(err.message || 'PageSpeed request failed. Check internet access or quota.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMetricRating = (rating: 'good' | 'needs_improvement' | 'poor') => {
    switch (rating) {
      case 'good':
        return <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Good</span>;
      case 'needs_improvement':
        return <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Needs Improvement</span>;
      case 'poor':
        return <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Poor</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30';
    if (score >= 50) return 'text-amber-400 border-amber-500/30';
    return 'text-rose-400 border-rose-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Google PageSpeed Insights & Core Web Vitals</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Lighthouse lab metrics, user experience signals, and automated resource optimization diagnostics.
          </p>
        </div>

        {/* Device Switcher & Re-run */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center space-x-1">
            <button
              onClick={() => handleRunAnalysis('mobile')}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                device === 'mobile'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => handleRunAnalysis('desktop')}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                device === 'desktop'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          <button
            onClick={() => handleRunAnalysis(device)}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Re-run PageSpeed analysis"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {data ? (
        <>
          {/* Lighthouse Category Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Performance', score: data.performanceScore },
              { label: 'Accessibility', score: data.accessibilityScore },
              { label: 'Best Practices', score: data.bestPracticesScore },
              { label: 'Lighthouse SEO', score: data.seoScore },
            ].map((cat, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  {cat.label}
                </div>
                <div className={`text-3xl font-black ${getScoreColor(cat.score).split(' ')[0]}`}>
                  {cat.score}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">out of 100</div>
              </div>
            ))}
          </div>

          {/* Core Web Vitals Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* LCP */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">LCP</span>
                {getMetricRating(data.lcp.rating)}
              </div>
              <div className="text-2xl font-black text-white">
                {data.lcp.value} {data.lcp.unit}
              </div>
              <p className="text-[11px] text-slate-400">
                Largest Contentful Paint (Goal &lt; 2.5s)
              </p>
            </div>

            {/* CLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">CLS</span>
                {getMetricRating(data.cls.rating)}
              </div>
              <div className="text-2xl font-black text-white">
                {data.cls.value}
              </div>
              <p className="text-[11px] text-slate-400">
                Cumulative Layout Shift (Goal &lt; 0.1)
              </p>
            </div>

            {/* FCP */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">FCP</span>
                {getMetricRating(data.fcp.rating)}
              </div>
              <div className="text-2xl font-black text-white">
                {data.fcp.value} {data.fcp.unit}
              </div>
              <p className="text-[11px] text-slate-400">
                First Contentful Paint (Goal &lt; 1.8s)
              </p>
            </div>

            {/* TBT */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">TBT</span>
                {getMetricRating(data.tbt.rating)}
              </div>
              <div className="text-2xl font-black text-white">
                {data.tbt.value} {data.tbt.unit}
              </div>
              <p className="text-[11px] text-slate-400">
                Total Blocking Time (Goal &lt; 200ms)
              </p>
            </div>

            {/* Speed Index */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Speed Index</span>
                {getMetricRating(data.speedIndex.rating)}
              </div>
              <div className="text-2xl font-black text-white">
                {data.speedIndex.value} {data.speedIndex.unit}
              </div>
              <p className="text-[11px] text-slate-400">
                Visual display speed (Goal &lt; 3.4s)
              </p>
            </div>
          </div>

          {/* Opportunities & Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opportunities */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Performance Opportunities</span>
              </h3>

              {data.opportunities.length > 0 ? (
                <div className="space-y-2.5">
                  {data.opportunities.map((opp, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-200">{opp.title}</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {opp.savings}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No major resource bottleneck opportunities flagged.</p>
              )}
            </div>

            {/* Diagnostics */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Diagnostics & Execution</span>
              </h3>

              {data.diagnostics.length > 0 ? (
                <div className="space-y-2.5">
                  {data.diagnostics.map((diag, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-200">{diag.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {diag.displayValue}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {diag.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Diagnostic signals within standard thresholds.</p>
              )}
            </div>
          </div>

          {/* Lab vs Field Measurement Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300">Data Source & Lab Measurement Notice:</strong> Test executed on{' '}
              {new Date(data.testedAt).toLocaleTimeString()} using {data.source} under simulated {data.device} network throttling. Lab metrics measure synthetic loads in a controlled environment; real user field data (Chrome User Experience Report) may vary based on user hardware and connection quality.
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <p className="text-xs text-slate-400">No Core Web Vitals data recorded yet for this session.</p>
          <button
            onClick={() => handleRunAnalysis('mobile')}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
          >
            Run PageSpeed Insights Now
          </button>
        </div>
      )}
    </div>
  );
};
