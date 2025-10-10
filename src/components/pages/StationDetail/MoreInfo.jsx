import React from 'react';
import { useStore } from '../../../store';
import CardSummary from './CardSummary';
import DigitalCard from '../../common/DigitalCard';

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-3">{title}</h3>
    <div className="rounded-2xl border border-gray-200 bg-white p-4">{children}</div>
  </div>
);

const Bullet = ({ children }) => (
  <li className="flex items-start gap-2 text-gray-700">
    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
    <span>{children}</span>
  </li>
);

const MoreInfo = ({ station }) => {
  const { cards } = useStore();
  const primaryCard = cards?.[0];
  const name = station?.name || 'Shell Station';
  const address = station?.address || '—';
  const hours = 'Open 24 hours';
  const services = ['Pay at pump', 'Restrooms', 'Air & water'];

  return (
    <div>
      <Section title="Offer details">
        <ul className="space-y-2 text-sm">
          <Bullet>Cash back shown is per liter (¢/L). Claim before you pay.</Bullet>
          <Bullet>Offer applies for this location only: <span className="font-medium">{name}</span>.</Bullet>
          <Bullet>Fuel prices are estimates and may vary at time of purchase.</Bullet>
        </ul>
      </Section>

      <Section title="Receipt requirements">
        <ul className="space-y-2 text-sm">
          <Bullet>Receipt must show station name, date/time, and total liters purchased.</Bullet>
          <Bullet>Grade purchased (Regular/Midgrade/Premium) speeds up processing.</Bullet>
          <Bullet>Clear, full photo of the entire receipt (no cropping).</Bullet>
        </ul>
      </Section>

      <Section title="Eligible purchases">
        <ul className="space-y-2 text-sm">
          <Bullet>Eligible for fuel only. Non‑fuel items are excluded from fuel cash back.</Bullet>
          <Bullet>Prepaid/gift cards, tobacco, alcohol, lottery, and money services are excluded.</Bullet>
          <Bullet>Store promos may reduce per‑liter cash back by up to 5¢/L.</Bullet>
        </ul>
      </Section>

      <Section title="Limits & timing">
        <ul className="space-y-2 text-sm">
          <Bullet>Purchase within 4 hours after claiming the offer.</Bullet>
          <Bullet>Limit two claims per 24 hours per account.</Bullet>
          <Bullet>Cash back is typically approved within 48 hours after receipt submission.</Bullet>
        </ul>
      </Section>

      <Section title="About this location">
        <div className="text-sm text-gray-700 space-y-2">
          <div><span className="font-medium">Address:</span> {address}</div>
          <div><span className="font-medium">Hours:</span> {hours}</div>
          <div>
            <span className="font-medium">Services:</span> {services.join(', ')}
          </div>
        </div>
      </Section>

      {/* Keep a compact card summary in this view */}
      <Section title="Your card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-1 md:sticky md:top-20">
            <DigitalCard card={primaryCard} size="compact" className="md:max-w-sm" />
          </div>
          <div className="md:col-span-2">
            <CardSummary card={primaryCard} />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default MoreInfo;
