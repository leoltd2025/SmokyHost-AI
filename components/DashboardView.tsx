
import React, { useEffect, useState } from 'react';
import { Property, Metric } from '../types';
import { generateDailyBriefing } from '../services/geminiService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Sparkles, Loader2, AlertOctagon, CheckCircle, TrendingUp } from 'lucide-react';

const mockMetrics: Metric[] = [
  { label: 'Occupancy Rate', value: '68%', change: 4.2, trend: 'up', description: 'How full your cabins are.' },
  { label: 'RevPAR', value: '$182', change: 12.5, trend: 'up', description: 'Revenue per available room.' },
  { label: 'Active Guests', value: '14', change: -2, trend: 'down', description: 'Guests currently checked in.' },
  { label: 'Est. Monthly Revenue', value: '$24,500', change: 8.1, trend: 'up', description: 'Forecasted income.' },
];

const mockProperties: Property[] = [
  { id: '1', name: 'Bear Hug Cabin', address: '123 Pine Ridge', status: 'Active', occupancyRate: 85, nextCheckIn: 'Today', imgUrl: 'https://picsum.photos/400/300?random=1' },
  { id: '2', name: 'Smoky Retreat', address: '456 Mountain View', status: 'Cleaning', occupancyRate: 45, nextCheckIn: 'Tomorrow', imgUrl: 'https://picsum.photos/400/300?random=2' },
  { id: '3', name: 'Dollywood Haven', address: '789 Parkway Ln', status: 'Active', occupancyRate: 92, nextCheckIn: 'In 2 days', imgUrl: 'https://picsum.photos/400/300?random=3' },
];

const chartData = [
  { name: 'Mon', Revenue: 4000, Occupancy: 60 },
  { name: 'Tue', Revenue: 3000, Occupancy: 55 },
  { name: 'Wed', Revenue: 2000, Occupancy: 45 },
  { name: 'Thu', Revenue: 2780, Occupancy: 65 },
  { name: 'Fri', Revenue: 8890, Occupancy: 95 },
  { name: 'Sat', Revenue: 9390, Occupancy: 100 },
  { name: 'Sun', Revenue: 7490, Occupancy: 85 },
];

interface DashboardProps {
    isBeginner: boolean;
}

const DashboardView: React.FC<DashboardProps> = ({ isBeginner }) => {
  const [aiBriefing, setAiBriefing] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [complianceStatus, setComplianceStatus] = useState<'Valid' | 'Expiring'>('Valid');

  useEffect(() => {
    const fetchBriefing = async () => {
      const result = await generateDailyBriefing(mockMetrics, mockProperties, isBeginner);
      setAiBriefing(result);
      setLoading(false);
    };
    fetchBriefing();
  }, [isBeginner]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
            {isBeginner && <p className="text-slate-500 text-sm">Simplified view for new owners.</p>}
        </div>
        <div className="flex items-center gap-3">
            {/* Compliance Widget */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${complianceStatus === 'Valid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {complianceStatus === 'Valid' ? <CheckCircle className="w-3 h-3" /> : <AlertOctagon className="w-3 h-3" />}
                {complianceStatus === 'Valid' ? 'Pigeon Forge Permit Active' : 'Permit Renewal Due ($500)'}
            </div>
        </div>
      </div>

      {/* AI CEO Insight */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <h3 className="font-semibold text-lg">AI CEO Daily Briefing</h3>
        </div>
        <div className="prose prose-invert max-w-none">
          {loading ? (
            <div className="flex items-center gap-2 text-indigo-200">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing market data...</span>
            </div>
          ) : (
            <div className="whitespace-pre-line text-indigo-50 text-sm leading-relaxed">
              {aiBriefing}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-slate-500 font-medium">{metric.label}</p>
                    {isBeginner && <p className="text-xs text-slate-400 mt-0.5">{metric.description}</p>}
                </div>
                <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                    metric.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                    {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {Math.abs(metric.change)}%
                </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-3">{metric.value}</h3>
          </div>
        ))}
      </div>

      {/* Growth Suggestion (Scalability) */}
      {!isBeginner && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
                <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-amber-900 text-sm">Growth Opportunity Detected</h4>
                <p className="text-sm text-amber-800 mt-1">
                    Based on your $24k monthly revenue, you qualify for financing a 4th cabin. 
                    ROI projected at 12% for a 3-bedroom near The Island.
                </p>
            </div>
            <button className="px-4 py-2 bg-white text-amber-700 text-xs font-bold rounded-lg shadow-sm hover:bg-amber-100 transition-colors">
                View Scenario
            </button>
        </div>
      )}

      {/* Charts Section - Simplified for Beginner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {!isBeginner && (
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-6">Revenue & Occupancy Forecast</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis yAxisId="left" stroke="#64748b" />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="Revenue" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} />
                    <Line yAxisId="right" type="monotone" dataKey="Occupancy" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
                </ResponsiveContainer>
            </div>
            </div>
        )}

        <div className={`${isBeginner ? 'lg:col-span-3' : 'lg:col-span-1'} bg-white p-6 rounded-xl shadow-sm border border-slate-200`}>
          <h3 className="font-semibold text-slate-800 mb-4">Property Status</h3>
          <div className="space-y-4">
            {mockProperties.map((prop) => (
              <div key={prop.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                <img src={prop.imgUrl} alt={prop.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{prop.name}</h4>
                  <p className="text-xs text-slate-500">{prop.occupancyRate}% Occupied</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  prop.status === 'Active' ? 'bg-green-100 text-green-700' : 
                  prop.status === 'Cleaning' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {prop.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
