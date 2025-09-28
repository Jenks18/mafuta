import { create } from 'zustand'

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
  { id: 1, name: 'Shell Downtown', price: 3.45, mapX: '25%', mapY: '30%' },
  { id: 2, name: 'BP Highway', price: 3.52, mapX: '70%', mapY: '45%' },
  { id: 3, name: 'Chevron Main', price: 3.38, mapX: '40%', mapY: '65%' },
  { id: 4, name: 'Exxon Center', price: 3.41, mapX: '60%', mapY: '25%' },
]

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
  fuelStations: mockFuelStations,
  
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
  
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
}))
