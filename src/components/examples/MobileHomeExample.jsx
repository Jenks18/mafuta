import React, { useState } from 'react';
import { ExpenseCard, StatCard } from './ui/Card';
import { FAB } from './ui/Button';
import { BottomNav } from './ui/Navigation';
import { CategoryPill, ConfidenceBadge } from './ui/Badge';

/**
 * Example Mobile Home Screen
 * Demonstrates the new design system in action
 */

const MobileHomeExample = () => {
  const [activeNav, setActiveNav] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data
  const categories = [
    { id: 'all', name: 'All', icon: '📊' },
    { id: 'food', name: 'Food & Dining', icon: '🍔' },
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'health', name: 'Health', icon: '🏥' },
  ];

  const expenses = [
    {
      id: 1,
      merchant: 'Starbucks Coffee',
      category: 'Food & Dining',
      amount: 18.50,
      date: 'Today',
      time: '2:30 PM',
      categoryColor: 'orange',
      receiptUrl: null,
    },
    {
      id: 2,
      merchant: 'Uber',
      category: 'Transport',
      amount: 24.75,
      date: 'Today',
      time: '9:15 AM',
      categoryColor: 'teal',
      receiptUrl: null,
    },
    {
      id: 3,
      merchant: 'Shell Station',
      category: 'Fuel',
      amount: 65.00,
      date: 'Yesterday',
      categoryColor: 'purple',
      receiptUrl: 'https://via.placeholder.com/300x400',
    },
  ];

  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: 'receipts', 
      label: 'Receipts', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Greeting Header */}
      <div className="bg-white px-4 pt-safe-top pb-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6 mt-4">
          <div>
            <p className="text-sm text-gray-500">Good morning</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Ian 👋</h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
            IN
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="This Month"
            value="$2,847"
            trend="+12%"
            gradient="primary"
          />
          <StatCard
            label="This Week"
            value="$624"
            subtitle="5 receipts"
            gradient="success"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
          {categories.map(cat => (
            <CategoryPill
              key={cat.id}
              selected={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              icon={cat.icon}
            >
              {cat.name}
            </CategoryPill>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
          <button className="text-sm text-primary-500 font-medium">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {expenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              merchant={expense.merchant}
              category={expense.category}
              amount={expense.amount}
              date={expense.date}
              time={expense.time}
              categoryColor={expense.categoryColor}
              receiptUrl={expense.receiptUrl}
              onClick={() => console.log('Expense clicked', expense.id)}
            />
          ))}
        </div>

        {/* OCR Example */}
        <div className="mt-4 p-4 bg-warning-50 border border-warning-200 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-warning-900">
                Receipt needs review
              </p>
              <p className="text-xs text-warning-700 mt-1">
                Shell Station receipt has low confidence
              </p>
              <ConfidenceBadge confidence={58} className="mt-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Empty State Example (commented out) */}
      {/* {expenses.length === 0 && (
        <div className="text-center py-12 px-4">
          <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 mt-4 font-medium">No receipts yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Tap the + button to add your first receipt
          </p>
        </div>
      )} */}

      {/* Floating Action Button */}
      <FAB onClick={() => console.log('Scan receipt')}>
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </FAB>

      {/* Bottom Navigation */}
      <BottomNav
        items={navItems}
        activeItem={activeNav}
        onItemClick={setActiveNav}
      />

      {/* Hide scrollbar globally */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MobileHomeExample;
