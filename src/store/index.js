import { create } from 'zustand'
import shellStationsData from '../data/shellStations.json'
import { transformShellStation, sortStationsByDistance } from '../utils/locationUtils'

// Mock data for demonstration
const mockCards = [
  { id: '****1234', status: 'ACTIVE', assignedTo: 'John Smith', avatar: 'user' },
  { id: '****5678', status: 'ACTIVE', assignedTo: 'Sarah Johnson', avatar: 'user' },
  { id: '****9012', status: 'INACTIVE', assignedTo: 'Mike Davis', avatar: 'loading' },
]

const mockTransactions = [
  { id: 1, date: '2024-01-15', desc: 'Shell Station Downtown', amount: 65.43 },
  { id: 2, date: '2024-01-14', desc: 'BP Highway 95', amount: 42.18 },
  { id: 3, date: '2024-01-13', desc: 'Chevron Main St', amount: 78.92 },
]

const mockContacts = [
  { name: 'Alice Cooper', phone: '+1 234-567-8901' },
  { name: 'Bob Wilson', phone: '+1 234-567-8902' },
  { name: 'Carol Davis', phone: '+1 234-567-8903' },
]

const mockFuelStations = [
  { 
    id: 1, 
    name: 'XTRA Fuels', 
    brand: 'XTRA',
    address: '8721 Baltimore Ave, College Park',
    distance: '0.9 mi',
    price: 2.60,
    originalPrice: 2.76,
    cashback: 16,
    isOpen: true,
    mapX: '35%', 
    mapY: '40%',
    coordinates: [36.8219, -1.2921],
    offers: [
      { type: 'Regular', price: 2.60, originalPrice: 2.76, cashback: 16 },
      { type: 'Midgrade', price: 3.62, originalPrice: 3.90, cashback: 28 },
      { type: 'Premium', price: 3.74, originalPrice: 4.00, cashback: 26 }
    ]
  },
  { 
    id: 2, 
    name: 'Exxon', 
    brand: 'Exxon',
    address: '8401 Baltimore Ave',
    distance: '0.9 mi',
    price: 3.24,
    originalPrice: 3.50,
    cashback: 26,
    isOpen: true,
    mapX: '55%', 
    mapY: '30%',
    coordinates: [36.8172, -1.2864],
    offers: [
      { type: 'Regular', price: 3.24, originalPrice: 3.50, cashback: 26 }
    ]
  },
  { 
    id: 3, 
    name: 'Shell', 
    brand: 'Shell',
    address: '6001 Greenbelt Rd',
    distance: '1.9 mi',
    price: 2.83,
    originalPrice: 3.10,
    cashback: 27,
    isOpen: true,
    mapX: '70%', 
    mapY: '60%',
    coordinates: [36.8833, -1.3167],
    offers: [
      { type: 'Regular', price: 2.83, originalPrice: 3.10, cashback: 27 }
    ],
    extraOffer: '9% cash back inside the store'
  },
  { 
    id: 4, 
    name: 'Total Energies', 
    brand: 'Total',
    address: 'Westlands, Nairobi',
    distance: '2.3 mi',
    price: 2.95,
    originalPrice: 3.20,
    cashback: 25,
    isOpen: true,
    mapX: '25%', 
    mapY: '55%',
    coordinates: [36.8108, -1.2676],
    offers: [
      { type: 'Regular', price: 2.95, originalPrice: 3.20, cashback: 25 }
    ]
  },
  { 
    id: 5, 
    name: 'KenolKobil', 
    brand: 'Kenol',
    address: 'CBD, Nairobi',
    distance: '1.2 mi',
    price: 2.75,
    originalPrice: 3.05,
    cashback: 30,
    isOpen: true,
    mapX: '45%', 
    mapY: '45%',
    coordinates: [36.8172, -1.2864],
    offers: [
      { type: 'Regular', price: 2.75, originalPrice: 3.05, cashback: 30 }
    ]
  }
]

// Transform and integrate Shell stations
const transformedShellStations = shellStationsData.map((station, index) => 
  transformShellStation(station, index)
);

// Combine all stations
const allStations = [...mockFuelStations, ...transformedShellStations];

export const useStore = create((set, get) => ({
  // Data
  referralCode: 'FUEL2024',
  earnings: 125.50,
  referrals: 3,
  pending: 2,
  joined: 8,
  cards: mockCards,
  transactions: mockTransactions,
  contacts: mockContacts,
  fuelStations: allStations,
  userLocation: { lat: -1.2921, lon: 36.8219 }, // Default Nairobi location
  
  // UI State
  contactQuery: '',
  qrUrl: '',
  shareMessage: '',
  
  // Actions
  setContactQuery: (query) => set({ contactQuery: query }),
  
  referUser: () => {
    console.log('Referring user...')
    set((state) => ({ 
      referrals: state.referrals + 1,
      earnings: state.earnings + 25.00 
    }))
  },
  
  generateQr: () => {
    const qrUrl = `https://mafuta.app/refer/${get().referralCode}`
    set({ qrUrl })
    console.log('Generated QR URL:', qrUrl)
  },
  
  shareReferral: () => {
    set({ shareMessage: 'Referral link shared successfully!' })
    setTimeout(() => set({ shareMessage: '' }), 3000)
  },
  
  inviteContact: (contact) => {
    console.log('Inviting contact:', contact)
    set({ shareMessage: `Invitation sent to ${contact.name}` })
    setTimeout(() => set({ shareMessage: '' }), 3000)
  },
  
  toggleCardActive: (cardId) => {
    set((state) => ({
      cards: state.cards.map(card => 
        card.id === cardId 
          ? { ...card, status: card.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : card
      )
    }))
  },
  
  addTransaction: (transaction) => {
    set((state) => ({
      transactions: [
        { ...transaction, id: Date.now() },
        ...state.transactions
      ]
    }))
  },
  
  removeTransaction: (transactionId) => {
    set((state) => ({
      transactions: state.transactions.filter(t => t.id !== transactionId)
    }))
  },
  
  addCard: (card) => {
    set((state) => ({
      cards: [
        { ...card, id: Date.now() },
        ...state.cards
      ]
    }))
  },
  
  removeCard: (cardId) => {
    set((state) => ({
      cards: state.cards.filter(c => c.id !== cardId)
    }))
  },

  // Location and Station Actions
  setUserLocation: (lat, lon) => {
    set({ userLocation: { lat, lon } });
    // Re-sort stations by distance when location changes
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
    const transformedStations = shellStations.map((station, index) =>
      transformShellStation(station, currentStations.length + index)
    );
    
    set({
      fuelStations: [...currentStations, ...transformedStations]
    });
    
    // Sort by proximity after adding
    get().sortStationsByProximity();
  },

  refreshStations: () => {
    // Re-sort existing stations based on current location
    get().sortStationsByProximity();
  },
  
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
}))
