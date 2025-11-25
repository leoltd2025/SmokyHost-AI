
import React, { useState } from 'react';
import { generateMarketingContent, generateCoHostPitch } from '../services/geminiService';
import { Megaphone, Send, Copy, Check, Instagram, Facebook, Mail } from 'lucide-react';

const MarketingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'social' | 'acquisition'>('social');
  
  // Social State
  const [topic, setTopic] = useState('Fall Colors in Smokies');
  const [platform, setPlatform] = useState('Instagram');
  const [socialContent, setSocialContent] = useState('');
  const [isGeneratingSocial, setIsGeneratingSocial] = useState(false);

  // Acquisition State
  const [leadName, setLeadName] = useState('');
  const [leadAddress, setLeadAddress] = useState('');
  const [emailPitch, setEmailPitch] = useState('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

  const handleSocialGenerate = async () => {
    setIsGeneratingSocial(true);
    const content = await generateMarketingContent(topic, platform);
    setSocialContent(content);
    setIsGeneratingSocial(false);
  };

  const handlePitchGenerate = async () => {
    if (!leadName || !leadAddress) return;
    setIsGeneratingPitch(true);
    const pitch = await generateCoHostPitch(leadName, leadAddress);
    setEmailPitch(pitch);
    setIsGeneratingPitch(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Marketing & Growth Engine</h2>
            <p className="text-slate-500 text-sm">AI-driven content creation and client acquisition.</p>
        </div>
        <div className="bg-white p-1 rounded-lg border border-slate-200 flex">
            <button 
                onClick={() => setActiveTab('social')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'social' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
                Social Media
            </button>
            <button 
                onClick={() => setActiveTab('acquisition')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'acquisition' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
                Client Acquisition
            </button>
        </div>
      </div>

      {activeTab === 'social' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-indigo-500" />
                    Campaign Generator
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Topic</label>
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g. Summer Sale, New Hot Tub..."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setPlatform('Instagram')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${platform === 'Instagram' ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-white border-slate-200 text-slate-600'}`}
                            >
                                <Instagram className="w-4 h-4" /> Instagram
                            </button>
                            <button 
                                onClick={() => setPlatform('Facebook')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${platform === 'Facebook' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}
                            >
                                <Facebook className="w-4 h-4" /> Facebook
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={handleSocialGenerate}
                        disabled={isGeneratingSocial}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {isGeneratingSocial ? 'Creating...' : 'Generate Content'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                <h3 className="font-semibold text-slate-800 mb-4">Preview</h3>
                <div className="bg-slate-50 rounded-lg p-4 h-64 overflow-y-auto whitespace-pre-wrap text-slate-700 text-sm leading-relaxed border border-slate-100">
                    {socialContent || <span className="text-slate-400 italic">AI generated content will appear here...</span>}
                </div>
                {socialContent && (
                    <button className="absolute bottom-6 right-6 p-2 bg-white rounded-full shadow-md border border-slate-200 hover:bg-slate-50 text-slate-600" title="Copy to clipboard">
                        <Copy className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
      )}

      {activeTab === 'acquisition' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-teal-500" />
                    Co-Host Pitcher
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Owner Name</label>
                        <input 
                            type="text" 
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                            placeholder="John Smith"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Property Address</label>
                        <input 
                            type="text" 
                            value={leadAddress}
                            onChange={(e) => setLeadAddress(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                            placeholder="123 Wears Valley Rd"
                        />
                    </div>
                    <button 
                        onClick={handlePitchGenerate}
                        disabled={isGeneratingPitch}
                        className="w-full py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-70"
                    >
                        {isGeneratingPitch ? 'Drafting...' : 'Draft Cold Email'}
                    </button>
                </div>
                
                <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-100">
                    <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wide mb-2">Strategy Tip</h4>
                    <p className="text-xs text-teal-700">
                        Mention specific revenue uplifts. Our data shows "25% commission" with "20% higher ADR" is the highest converting value prop in Pigeon Forge.
                    </p>
                </div>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-semibold text-slate-800 mb-4">Email Draft</h3>
                 <div className="bg-slate-50 rounded-lg p-6 h-[400px] overflow-y-auto border border-slate-200">
                    {emailPitch ? (
                        <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">
                            {emailPitch}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <Send className="w-12 h-12 mb-2 opacity-20" />
                            <p>Enter lead details to generate a tailored pitch.</p>
                         </div>
                    )}
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MarketingView;
