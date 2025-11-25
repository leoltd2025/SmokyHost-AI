
import React, { useState } from 'react';
import { PricingData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyzePricingStrategy } from '../services/geminiService';
import { Calendar, DollarSign, TrendingUp, AlertCircle, ShieldCheck, Dog, Zap } from 'lucide-react';

const mockPricingData: PricingData[] = [
  { date: 'Mon 10/21', price: 225, occupancy: 45 },
  { date: 'Tue 10/22', price: 210, occupancy: 40 },
  { date: 'Wed 10/23', price: 210, occupancy: 50 },
  { date: 'Thu 10/24', price: 245, occupancy: 65 },
  { date: 'Fri 10/25', price: 350, occupancy: 90, event: 'Fall Festival' },
  { date: 'Sat 10/26', price: 380, occupancy: 95, event: 'Dollywood Peak' },
  { date: 'Sun 10/27', price: 290, occupancy: 75 },
];

interface PricingViewProps {
    isBeginner: boolean;
}

const PricingView: React.FC<PricingViewProps> = ({ isBeginner }) => {
  const [analysis, setAnalysis] = React.useState("Loading market analysis...");
  const [minPrice, setMinPrice] = useState(150); // Safety Threshold
  const [isPetFriendly, setIsPetFriendly] = useState(false);
  
  React.useEffect(() => {
    analyzePricingStrategy(mockPricingData, minPrice, isPetFriendly).then(setAnalysis);
  }, [minPrice, isPetFriendly]);

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Dynamic Pricing Engine</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <ShieldCheck className="w-3 h-3 text-green-600" />
                    Safety Guardrails Active: Min ${minPrice}
                </div>
            </div>
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">Sync PriceLabs</button>
                <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white shadow-sm hover:bg-indigo-700">Save Changes</button>
            </div>
        </div>

        {/* Safety & Niche Config */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Min Price ($)</label>
                <input 
                    type="number" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(Math.max(0, parseInt(e.target.value)))}
                    className="w-20 border rounded px-2 py-1 text-sm"
                />
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <button 
                onClick={() => setIsPetFriendly(!isPetFriendly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${isPetFriendly ? 'bg-teal-100 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-500 border border-transparent'}`}
            >
                <Dog className="w-4 h-4" /> Pet Friendly (+15% Revenue)
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-slate-100 text-slate-500 hover:bg-yellow-50 hover:text-yellow-700 transition-colors">
                <Zap className="w-4 h-4" /> EV Charger
            </button>
        </div>

        {/* AI Insight Banner */}
        <div className="bg-indigo-900 rounded-xl p-6 text-indigo-50 shadow-lg flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="p-3 bg-indigo-800 rounded-lg shrink-0">
                <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
                <h4 className="font-bold text-lg">Market Strategy: {isPetFriendly ? 'Niche (Pet Friendly)' : 'Balanced'}</h4>
                <p className="text-sm text-indigo-200 opacity-90 mt-1">{analysis}</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-800">7-Day Price Forecast</h3>
            </div>
            
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockPricingData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `$${val}`} domain={[0, 'auto']} />
                        <Tooltip 
                            cursor={{fill: '#f1f5f9'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="price" radius={[4, 4, 0, 0]} barSize={40}>
                            {mockPricingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.price < minPrice ? '#ef4444' : (entry.occupancy > 80 ? '#4f46e5' : '#818cf8')} />
                            ))}
                        </Bar>
                        {/* Min Price Line */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
             {mockPricingData.some(d => d.price < minPrice) && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Warning: Some dates are priced below your minimum threshold of ${minPrice}.
                </div>
            )}
        </div>
    </div>
  );
};

export default PricingView;
