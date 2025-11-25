
import React from 'react';
import { X } from 'lucide-react';

interface OnboardingTourProps {
    onClose: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="w-6 h-6" />
                </button>
                
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-2xl">🚀</span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to SmokyHost AI</h2>
                <p className="text-slate-600 mb-6">
                    Your autonomous partner for managing Pigeon Forge rentals. We've set up a "Beginner Mode" to help you get started easily.
                </p>

                <div className="space-y-4 mb-8">
                    <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">AI Dashboard</h4>
                            <p className="text-xs text-slate-500">Check your daily briefing for quick actions.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Smart Pricing</h4>
                            <p className="text-xs text-slate-500">We automatically adjust rates for Dollywood events.</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default OnboardingTour;
