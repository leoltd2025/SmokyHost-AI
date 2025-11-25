import React, { useState } from 'react';
import { Property } from '../types';
import { optimizeListingDescription } from '../services/geminiService';
import { Edit2, Check, Sparkles, MapPin } from 'lucide-react';

const mockListing: Property & { description: string; amenities: string[] } = {
  id: '1',
  name: 'Bear Hug Cabin - Luxury Views',
  address: '123 Pine Ridge, Pigeon Forge, TN',
  status: 'Active',
  occupancyRate: 85,
  nextCheckIn: 'Today',
  imgUrl: 'https://picsum.photos/800/400',
  description: 'Nice cabin with a view. Has a hot tub and kitchen. Good for families. Close to Dollywood.',
  amenities: ['Hot Tub', 'Mountain View', 'Game Room', 'Fire Pit', 'High-speed WiFi']
};

const ListingsView: React.FC = () => {
  const [description, setDescription] = useState(mockListing.description);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    const optimized = await optimizeListingDescription(description, mockListing.amenities);
    setDescription(optimized);
    setIsOptimizing(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Listing Management</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-48 w-full relative">
            <img src={mockListing.imgUrl} alt={mockListing.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    {mockListing.name}
                    <Edit2 className="w-4 h-4 text-slate-500 cursor-pointer hover:text-indigo-600" />
                </h3>
                <p className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {mockListing.address}
                </p>
            </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-slate-800">Description & SEO</h4>
            <button 
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
            >
              {isOptimizing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              AI Optimize Listing
            </button>
          </div>

          <div className="relative">
            <textarea
              className="w-full border border-slate-200 rounded-lg p-4 h-40 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-700 leading-relaxed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="absolute bottom-4 right-4">
                <button className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 shadow-lg">
                    <Check className="w-4 h-4" />
                </button>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-slate-800 mb-3">Amenities (Auto-Synced)</h4>
            <div className="flex flex-wrap gap-2">
                {mockListing.amenities.map((am, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm border border-slate-200">
                        {am}
                    </span>
                ))}
                <button className="px-3 py-1 border border-dashed border-slate-300 text-slate-400 rounded-full text-sm hover:border-indigo-400 hover:text-indigo-500 transition-colors">
                    + Add Amenity
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-4 items-start">
        <div className="bg-blue-100 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-600" />
        </div>
        <div>
            <h4 className="font-semibold text-blue-900 text-sm">AI Opportunity Detected</h4>
            <p className="text-sm text-blue-700 mt-1">
                Properties with "Hot Tub" in the title are booking 15% faster in Pigeon Forge this week. 
                Consider renaming to <strong>"Bear Hug Cabin - Private Hot Tub & Views"</strong>.
            </p>
            <button className="mt-2 text-xs font-semibold text-blue-800 underline">Apply Suggestion</button>
        </div>
      </div>
    </div>
  );
};

export default ListingsView;