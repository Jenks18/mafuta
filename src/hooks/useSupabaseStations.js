import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../store';

// Expected schema: table 'shell' with columns:
// id, brand, name, address, latitude, longitude, price_usd, original_price_usd, cashback_cents, extra_offer
export const useSupabaseStations = () => {
  const addShellStations = useStore((s) => s.addShellStations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchStations = async () => {
      if (!supabase) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('shell')
          .select('id, brand, name, address, latitude, longitude, price_usd, original_price_usd, cashback_cents, extra_offer');
        if (error) throw error;
        if (cancelled) return;
        const mapped = (data || []).map((row) => ({
          id: row.id,
          brand: row.brand || 'Shell',
          name: row.name || row.brand || 'Shell',
          address: row.address || '',
          price: row.price_usd ?? null,
          originalPrice: row.original_price_usd ?? null,
          cashback: row.cashback_cents ?? 0,
          extraOffer: row.extra_offer || null,
          coordinates: [Number(row.longitude), Number(row.latitude)],
          distance: '',
          isOpen: true,
          offers: [],
        }));
        if (mapped.length) addShellStations(mapped);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStations();
    return () => { cancelled = true; };
  }, [addShellStations]);

  return { loading, error };
};
