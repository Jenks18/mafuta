// Map tab keys to dynamic imports for prefetching
const importMap = {
  dashboard: () => import('../components/pages/DashboardPage.jsx'),
  fuel: () => import('../components/pages/FindFuelPage.jsx'),
  transactions: () => import('../components/pages/TransactionsPage.jsx'),
  cards: () => import('../components/pages/CardsPage.jsx'),
  more: () => import('../components/pages/MorePage.jsx'),
  refer: () => import('../components/pages/RewardsPage.jsx'),
  rewards: () => import('../components/pages/RewardsPage.jsx'),
  drivers: () => import('../components/pages/DriversPage.jsx'),
  vehicles: () => import('../components/pages/VehiclesPage.jsx'),
  'trucks-map': () => import('../components/pages/MapPage.jsx'),
  'payroll-overview': () => import('../components/pages/PayrollPage.jsx'),
  'payroll-history': () => import('../components/pages/PayrollPage.jsx'),
};

export function prefetchByKey(key) {
  const loader = importMap[key];
  if (typeof loader === 'function') {
    // Fire-and-forget; errors are fine (ignored)
    try { loader(); } catch {}
  }
}

export function prefetchCommonPagesIdle() {
  const keys = ['fuel', 'transactions', 'cards', 'more'];
  const run = () => keys.forEach((k) => prefetchByKey(k));
  if ('requestIdleCallback' in window) {
    // @ts-ignore
    window.requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 1200);
  }
}
