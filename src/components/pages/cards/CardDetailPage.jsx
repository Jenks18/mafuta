import React, { useMemo, useState } from 'react';
import DigitalCard from '../../common/DigitalCard';

const currencyKES = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(Math.max(0, Math.round(n || 0)));

const StatBlock = ({ title, children, right }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between">
    <div>
      <div className="text-xs font-semibold tracking-wide text-gray-600 mb-2">{title}</div>
      <div className="text-gray-900">{children}</div>
    </div>
    {right}
  </div>
);

const Labeled = ({ label, value }) => (
  <div className="flex items-center justify-between py-1.5">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-sm font-medium text-gray-900">{value}</div>
  </div>
);

const SmallTag = ({ children }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{children}</span>
);

const SpendChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.amount), 100);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 h-80">
      <div className="h-full flex items-end gap-4">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-emerald-100 rounded-sm" style={{ height: '100%' }}>
              <div className="bg-emerald-500 rounded-sm" style={{ height: `${(d.amount / max) * 100}%` }} />
            </div>
            <div className="mt-2 text-xs text-gray-500">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CardDetailPage = ({ card, onBack, onToggleStatus }) => {
  const [driver, setDriver] = useState(card?.assignedTo || 'Unassigned');
  const [vehicle, setVehicle] = useState('KDJ 123A');
  const [unlockSecurity, setUnlockSecurity] = useState(false);
  const [telematics, setTelematics] = useState('Monitor');
  const [tab, setTab] = useState('overview'); // 'overview' | 'more'

  const chartData = useMemo(() => (
    [
      { label: 'May 22', amount: 8627 },
      { label: 'May 23', amount: 9410 },
      { label: 'May 24', amount: 0 },
      { label: 'May 25', amount: 0 },
      { label: 'May 26', amount: 0 },
      { label: 'May 27', amount: 0 },
      { label: 'May 28', amount: 0 },
    ]
  ), []);

  if (!card) return null;

  const isActive = card.status === 'ACTIVE';

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 md:px-6 py-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div className="text-lg font-semibold text-gray-900">Back</div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 w-full max-w-md">
          <div className="grid grid-cols-2 text-sm font-medium">
            <button onClick={() => setTab('overview')} className={`py-2 rounded-lg ${tab==='overview' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>Overview</button>
            <button onClick={() => setTab('more')} className={`py-2 rounded-lg ${tab==='more' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>More info</button>
          </div>
        </div>

  {tab === 'overview' && (
  <>
  {/* Digital Twin - realistic, fixed aspect ratio */}
  <div className="flex justify-end">
    <div className="w-full flex justify-center md:justify-end">
      <DigitalCard card={card} size="real" className="mb-6" />
    </div>
  </div>
  {/* Header card status */}
  <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold text-gray-900">Card •••• {card.id.slice(-4)}</div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
            <button
              onClick={() => onToggleStatus && onToggleStatus(card.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${isActive ? 'border-red-300 text-red-700 hover:bg-red-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}
            >
              {isActive ? 'Deactivate Card' : 'Activate Card'}
            </button>
          </div>
        </div>

        {/* Three panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Spend Limits */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
              <div className="text-xs font-semibold tracking-wide text-gray-600 mb-3">SPEND LIMITS</div>
              <Labeled label="Per transaction" value={currencyKES(15000)} />
              <Labeled label="Daily" value={currencyKES(15000)} />
              <Labeled label="Weekly" value="-" />
              <div className="mt-3 flex items-center gap-2 text-gray-500 text-xs">
                <SmallTag>LA</SmallTag>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m4 0h-1v-4h-1m4 0h-1v-4h-1"/></svg>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
              <div className="text-xs font-semibold tracking-wide text-gray-600 mb-3">ASSIGNMENT</div>
              <div className="text-sm text-gray-600 mb-1">Driver</div>
              <select value={driver} onChange={(e)=>setDriver(e.target.value)} className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Michael A</option>
                <option>Sarah J</option>
                <option>John S</option>
                <option>Unassigned</option>
              </select>
              <div className="text-sm text-gray-600 mb-1">Vehicle</div>
              <select value={vehicle} onChange={(e)=>setVehicle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>KDJ 123A</option>
                <option>KBX 456B</option>
                <option>LA046</option>
              </select>
            </div>
          </div>

          {/* Card Security */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
              <div className="text-xs font-semibold tracking-wide text-gray-600 mb-3">CARD SECURITY</div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-700">Card Unlock Security</div>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={unlockSecurity} onChange={(e)=>setUnlockSecurity(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors relative">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
              </div>
              <div>
                <div className="text-sm text-gray-700 mb-1">Telematics Security</div>
                <select value={telematics} onChange={(e)=>setTelematics(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Monitor</option>
                  <option>Strict</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

  {/* Spend chart */}
  <SpendChart data={chartData} />
  </>
  )}

        {tab === 'more' && (
          <div className="space-y-6">
            {/* Realistic credit card presentation */}
            <div className="w-full flex justify-center md:justify-start">
              <DigitalCard card={card} size="real" className="mb-2" />
            </div>
            {/* Icon tile like your screenshot */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/90 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-900">Manage your card with ease</div>
                <div className="text-sm text-gray-600">Reassign, activate/deactivate instantly, set spend limits, and control usage times. Security features help prevent misuse.</div>
              </div>
            </div>

            {/* Fine print-like section */}
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5">
              <div className="text-lg font-bold text-gray-900 mb-2">Fine print</div>
              <div className="text-sm text-gray-700 space-y-2">
                <p>Transactions must comply with company policy. Edits to limits apply immediately and can affect pending authorizations.</p>
                <p>Telematics security can restrict fueling events that don’t match the assigned vehicle location.</p>
                <p>For lost or stolen cards, deactivate immediately and contact support.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetailPage;
