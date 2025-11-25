
import React from 'react';
import { ViewState } from '../types';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  TrendingUp, 
  Home, 
  Briefcase, 
  DollarSign,
  Bot,
  Megaphone
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'AI Dashboard', icon: LayoutDashboard },
    { id: ViewState.GUESTS, label: 'Guest AI', icon: MessageSquareText },
    { id: ViewState.PRICING, label: 'Dynamic Pricing', icon: TrendingUp },
    { id: ViewState.LISTINGS, label: 'Listings & SEO', icon: Home },
    { id: ViewState.MARKETING, label: 'Growth Engine', icon: Megaphone },
    { id: ViewState.OPERATIONS, label: 'Operations', icon: Briefcase },
    { id: ViewState.FINANCIALS, label: 'Financials', icon: DollarSign },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-10">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">SmokyHost AI</h1>
          <p className="text-xs text-slate-400">Pigeon Forge Ops</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs font-semibold text-green-400">Auto-Pilot Active</span>
          </div>
          <p className="text-xs text-slate-400">
            AI is monitoring pricing and messages.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
