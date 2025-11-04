import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../store';

// Query shell_stations table from Supabase
export const useSupabaseStations = () => {
  const setFuelStations = useStore((s) => s.setFuelStations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchStations = async () => {
      if (!supabase) {
        console.log('[useSupabaseStations] Supabase client not available');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('[useSupabaseStations] Fetching stations from Supabase...');
        const { data, error } = await supabase
          .from('shell_stations')
          .select('*')
          .limit(1000);
          
        if (error) throw error;
        if (cancelled) return;
        
        console.log('[useSupabaseStations] Received', data?.length || 0, 'stations from Supabase');
        
        if (!data || data.length === 0) {
          console.log('[useSupabaseStations] No stations in database, will use local JSON');
          return;
        }
        
        const mapped = data.map((row) => ({
          id: row.id,
          brand: row.brand || 'Shell',
          name: row.name || 'Shell Station',
          address: row.address || '',
          fullAddress: row.full_address || row.address || '',
          region: row.region || 'Nairobi',
          price: row.price_usd ?? 2.85,
          originalPrice: row.original_price_usd ?? row.price_usd * 1.105,
          cashback: row.cashback_cents ?? 27,
          extraOffer: row.extra_offer || '',
          logoUrl: row.logo_url || '',
          coordinates: [Number(row.longitude), Number(row.latitude)],
          distance: '0.0 mi',
          isOpen: row.is_open ?? true,
          description: row.description || '',
          url: row.url || '',
          facilities: Array.isArray(row.facilities) ? row.facilities : [],
          amenities: Array.isArray(row.amenities) ? row.amenities : [],
          offers: Array.isArray(row.offers) ? row.offers : [],
        }));
        
        console.log('[useSupabaseStations] Mapped', mapped.length, 'stations, setting in store');
        setFuelStations(mapped);
      } catch (e) {
        console.error('[useSupabaseStations] Error:', e);
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    fetchStations();
    return () => { cancelled = true; };
  }, [setFuelStations]);

  return { loading, error };
};
