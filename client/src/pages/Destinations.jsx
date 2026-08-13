import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { destinationService } from '../services/destinationService';
import { DestinationCard } from '../components/DestinationCard';
import { SearchBar } from '../components/SearchBar';
import { SkeletonCard } from '../components/Loading';
import { MapPin, Filter, SearchX, Sparkles } from 'lucide-react';

export const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categories = [
    'All',
    'Beach',
    'Mountain',
    'Historical',
    'Religious',
    'Adventure',
    'City',
  ];

  // Fetch destinations whenever searchTerm or selectedCategory changes
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const params = {};
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedCategory && selectedCategory !== 'All')
          params.category = selectedCategory;

        const data = await destinationService.getDestinations(params);
        setDestinations(data.destinations || []);
      } catch (err) {
        console.error('Error loading destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [searchTerm, selectedCategory]);

  const handleSearch = ({ search, category }) => {
    setSearchTerm(search);
    setSelectedCategory(category || 'All');

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    setSearchParams(params);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Curated Destinations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
          Explore Amazing Places
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From tranquil Himalayan peaks and sun-soaked coastal beaches to centuries-old royal palaces and holy ghats.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <SearchBar
          onSearch={handleSearch}
          initialValue={searchTerm}
          initialCategory={selectedCategory}
          showCategoryDropdown={false}
        />
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-500 hover:text-teal-600'
              }`}
            >
              {cat === 'All' ? 'All Destinations' : cat}
            </button>
          );
        })}
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <p className="text-xs sm:text-sm font-semibold text-slate-600">
          Showing <span className="text-slate-900 font-bold">{destinations.length}</span> destinations
          {selectedCategory !== 'All' && <span> in <span className="text-teal-600">{selectedCategory}</span></span>}
          {searchTerm && <span> matching "<span className="text-teal-600">{searchTerm}</span>"</span>}
        </p>
      </div>

      {/* Destination Grid / States */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
            No Destinations Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            We couldn't find any destinations matching your criteria. Try adjusting your search query or category filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSearchParams({});
            }}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <DestinationCard key={destination._id} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Destinations;
