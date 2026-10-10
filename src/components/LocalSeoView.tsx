import React, { useState } from 'react';
import { AuditResult } from '../types/seo';
import { 
  MapPin, 
  Phone, 
  Building, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Sparkles, 
  Info 
} from 'lucide-react';

interface LocalSeoViewProps {
  audit: AuditResult;
}

export const LocalSeoView: React.FC<LocalSeoViewProps> = ({ audit }) => {
  const [businessName, setBusinessName] = useState(audit.config.businessName || 'EcoTrek Gear HQ');
  const [address, setAddress] = useState('100 Boulder Ridge Way, Denver, CO 80202');
  const [phone, setPhone] = useState('+1 (303) 555-0192');
  const [copiedSchema, setCopiedSchema] = useState(false);

  const localSchemaJson = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: businessName,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.split(',')[0] || address,
      addressLocality: 'Denver',
      addressRegion: 'CO',
      postalCode: '80202',
      addressCountry: 'US',
    },
    url: audit.url,
  };

  const schemaString = JSON.stringify(localSchemaJson, null, 2);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemaString);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span>Local SEO & Geographic Relevance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            NAP consistency auditing, LocalBusiness structured JSON-LD validation, and regional search signals.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            {audit.config.targetCountry || 'United States'}
          </span>
        </div>
      </div>

      {/* NAP Audit Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Business Name</span>
            <Building className="w-4 h-4 text-blue-400" />
          </div>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <p className="text-[11px] text-slate-500">Must match Google Business Profile exactly.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Primary Street Address</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <p className="text-[11px] text-slate-500">Consistent formatting on footer & citations.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Direct Phone Line</span>
            <Phone className="w-4 h-4 text-amber-400" />
          </div>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <p className="text-[11px] text-slate-500">Ensure tel: clickable hyperlinks exist in DOM.</p>
        </div>
      </div>

      {/* LocalBusiness JSON-LD Schema Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Generated LocalBusiness Schema (JSON-LD)
            </h3>
            <p className="text-xs text-slate-400">
              Embed directly into your footer or contact page &lt;head&gt;
            </p>
          </div>

          <button
            onClick={handleCopySchema}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition"
          >
            {copiedSchema ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Schema</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON-LD</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
          {schemaString}
        </div>
      </div>
    </div>
  );
};
