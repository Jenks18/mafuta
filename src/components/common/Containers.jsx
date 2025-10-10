import React from 'react';

export const Page = ({ children, className = '' }) => (
  <div className={`flex-1 overflow-y-auto ${className}`}>{children}</div>
);

export const Section = ({ children, className = '' }) => (
  <section className={`bg-white rounded-xl border border-gray-200 ${className}`}>{children}</section>
);

export const Stack = ({ children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);

export default { Page, Section, Stack };
