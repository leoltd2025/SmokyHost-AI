import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { generateGuestReply } from '../services/geminiService';
import { Send, User, Bot, MoreHorizontal, Wand2 } from 'lucide-react';

const mockChats: { id: string; guestName: string; property: string; lastMsg: string }[] = [
  { id: '1', guestName: 'Sarah Miller', property: 'Bear Hug Cabin', lastMsg: 'Is early check-in available?' },
  { id: '2', guestName: 'John Doe', property: 'Smoky Retreat', lastMsg: 'We loved the hot tub!' },
  { id: '3', guestName: 'Emily Blunt', property: 'Dollywood Haven', lastMsg: 'How far is the grocery store?' },
];

const mockMessages: ChatMessage[] = [
  { id: '1', sender: 'guest', text: 'Hi, we are arriving a bit early. Is it possible to check in around 2 PM instead of 4 PM?', timestamp: new Date(Date.now() - 3600000) },
  { id: '2', sender: 'ai', text: 'Hi Sarah! Thanks for reaching out. Let me check with our cleaning team to see if the cabin will be ready. I will get back to you within an hour.', timestamp: new Date(Date.now() - 3500000) },
  { id: '3', sender: 'guest', text: 'That would be great, thank you! Also, do you have any recommendations for dinner nearby?', timestamp: new Date(Date.now() - 1800000) },
];

const GuestCommView: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState(mockChats[0].id);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [isDrafting, setIsDrafting] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'host',
      text: input,
      timestamp: new Date()
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  const handleAiDraft = async () => {
    setIsDrafting(true);
    const lastGuestMsg = [...messages].reverse().find(m => m.sender === 'guest');
    if (lastGuestMsg) {
      const draft = await generateGuestReply(
        lastGuestMsg.text, 
        "Bear Hug Cabin", 
        "The guest is asking about early check-in and dinner recommendations. Early check-in depends on cleaning status. Recommend 'The Old Mill' and 'Local Goat' for dinner."
      );
      setInput(draft);
    }
    setIsDrafting(false);
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
      {/* Chat List */}
      <div className="w-1/3 border-r border-slate-200 bg-slate-50">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Inbox</h3>
        </div>
        <div className="overflow-y-auto h-full">
          {mockChats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-white transition-colors ${selectedChat === chat.id ? 'bg-white border-l-4 border-l-indigo-600' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-slate-900">{chat.guestName}</h4>
                <span className="text-xs text-slate-400">10m</span>
              </div>
              <p className="text-xs text-indigo-600 font-medium mb-1">{chat.property}</p>
              <p className="text-sm text-slate-500 truncate">{chat.lastMsg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
          <div>
            <h3 className="font-bold text-slate-800">Sarah Miller</h3>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Confirmed Guest
            </span>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'guest' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                msg.sender === 'guest' ? 'bg-white text-slate-800 rounded-tl-none' : 
                msg.sender === 'ai' ? 'bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-tr-none' :
                'bg-indigo-600 text-white rounded-tr-none'
              }`}>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-indigo-500 mb-2 uppercase tracking-wide">
                    <Bot className="w-3 h-3" /> AI Auto-Response
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] block mt-2 ${msg.sender === 'host' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="relative">
            <textarea
              className="w-full border border-slate-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              rows={3}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
               <button 
                onClick={handleAiDraft}
                disabled={isDrafting}
                className="p-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors group relative"
                title="Generate AI Reply"
              >
                <Wand2 className={`w-5 h-5 ${isDrafting ? 'animate-spin' : ''}`} />
                <span className="absolute bottom-full right-0 mb-2 w-32 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                  Draft with Gemini
                </span>
              </button>
              <button 
                onClick={handleSend}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCommView;