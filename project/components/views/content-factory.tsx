'use client';

import React, { useState } from 'react';
import { Upload, Zap, Download, Instagram, Twitter, Linkedin, CheckCircle2, Loader2, Image as ImageIcon, Smartphone, Send } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export function ContentFactory() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activePlatform, setActivePlatform] = useState('instagram');
  const [progress, setProgress] = useState(0);

  // 1. IMPROVED CSV PARSER (Handles 100+ rows)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').map(r => r.trim()).filter(r => r !== '');
      // Skip header, map rows
      const data = rows.slice(1).map((topic, index) => ({
        id: index,
        topic: topic.replace(/^"|"$/g, ''),
        content: '',
        image: '',
        status: 'pending'
      }));
      setPosts(data);
    };
    reader.readAsText(file);
  };

  // 2. REAL-TIME GENERATION ENGINE
  const generateAll = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || (window as any).VITE_GEMINI_API_KEY; 
    if (!apiKey) return alert("Please add your Gemini API Key!");

    setIsGenerating(true);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const updatedPosts = [...posts];

    for (let i = 0; i < updatedPosts.length; i++) {
      try {
        const prompt = `Write a viral ${activePlatform} post about: "${updatedPosts[i].topic}". 
        Include a hook, 3 value points, and 5 hashtags. Use line breaks.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        updatedPosts[i].content = response.text();
        // Dynamic Image Generation
        updatedPosts[i].image = `https://image.pollinations.ai/prompt/${encodeURIComponent(updatedPosts[i].topic + " professional photography, cinematic lighting, high quality")}?width=1080&height=1080&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;
        updatedPosts[i].status = 'completed';
        
        setPosts([...updatedPosts]); // Update UI row-by-row
        setProgress(Math.round(((i + 1) / posts.length) * 100));
      } catch (err) {
        updatedPosts[i].status = 'error';
      }
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex h-full gap-8">
      {/* LEFT: THE SCROLLABLE QUEUE */}
      <div className="flex flex-1 flex-col gap-6 overflow-hidden">
        <div className="flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">Production Queue</h2>
            <p className="text-sm text-zinc-500">{posts.length} items ready for processing</p>
          </div>
          <div className="flex gap-3">
             <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-white/10 cursor-pointer transition-all text-sm font-bold">
                <Upload size={16} /> Upload CSV
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".csv" />
             </label>
             {posts.length > 0 && (
               <button onClick={generateAll} disabled={isGenerating} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20">
                  {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} fill="white" />}
                  {isGenerating ? `${progress}% Done` : `Generate ${posts.length} Posts`}
               </button>
             )}
          </div>
        </div>

        {/* This container allows 100+ rows to scroll */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800">
          {posts.map((post, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${selectedIndex === idx ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${post.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-500'}`}>
                {post.status === 'completed' ? <CheckCircle2 size={16} /> : idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-zinc-200 truncate">{post.topic}</p>
                <p className="text-[10px] text-zinc-500 truncate">{post.content || 'Pending generation...'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: SMART PREVIEW */}
      <div className="w-[380px] flex flex-col gap-6">
        <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-4 aspect-[9/18] relative shadow-2xl overflow-hidden">
           {/* Platform Toggles */}
           <div className="flex justify-center gap-4 mb-4 border-b border-white/5 pb-4">
              <Instagram onClick={() => setActivePlatform('instagram')} size={20} className={activePlatform === 'instagram' ? 'text-indigo-400' : 'text-zinc-600'} />
              <Linkedin onClick={() => setActivePlatform('linkedin')} size={20} className={activePlatform === 'linkedin' ? 'text-indigo-400' : 'text-zinc-600'} />
              <Twitter onClick={() => setActivePlatform('twitter')} size={20} className={activePlatform === 'twitter' ? 'text-indigo-400' : 'text-zinc-600'} />
           </div>

           <div className="bg-black rounded-3xl overflow-hidden h-full flex flex-col border border-white/5">
              <div className="aspect-square bg-zinc-800">
                {posts[selectedIndex]?.image && (
                  <img src={posts[selectedIndex].image} className="w-full h-full object-cover animate-in fade-in duration-700" alt="AI Generated" />
                )}
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600" />
                  <span className="text-[10px] font-bold">ai_creator_os</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-300 whitespace-pre-wrap">
                  {posts[selectedIndex]?.content || "Upload CSV and click generate to see the magic..."}
                </p>
              </div>
           </div>
        </div>

        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all">
          <Download size={16} /> Export All Assets (ZIP)
        </button>
      </div>
    </div>
  );
}
