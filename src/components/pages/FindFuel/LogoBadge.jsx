import React, { useMemo, useState } from 'react';

const brandRemoteFallback = (brand) => {
  if (!brand) return '';
  const b = String(brand).toLowerCase();
  // Use stable public sources; extend with other brands as needed
  // Use Special:FilePath for a stable redirect to the current raw SVG
  if (b === 'shell') return 'https://commons.wikimedia.org/wiki/Special:FilePath/Shell_logo.svg';
  return '';
};

const LogoBadge = ({ src, alt = 'Logo', size = 40, text = 'S', brand }) => {
  const dim = typeof size === 'number' ? `${size}px` : size;
  const brandLower = (brand || '').toString().trim().toLowerCase();
  const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
  const localSvg = brandLower ? `${base}logos/${brandLower}.svg` : '';
  const localPng = brandLower ? `${base}logos/${brandLower}.png` : '';
  const remote = useMemo(() => brandRemoteFallback(brandLower), [brandLower]);
  // Normalize provided src: if it's a root-relative local path, prefix with BASE_URL
  const normalizedSrc = useMemo(() => {
    if (!src) return '';
    let s = String(src).trim();
    // Canonicalize Wikipedia file page URLs to direct file path for Shell
    if (/wikipedia\.org\/wiki\/.+File:Shell_logo\.svg/i.test(s) || /commons\.wikimedia\.org\/wiki\/.+File:Shell_logo\.svg/i.test(s)) {
      s = 'https://commons.wikimedia.org/wiki/Special:FilePath/Shell_logo.svg';
    }
    if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) return s;
    if (s.startsWith(base)) return s; // already base-prefixed
    if (s.startsWith('/')) return `${base.replace(/\/$/, '')}${s}`; // ensure single slash join
    return s;
  }, [src, base]);
  const candidates = useMemo(() => {
    const baseList = [normalizedSrc, localSvg, localPng, remote];
    if (brandLower === 'shell') {
      // If src is a local path, prefer the official remote first; otherwise keep explicit remote URLs first
      const isLocalSrc = normalizedSrc && (normalizedSrc.startsWith(base) || normalizedSrc.startsWith('/'));
      if (isLocalSrc) return [remote, normalizedSrc, localSvg, localPng].filter(Boolean);
      return [normalizedSrc, remote, localSvg, localPng].filter(Boolean);
    }
    return baseList.filter(Boolean);
  }, [normalizedSrc, localSvg, localPng, remote, brandLower, base]);
  const [index, setIndex] = useState(0);
  const currentSrc = candidates[index];

  if (!currentSrc) {
    return (
      <div className="flex items-center justify-center text-gray-600 font-bold select-none" style={{ width: dim, height: dim }} aria-label={alt}>
        <span>{(text || 'S').slice(0,1).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden flex-shrink-0" style={{ width: dim, height: dim }}>
      <img
        src={currentSrc}
        alt={alt}
        className="w-full h-full object-contain"
        onError={() => setIndex((i) => i + 1)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default LogoBadge;
