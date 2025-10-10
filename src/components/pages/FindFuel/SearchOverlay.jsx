import React from 'react';

const SearchOverlay = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  showSidebar,
  onToggleSidebar,
  filters = []
}) => {
  return (
    <div className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 pointer-events-none">
      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by zip code"
          className="w-64 pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pointer-events-auto"
        />
      </div>

      {/* Category Filter Dropdown */}
      <select
        value={selectedFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer appearance-none bg-no-repeat bg-right pr-10 pointer-events-auto"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em'
        }}
      >
        {filters.map((filter) => (
          <option key={filter.id} value={filter.id} disabled={!filter.enabled}>
            {filter.label}
          </option>
        ))}
      </select>

      {/* Sidebar Toggle */}
      <button
        onClick={onToggleSidebar}
        className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors pointer-events-auto"
        title={showSidebar ? 'Hide station list' : 'Show station list'}
      >
        {showSidebar ? (
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default SearchOverlay;
