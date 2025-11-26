
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import GuestCommView from './components/GuestCommView';
import PricingView from './components/PricingView';
import ListingsView from './components/ListingsView';
import MarketingView from './components/MarketingView';
import OperationsView from './components/OperationsView';
import FinancialsView from './components/FinancialsView';
import OnboardingTour from './components/OnboardingTour';
import { ViewState } from './types';
import { Settings, Bell, Mic, Award } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isBeginnerMode, setIsBeginnerMode] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Simulate loading user pref
    setTimeout(() => setShowOnboarding(true), 500);
  }, []);

  const handleVoiceCommand = () => {
    setIsListening(true);
    // Simulate voice recognition delay
    setTimeout(() => {
        setIsListening(false);
        alert("🎤 Simulated Voice Command: 'Show me occupancy for next week.' \n\n(In production, this uses Web Speech API)");
    }, 2000);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <DashboardView isBeginner={isBeginnerMode} />;
      case ViewState.GUESTS:
        return <GuestCommView />;
      case ViewState.PRICING:
        return <PricingView isBeginner={isBeginnerMode} />;
      case ViewState.LISTINGS:
        return <ListingsView />;
      case ViewState.MARKETING:
        return <MarketingView />;
      case ViewState.OPERATIONS:
        return <OperationsView />;
      case ViewState.FINANCIALS:
        return <FinancialsView isBeginner={isBeginnerMode} />;
      default:
        return <DashboardView isBeginner={isBeginnerMode} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 ml-64 transition-all duration-300">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 sticky top-0 z-10 shadow-sm">
            {/* Left: Mode Toggle */}
            <div className="flex items-center gap-3">
                <div className={`flex items-center p-1 rounded-lg cursor-pointer border transition-colors ${isBeginnerMode ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
                    <button 
                        onClick={() => setIsBeginnerMode(true)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${isBeginnerMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        Beginner
                    </button>
                    <button 
                        onClick={() => setIsBeginnerMode(false)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!isBeginnerMode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                    >
                        Pro
                    </button>
                </div>
            </div>

            {/* Right: Tools */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleVoiceCommand}
                    className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-slate-100 text-slate-500'}`}
                    title="Voice Command"
                >
                    <Mic className="w-5 h-5" />
                </button>
                
                <button className="relative p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm border border-indigo-200 shadow-sm">
                    JD
                </div>
            </div>
        </header>

        {/* Main Content Area */}
        <div className="p-6 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      {showOnboarding && <OnboardingTour onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default App;
import { useEffect, useState } from 'react';
import Papa from 'papaparse'; // For CSV parsing (add to package.json if needed)

// Load CSV
const [metrics, setMetrics] = useState({});

useEffect(() => {
  fetch('/pigeon-forge-data.csv')
    .then(response => response.text())
    .then(csvText => {
      const parsed = Papa.parse(csvText, { header: true });
      const data = {};
      parsed.data.forEach(row => {
        data[row.Metric] = row.Value;
      });
      setMetrics(data);
    });
}, []);

// Update metrics in your dashboard
const occ = metrics['Average Occupancy Rate'] || '64';
const adr = metrics['Average Daily Rate (ADR)'] || '227';
const monthly = metrics['Average Monthly Revenue'] || '4,567';

// Replace st.metric with your UI (e.g., in DashboardView)
<div className="metric">Occupancy Rate: {occ}%</div>
<div className="metric">RevPAR: ${adr}</div>
<div className="metric">Est. Monthly Revenue: ${monthly}</div>
