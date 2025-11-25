
import React, { useState } from 'react';
import { ROIProjection } from '../types';
import { analyzeGrowthStrategy } from '../services/geminiService';
import { Calculator, TrendingUp, PlayCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Simulation Constants from Prompt
const SIM_CONSTANTS = {
    ADR_BASE: 280,
    OCC_BASE: 0.55,
    SEASONAL_FACTORS: [0.85, 0.85, 0.95, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.3, 0.9, 0.85],
    CO_HOST_COUNT: 3,
    COMMISSION: 0.25,
    OWNED_COUNT: 1,
    OWNED_COST: 200000,
    OWNED_DOWN: 40000,
    EXPENSE_RATIO: 0.45
};

const FinancialsView: React.FC<{ isBeginner: boolean }> = ({ isBeginner }) => {
  const [simResults, setSimResults] = useState<any>(null);
  const [aiAdvice, setAiAdvice] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const runSimulation = () => {
    // 1. Calculate Monthly Gross per Unit
    const monthlyData = SIM_CONSTANTS.SEASONAL_FACTORS.map((factor, index) => {
        const adr = SIM_CONSTANTS.ADR_BASE * factor;
        const occ = SIM_CONSTANTS.OCC_BASE * factor; // Simple model: Occ scales with demand
        const days = 30.4; // Avg days in month
        const gross = adr * occ * days;
        return { 
            month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][index], 
            gross, 
            adr, 
            occ 
        };
    });

    const annualGrossPerUnit = monthlyData.reduce((acc, m) => acc + m.gross, 0);
    
    // 2. Owned Property Economics
    const ownedGross = annualGrossPerUnit * SIM_CONSTANTS.OWNED_COUNT;
    const ownedExpenses = ownedGross * SIM_CONSTANTS.EXPENSE_RATIO;
    const ownedNet = ownedGross - ownedExpenses;

    // 3. Co-Host Economics
    const coHostGross = annualGrossPerUnit * SIM_CONSTANTS.CO_HOST_COUNT;
    const coHostIncome = coHostGross * SIM_CONSTANTS.COMMISSION;

    // 4. Totals
    const totalNetIncome = ownedNet + coHostIncome;
    const totalInvested = SIM_CONSTANTS.OWNED_DOWN; // Only counting down payment as investment base for ROI
    const roi = (totalNetIncome / totalInvested) * 100;

    // 5. Risk Alert Logic
    const riskLevel = SIM_CONSTANTS.OCC_BASE < 0.50 ? "High" : "Low";
    
    setSimResults({
        monthlyData,
        annualGrossPerUnit,
        ownedNet,
        coHostIncome,
        totalNetIncome,
        roi,
        riskLevel
    });
  };

  const handleAiAnalysis = async () => {
    if (!simResults) return;
    setLoadingAI(true);
    const advice = await analyzeGrowthStrategy(100000, simResults.totalNetIncome / 12);
    setAiAdvice(advice);
    setLoadingAI(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Financial Stress Test (2025 Model)</h2>
            <p className="text-slate-500 text-sm">Simulating Pigeon Forge Market Conditions: $280 Blended ADR, 55% Avg Occ.</p>
        </div>
        <button 
            onClick={runSimulation}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
            {simResults ? <RefreshCw className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            {simResults ? "Re-Run Simulation" : "Run 2025 Simulation"}
        </button>
      </div>

      {!simResults ? (
        <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl h-64 flex flex-col items-center justify-center text-slate-500">
            <Calculator className="w-12 h-12 mb-2 opacity-50" />
            <p>Click "Run 2025 Simulation" to process data.</p>
        </div>
      ) : (
        <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase">Annual Gross / Unit</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">${Math.round(simResults.annualGrossPerUnit).toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1">Based on seasonal factors</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase">Co-Host Income (3 Units)</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">${Math.round(simResults.coHostIncome).toLocaleString()}</p>
                    <p className="text-xs text-indigo-200 mt-1">Pure profit (25% comm)</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase">Total Net Year 1</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">${Math.round(simResults.totalNetIncome).toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1">Owned + Co-Hosted</p>
                </div>
                <div className={`p-5 rounded-xl border shadow-sm ${simResults.roi >= 15 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                    <p className={`text-xs font-bold uppercase ${simResults.roi >= 15 ? 'text-green-700' : 'text-orange-700'}`}>Cash-on-Cash ROI</p>
                    <p className={`text-2xl font-bold mt-1 ${simResults.roi >= 15 ? 'text-green-700' : 'text-orange-700'}`}>
                        {simResults.roi.toFixed(1)}%
                    </p>
                    <p className="text-xs opacity-70 mt-1">Target: 15%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-6">2025 Monthly Revenue Forecast (Per Unit)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={simResults.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} tick={{fontSize: 12, fill: '#64748b'}} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    formatter={(value: number) => [`$${Math.round(value).toLocaleString()}`, 'Gross Revenue']}
                                />
                                <Bar dataKey="gross" fill="#4f46e5" radius={[4,4,0,0]} barSize={40} />
                                <ReferenceLine y={4166} stroke="#fbbf24" strokeDasharray="3 3" label={{ position: 'right', value: 'Avg', fill: '#d97706', fontSize: 10 }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Analysis & Risk */}
                <div className="space-y-6">
                    {/* Risk Widget */}
                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${simResults.riskLevel === 'Low' ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-sm uppercase">Risk Assessment: {simResults.riskLevel}</h4>
                            <p className="text-sm mt-1 leading-relaxed">
                                {simResults.riskLevel === 'Low' 
                                    ? "Stable tourism demand forecasted. Maintain current 30% Short Term / 0% Mid Term mix."
                                    : "Occupancy dangerously low. Recommend immediate pivot to Furnished Finder (Mid-Term Rentals)."}
                            </p>
                        </div>
                    </div>

                    {/* AI Strategy Button */}
                    <div className="bg-indigo-900 rounded-xl p-6 text-white">
                        <h4 className="font-bold flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-yellow-400" />
                            AI Growth Engine
                        </h4>
                        {aiAdvice ? (
                            <p className="text-indigo-100 text-sm leading-relaxed">{aiAdvice}</p>
                        ) : (
                            <>
                                <p className="text-indigo-200 text-sm mb-4">Analyze this simulation to generate a personalized expansion plan.</p>
                                <button 
                                    onClick={handleAiAnalysis}
                                    disabled={loadingAI}
                                    className="w-full py-2 bg-white text-indigo-900 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors"
                                >
                                    {loadingAI ? "Analyzing..." : "Generate Growth Strategy"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default FinancialsView;
