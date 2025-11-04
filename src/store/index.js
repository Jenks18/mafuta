import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { transformShellStation, sortStationsByDistance } from '../utils/locationUtils';

// Get organization ID from environment or use default for demo
const getOrganizationId = () => {
  return import.meta.env.VITE_ORGANIZATION_ID || '00000000-0000-0000-0000-000000000000';
};

export const useStore = create((set, get) => ({
  // Auth
  user: null,
  authInitialized: false,
  organizationId: getOrganizationId(),
  
  // Data
  referralCode: 'FUEL2024',
  earnings: 125.50,
  referrals: 3,
  pending: 2,
  joined: 8,
  
  // Real data from Supabase (will be empty initially for new orgs)
  drivers: [],
  vehicles: [],
  cards: [],
  transactions: [],
  payrollPayouts: [],
  walletTransactions: [],
  
  contacts: [],
  fuelStations: [],
  userLocation: { lat: -1.2921, lon: 36.8219 }, // Default Nairobi location
  profiles: [],
  
  // Loading states
  isLoadingDrivers: false,
  isLoadingVehicles: false,
  isLoadingCards: false,
  isLoadingTransactions: false,
  
  // UI State
  contactQuery: '',
  qrUrl: '',
  shareMessage: '',
  
  // ========== DRIVERS CRUD ==========
  loadDrivers: async () => {
    set({ isLoadingDrivers: true });
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .eq('organization_id', get().organizationId)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          set({ drivers: data });
          return;
        }
        console.error('Error loading drivers:', error);
      }
    } catch (error) {
      console.error('Failed to load drivers:', error);
    } finally {
      set({ isLoadingDrivers: false });
    }
    // Keep empty array for new organizations
    set({ drivers: [] });
  },
  
  addDriver: async (driverData) => {
    try {
      const newDriver = {
        ...driverData,
        organization_id: get().organizationId
      };
      
      if (supabase) {
        const { data, error } = await supabase
          .from('drivers')
          .insert([newDriver])
          .select()
          .single();
        
        if (!error && data) {
          set((state) => ({ drivers: [data, ...state.drivers] }));
          return data;
        }
        throw error || new Error('Failed to add driver');
      }
    } catch (error) {
      console.error('Failed to add driver:', error);
      throw error;
    }
  },
  
  updateDriver: async (id, updates) => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('drivers')
          .update(updates)
          .eq('id', id)
          .eq('organization_id', get().organizationId)
          .select()
          .single();
        
        if (!error && data) {
          set((state) => ({
            drivers: state.drivers.map(d => d.id === id ? data : d)
          }));
          return data;
        }
        throw error || new Error('Failed to update driver');
      }
    } catch (error) {
      console.error('Failed to update driver:', error);
      throw error;
    }
  },
  
  deleteDriver: async (id) => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('drivers')
          .delete()
          .eq('id', id)
          .eq('organization_id', get().organizationId);
        
        if (!error) {
          set((state) => ({
            drivers: state.drivers.filter(d => d.id !== id)
          }));
          return;
        }
        throw error || new Error('Failed to delete driver');
      }
    } catch (error) {
      console.error('Failed to delete driver:', error);
      throw error;
    }
  },
  
  // ========== VEHICLES CRUD ==========
  loadVehicles: async () => {
    set({ isLoadingVehicles: true });
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('vehicles')
          .select(`
            *,
            driver:drivers(id, name)
          `)
          .eq('organization_id', get().organizationId)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          set({ vehicles: data });
          return;
        }
        console.error('Error loading vehicles:', error);
      }
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      set({ isLoadingVehicles: false });
    }
    set({ vehicles: [] });
  },
  
  addVehicle: async (vehicleData) => {
    try {
      const newVehicle = {
        ...vehicleData,
        organization_id: get().organizationId
      };
      
      if (supabase) {
        const { data, error } = await supabase
          .from('vehicles')
          .insert([newVehicle])
          .select(`
            *,
            driver:drivers(id, name)
          `)
          .single();
        
        if (!error && data) {
          set((state) => ({ vehicles: [data, ...state.vehicles] }));
          return data;
        }
        throw error || new Error('Failed to add vehicle');
      }
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      throw error;
    }
  },
  
  updateVehicle: async (id, updates) => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('vehicles')
          .update(updates)
          .eq('id', id)
          .eq('organization_id', get().organizationId)
          .select(`
            *,
            driver:drivers(id, name)
          `)
          .single();
        
        if (!error && data) {
          set((state) => ({
            vehicles: state.vehicles.map(v => v.id === id ? data : v)
          }));
          return data;
        }
        throw error || new Error('Failed to update vehicle');
      }
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      throw error;
    }
  },
  
  deleteVehicle: async (id) => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('vehicles')
          .delete()
          .eq('id', id)
          .eq('organization_id', get().organizationId);
        
        if (!error) {
          set((state) => ({
            vehicles: state.vehicles.filter(v => v.id !== id)
          }));
          return;
        }
        throw error || new Error('Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      throw error;
    }
  },
  
  // ========== CARDS CRUD ==========
  loadCards: async () => {
    set({ isLoadingCards: true });
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('fuel_cards')
          .select(`
            *,
            driver:assigned_driver_id(id, name),
            vehicle:assigned_vehicle_id(id, make, model, color, license_plate)
          `)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          set({ cards: data });
          return;
        }
        console.error('Error loading cards:', error);
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      set({ isLoadingCards: false });
    }
    set({ cards: [] });
  },
  
  addCard: async (cardData) => {
    try {
      const newCard = {
        ...cardData,
        // Generate last 4 digits for card number display
        last_four: Math.floor(1000 + Math.random() * 9000).toString()
      };
      
      if (supabase) {
        const { data, error } = await supabase
          .from('fuel_cards')
          .insert([newCard])
          .select(`
            *,
            driver:assigned_driver_id(id, name),
            vehicle:assigned_vehicle_id(id, make, model, color, license_plate)
          `)
          .single();
        
        if (!error && data) {
          set((state) => ({ cards: [data, ...state.cards] }));
          return data;
        }
        throw error || new Error('Failed to add card');
      }
    } catch (error) {
      console.error('Failed to add card:', error);
      throw error;
    }
  },
  
  updateCard: async (id, updates) => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('cards')
          .update(updates)
          .eq('id', id)
          .eq('organization_id', get().organizationId)
          .select(`
            *,
            driver:drivers(id, name),
            vehicle:vehicles(id, make, model, color, license_plate)
          `)
          .single();
        
        if (!error && data) {
          set((state) => ({
            cards: state.cards.map(c => c.id === id ? data : c)
          }));
          return data;
        }
        throw error || new Error('Failed to update card');
      }
    } catch (error) {
      console.error('Failed to update card:', error);
      throw error;
    }
  },
  
  deleteCard: async (id) => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('cards')
          .delete()
          .eq('id', id)
          .eq('organization_id', get().organizationId);
        
        if (!error) {
          set((state) => ({
            cards: state.cards.filter(c => c.id !== id)
          }));
          return;
        }
        throw error || new Error('Failed to delete card');
      }
    } catch (error) {
      console.error('Failed to delete card:', error);
      throw error;
    }
  },
  
  toggleCardStatus: async (cardId) => {
    const card = get().cards.find(c => c.id === cardId);
    if (!card) return;
    
    const newStatus = card.status === 'active' ? 'inactive' : 'active';
    await get().updateCard(cardId, { status: newStatus });
  },
  
  // ========== TRANSACTIONS CRUD ==========
  loadTransactions: async () => {
    set({ isLoadingTransactions: true });
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            card:fuel_cards(id, card_number, last_four),
            driver:drivers(id, name),
            vehicle:vehicles(id, make, model, license_plate)
          `)
          .eq('organization_id', get().organizationId)
          .order('transaction_date', { ascending: false })
          .limit(100);
        
        if (!error && data) {
          set({ transactions: data });
          return;
        }
        console.error('Error loading transactions:', error);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      set({ isLoadingTransactions: false });
    }
    set({ transactions: [] });
  },
  
  addTransaction: async (transactionData) => {
    try {
      const newTransaction = {
        ...transactionData,
        organization_id: get().organizationId
      };
      
      if (supabase) {
        const { data, error } = await supabase
          .from('transactions')
          .insert([newTransaction])
          .select(`
            *,
            card:fuel_cards(id, card_number, last_four),
            driver:drivers(id, name),
            vehicle:vehicles(id, make, model, license_plate)
          `)
          .single();
        
        if (!error && data) {
          set((state) => ({ transactions: [data, ...state.transactions] }));
          return data;
        }
        throw error || new Error('Failed to add transaction');
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  },
  
  // ========== PAYROLL CRUD ==========
  loadPayrollPayouts: async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('payroll_payouts')
          .select(`
            *,
            driver:drivers(id, name)
          `)
          .eq('organization_id', get().organizationId)
          .order('payout_date', { ascending: false })
          .limit(50);
        
        if (!error && data) {
          set({ payrollPayouts: data });
          return;
        }
        console.error('Error loading payroll payouts:', error);
      }
    } catch (error) {
      console.error('Failed to load payroll payouts:', error);
    }
    set({ payrollPayouts: [] });
  },
  
  addPayrollPayout: async (payoutData) => {
    try {
      const newPayout = {
        ...payoutData,
        organization_id: get().organizationId
      };
      
      if (supabase) {
        const { data, error } = await supabase
          .from('payroll_payouts')
          .insert([newPayout])
          .select(`
            *,
            driver:drivers(id, name)
          `)
          .single();
        
        if (!error && data) {
          set((state) => ({ payrollPayouts: [data, ...state.payrollPayouts] }));
          return data;
        }
        throw error || new Error('Failed to add payout');
      }
    } catch (error) {
      console.error('Failed to add payout:', error);
      throw error;
    }
  },
  
  // ========== WALLET TRANSACTIONS CRUD ==========
  loadWalletTransactions: async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('organization_id', get().organizationId)
          .order('transaction_date', { ascending: false })
          .limit(50);
        
        if (!error && data) {
          set({ walletTransactions: data });
          return;
        }
        console.error('Error loading wallet transactions:', error);
      }
    } catch (error) {
      console.error('Failed to load wallet transactions:', error);
    }
    set({ walletTransactions: [] });
  },
  
  addWalletTransaction: async (transactionData) => {
    try {
      const newTransaction = {
        ...transactionData,
        organization_id: get().organizationId
      };
      
      if (supabase) {
        const { data, error } = await supabase
          .from('wallet_transactions')
          .insert([newTransaction])
          .select()
          .single();
        
        if (!error && data) {
          set((state) => ({ walletTransactions: [data, ...state.walletTransactions] }));
          return data;
        }
        throw error || new Error('Failed to add wallet transaction');
      }
    } catch (error) {
      console.error('Failed to add wallet transaction:', error);
      throw error;
    }
  },
  
  // ========== INITIALIZATION ==========
  initializeData: async () => {
    // Load all data in parallel
    await Promise.all([
      get().loadDrivers(),
      get().loadVehicles(),
      get().loadCards(),
      get().loadTransactions(),
      get().loadPayrollPayouts(),
      get().loadWalletTransactions(),
      get().loadProfiles()
    ]);
  },
  
  // ========== LEGACY ACTIONS (for backwards compatibility) ==========
  setContactQuery: (query) => set({ contactQuery: query }),
  
  referUser: () => {
    console.log('Referring user...');
    set((state) => ({ 
      referrals: state.referrals + 1,
      earnings: state.earnings + 25.00 
    }));
  },
  
  generateQr: () => {
    const qrUrl = `https://mafuta.app/refer/${get().referralCode}`;
    set({ qrUrl });
    console.log('Generated QR URL:', qrUrl);
  },
  
  shareReferral: () => {
    set({ shareMessage: 'Referral link shared successfully!' });
    setTimeout(() => set({ shareMessage: '' }), 3000);
  },
  
  inviteContact: (contact) => {
    console.log('Inviting contact:', contact);
    set({ shareMessage: `Invitation sent to ${contact.name}` });
    setTimeout(() => set({ shareMessage: '' }), 3000);
  },
  
  removeTransaction: (transactionId) => {
    set((state) => ({
      transactions: state.transactions.filter(t => t.id !== transactionId)
    }));
  },
  
  removeCard: (cardId) => {
    get().deleteCard(cardId);
  },

  // Location and Station Actions
  setUserLocation: (lat, lon) => {
    set({ userLocation: { lat, lon } });
    get().sortStationsByProximity();
  },

  sortStationsByProximity: () => {
    const { fuelStations, userLocation } = get();
    const sortedStations = sortStationsByDistance(
      fuelStations,
      userLocation.lat,
      userLocation.lon
    );
    set({ fuelStations: sortedStations });
  },

  addShellStations: (shellStations) => {
    const currentStations = get().fuelStations;
    const transformedStations = shellStations.map((station, index) => {
      if (station && Array.isArray(station.coordinates) && station.brand) {
        const brand = station.brand;
        const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
        const localDefault = brand && brand.toLowerCase() === 'shell' ? `${base}logos/shell.svg` : (brand ? `${base}logos/${brand.toLowerCase()}.png` : undefined);
        const logoUrl = station.logoUrl || localDefault;
        return { id: station.id ?? `station-${currentStations.length + index + 1}`, ...station, logoUrl };
      }
      const t = transformShellStation(station, currentStations.length + index);
      const brand = t.brand;
      const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
      const localDefault = brand && brand.toLowerCase() === 'shell' ? `${base}logos/shell.svg` : (brand ? `${base}logos/${brand.toLowerCase()}.png` : undefined);
      return { ...t, logoUrl: t.logoUrl || localDefault };
    });
    
    set({
      fuelStations: [...currentStations, ...transformedStations]
    });
    
    get().sortStationsByProximity();
  },

  loadLocalShellStations: async () => {
    try {
      if (get().fuelStations.length > 0) {
        console.log('[Store] Stations already loaded:', get().fuelStations.length);
        return;
      }
      console.log('[Store] Loading Shell stations from JSON...');
      const mod = await import('../data/shellStations.json');
      const data = (mod?.default || mod) ?? [];
      console.log('[Store] Raw data loaded:', data.length, 'stations');
      const transformed = data.map((station, index) => transformShellStation(station, index));
      console.log('[Store] Transformed:', transformed.length, 'stations');
      set({ fuelStations: transformed });
      get().sortStationsByProximity();
      console.log('[Store] Final fuelStations count:', get().fuelStations.length);
    } catch (e) {
      console.error('[Store] Error loading shell stations:', e);
    }
  },

  setFuelStations: (stations) => {
    console.log('[Store] setFuelStations called with', stations?.length || 0, 'stations');
    set({ fuelStations: stations || [] });
    get().sortStationsByProximity();
  },

  refreshStations: () => {
    get().sortStationsByProximity();
  },
  
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  // Auth actions
  initAuth: async () => {
    try {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        set({ user: session?.user || null, authInitialized: true });
        supabase.auth.onAuthStateChange((_event, session2) => {
          set({ user: session2?.user || null, authInitialized: true });
        });
        return;
      }
    } catch {}
    set({ user: null, authInitialized: true });
  },

  loginMock: (user) => set({ user }),
  logoutMock: () => set({ user: null }),

  // Profiles CRUD
  loadProfiles: async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error) {
          set({ profiles: data || [] });
          return;
        }
      }
    } catch {}
    set({ profiles: [] });
  },

  upsertProfile: async (p) => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .upsert(p)
          .select('*');
        
        if (!error) {
          await get().loadProfiles();
          return data?.[0];
        }
      }
    } catch {}
    set((state) => {
      const exists = state.profiles.find((x) => x.id === p.id);
      if (exists) {
        return { profiles: state.profiles.map((x) => x.id === p.id ? { ...exists, ...p } : x) };
      }
      return { profiles: [{ ...p, id: String(Date.now()) }, ...state.profiles] };
    });
  },

  deleteProfile: async (id) => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id);
        
        if (!error) {
          set((state) => ({ profiles: state.profiles.filter((x) => x.id !== id) }));
          return;
        }
      }
    } catch {}
    set((state) => ({ profiles: state.profiles.filter((x) => x.id !== id) }));
  }
}));
