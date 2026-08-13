import React, { useState } from 'react';
import { Search, MapPin, Layers, ArrowRight } from 'lucide-react';

export const SearchBar = ({ onSearch, initialValue = '', initialCategory = 'All', showCategoryDropdown = true }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [category, setCategory] = useState(initialCategory);

  const categories = [
    'All',
    'Beach',
    'Mountain',
    'Historical',
    'Religious',
    'Adventure',
    'City',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ search: searchTerm, category });
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) {
      onSearch({ search: val, category });
    }
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setCategory(cat);
    if (onSearch) {
      onSearch({ search: searchTerm, category: cat });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl shadow-slate-900/10 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2 transition-all hover:border-teal-400 focus-within:ring-4 focus-within:ring-teal-500/10"
    >
      {/* Search Input */}
      <div className="flex items-center gap-3 px-4 py-2.5 w-full flex-1">
        <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Where do you want to go? (e.g. Goa, Manali, Jaipur)"
          className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Category Dropdown */}
      {showCategoryDropdown && (
        <div className="flex items-center gap-2 px-4 py-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-200">
          <Layers className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 focus:outline-none cursor-pointer pr-4"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Submit Action Button */}
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-sm rounded-xl sm:rounded-full shadow-md shadow-teal-600/20 hover:shadow-teal-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
