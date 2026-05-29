import React from 'react';
import { Crosshair, PlaySquare, Network, RefreshCw, Database, Filter, Workflow, Share2, Layers } from 'lucide-react';

export default function BrochureDocument() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page { size: A4 portrait; margin: 0; }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background-color: #0A0A0F !important;
            }
            .page-break { page-break-after: always; break-after: page; }
            * { text-shadow: none !important; }
          }
          
          .a4-page {
            width: 210mm; min-height: 297mm;
            background-color: #0A0A0F; color: #F0F0F5;
            margin: 0 auto; position: relative;
            box-sizing: border-box; overflow: hidden;
            font-family: var(--font-inter), sans-serif; z-index: 1;
          }
          .a4-inner {
            position: absolute; top: 10mm; left: 10mm; right: 10mm; bottom: 10mm;
            border: 1px solid rgba(201, 168, 76, 0.2);
            padding: 12mm; display: flex; flex-direction: column; z-index: 10;
            background: #0A0A0F;
          }
          @media screen {
            .a4-page { margin-bottom: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.9); border: 1px solid #2A2A32; }
            body { background-color: #141418; padding: 40px 0; }
          }
          
          .gold-gradient {
            background: linear-gradient(135deg, #C9A84C 0%, #A07D3A 50%, #7A5C2E 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }
          .gold-bg { background: linear-gradient(135deg, #C9A84C 0%, #A07D3A 50%, #7A5C2E 100%); }
          
          .diagram-box {
            background: #141418; border: 1px solid #2A2A32;
            border-radius: 12px; position: relative; overflow: hidden;
            display: flex; align-items: center; justify-content: center;
          }
          .diagram-line-h { height: 2px; background: linear-gradient(90deg, transparent, #C9A84C, transparent); }
          .diagram-line-v { width: 2px; background: linear-gradient(180deg, transparent, #C9A84C, transparent); }
          
          /* Abstract Patterns */
          .pattern-dots {
            background-image: radial-gradient(rgba(201, 168, 76, 0.3) 1px, transparent 1px);
            background-size: 12px 12px;
          }
          .pattern-grid {
            background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `
      }} />

      {/* ========================================== */}
      {/* PAGE 1: PHILOSOPHY */}
      {/* ========================================== */}
      <div className="a4-page page-break">
        <div className="a4-inner">
          <header className="mb-10 flex justify-between items-start">
            <div>
              <h1 className="font-outfit text-4xl font-bold tracking-tight mb-2">Intelligence & Architecture</h1>
              <p className="font-inter text-[#9B9BA8] text-sm tracking-widest uppercase">The Kramaniti Blueprint</p>
            </div>
            <div className="w-12 h-12 border border-[#C9A84C]/50 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 gold-bg rounded-full shadow-[0_0_15px_#C9A84C]"></div>
            </div>
          </header>

          <div className="flex-grow flex flex-col gap-10">
            {/* The Problem Block */}
            <div className="flex-1 border border-[#2A2A32] bg-[#141418] rounded-2xl p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,0,0,0.05)_0%,_transparent_70%)] pointer-events-none"></div>
              
              <div className="mb-8">
                <p className="font-outfit uppercase tracking-[0.2em] text-[#6B6B78] text-[10px] font-bold mb-2">The Problem</p>
                <h2 className="font-sora text-2xl text-[#F0F0F5] font-semibold mb-4">Scaling usually means losing your voice.</h2>
                <p className="text-sm text-[#9B9BA8] leading-[1.7] max-w-[500px]">
                  Most automated marketing feels robotic, generic, and lifeless. On the other hand, creating authentic, high-quality content manually simply takes too much time and money.
                </p>
              </div>

              {/* Diagram: The Broken Pipeline */}
              <div className="mt-auto h-40 diagram-box pattern-grid border-[#2A2A32]">
                <div className="flex items-center gap-4 w-full px-12">
                  <div className="flex-1 h-8 bg-[#2A2A32] rounded flex items-center px-4"><div className="w-1/2 h-2 bg-[#6B6B78] rounded"></div></div>
                  <div className="w-8 h-[2px] bg-[#6B6B78]"></div>
                  
                  {/* The break */}
                  <div className="flex-1 h-8 border-2 border-dashed border-[#6B6B78] rounded flex items-center justify-center relative">
                    <div className="absolute -top-6 text-[#6B6B78] text-[10px] uppercase font-bold tracking-widest">Broken Scale</div>
                    <div className="w-4 h-4 text-[#6B6B78]">✕</div>
                  </div>
                  
                  <div className="w-8 h-[2px] bg-red-900/50"></div>
                  <div className="flex-1 h-8 bg-red-900/20 border border-red-900/50 rounded flex items-center px-4"><div className="w-3/4 h-2 bg-red-900/50 rounded"></div></div>
                </div>
              </div>
            </div>

            {/* The Approach Block */}
            <div className="flex-1 border border-[#C9A84C]/40 bg-[#141418] rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-[0_10px_40px_rgba(201,168,76,0.08)]">
              <div className="absolute bottom-0 left-0 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_bottom_left,_rgba(201,168,76,0.1)_0%,_transparent_70%)] pointer-events-none"></div>
              
              <div className="mb-8 relative z-10">
                <p className="font-outfit uppercase tracking-[0.2em] text-[#C9A84C] text-[10px] font-bold mb-2">The Approach</p>
                <h2 className="font-sora text-2xl text-[#C9A84C] font-semibold mb-4">Amplifying your story with logic.</h2>
                <p className="text-sm text-[#F0F0F5] leading-[1.7] max-w-[500px]">
                  We believe artificial intelligence shouldn&apos;t replace your story—it should amplify it. By combining great storytelling with smart automation, we build systems that scale your unique voice without losing its soul.
                </p>
              </div>

              {/* Diagram: The Amplification Network */}
              <div className="mt-auto h-48 diagram-box border-[#C9A84C]/30 relative">
                {/* Center Node */}
                <div className="absolute left-12 w-20 h-20 rounded-full border-2 border-[#C9A84C] flex items-center justify-center bg-[#0A0A0F] shadow-[0_0_30px_rgba(201,168,76,0.3)] z-10">
                  <div className="w-8 h-8 gold-bg rounded-full"></div>
                </div>
                
                {/* Radiating Signal Rings */}
                <div className="absolute left-[88px] w-40 h-40 rounded-full border border-[#C9A84C]/30 -translate-x-1/2"></div>
                <div className="absolute left-[88px] w-60 h-60 rounded-full border border-[#C9A84C]/10 -translate-x-1/2"></div>
                
                {/* Connecting Lines */}
                <div className="absolute left-[128px] top-[96px] w-32 h-[2px] bg-gradient-to-r from-[#C9A84C] to-[#C9A84C]/40"></div>
                <div className="absolute left-[128px] top-[96px] w-32 h-[2px] bg-gradient-to-r from-[#C9A84C] to-[#C9A84C]/40 origin-left -rotate-[25deg]"></div>
                <div className="absolute left-[128px] top-[96px] w-32 h-[2px] bg-gradient-to-r from-[#C9A84C] to-[#C9A84C]/40 origin-left rotate-[25deg]"></div>

                {/* Scaled Output Nodes */}
                <div className="absolute right-16 top-6 w-32 h-10 border border-[#C9A84C]/50 rounded bg-[#1A1A24] flex items-center px-4 gap-3">
                  <div className="w-2 h-2 gold-bg rounded-full"></div><div className="flex-1 h-2 bg-[#C9A84C]/20 rounded"></div>
                </div>
                <div className="absolute right-16 top-1/2 -translate-y-1/2 w-40 h-10 border border-[#C9A84C]/80 rounded bg-[#1A1A24] flex items-center px-4 gap-3 shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                  <div className="w-2 h-2 gold-bg rounded-full"></div><div className="w-3/4 h-2 bg-[#C9A84C]/40 rounded"></div>
                </div>
                <div className="absolute right-16 bottom-6 w-28 h-10 border border-[#C9A84C]/50 rounded bg-[#1A1A24] flex items-center px-4 gap-3">
                  <div className="w-2 h-2 gold-bg rounded-full"></div><div className="flex-1 h-2 bg-[#C9A84C]/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <footer className="mt-8 flex justify-between items-end text-[#6B6B78]">
            <p className="font-outfit uppercase tracking-[0.3em] text-[8px] font-bold">Kramaniti Architecture</p>
            <p className="text-[10px] font-mono">01 // 04</p>
          </footer>
        </div>
      </div>

      {/* ========================================== */}
      {/* PAGE 2: METHODOLOGY (Vertical Flow) */}
      {/* ========================================== */}
      <div className="a4-page page-break">
        <div className="a4-inner relative">
          
          <header className="mb-8 border-b border-[#2A2A32] pb-6">
            <h2 className="font-outfit text-3xl font-bold tracking-tight">The Methodology</h2>
            <p className="font-inter text-[#9B9BA8] text-sm mt-2">Four stages of transforming ideas into automated systems.</p>
          </header>

          <div className="relative flex-grow">
            {/* The Central Flow Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-[#2A2A32]">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#C9A84C] via-[#C9A84C]/50 to-transparent"></div>
            </div>

            {/* STEP 1: Capture (Left Side) */}
            <div className="relative h-[180px] w-full flex items-center mb-8">
              {/* Text Left */}
              <div className="w-1/2 pr-12 text-right">
                <p className="font-outfit text-[#C9A84C] font-bold text-lg mb-1">01</p>
                <h3 className="font-sora text-xl text-[#F0F0F5] font-semibold mb-2">Capture Your Story</h3>
                <p className="text-xs text-[#9B9BA8] leading-[1.6]">
                  We start with the raw, authentic truth of your brand. Video, audio, or process docs—we capture your message exactly as it is.
                </p>
              </div>
              {/* Node Center */}
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full gold-bg shadow-[0_0_10px_#C9A84C]"></div>
              {/* Diagram Right */}
              <div className="w-1/2 pl-12">
                <div className="w-48 h-32 bg-[#141418] border border-[#2A2A32] rounded-lg p-4 relative flex flex-col items-center">
                  <Database className="text-[#C9A84C] w-6 h-6 absolute top-4 left-4" />
                  <div className="w-24 h-16 border-x-2 border-b-2 border-[#6B6B78] rounded-b-xl mt-6 flex flex-col items-center justify-end p-2 gap-1 relative overflow-hidden">
                    <div className="w-8 h-8 bg-[#2A2A32] rounded absolute -top-4 animate-pulse"></div>
                    <div className="w-4 h-4 bg-[#C9A84C]/50 rounded mb-2"></div>
                    <div className="w-6 h-2 bg-[#C9A84C] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Find Signal (Right Side) */}
            <div className="relative h-[180px] w-full flex items-center mb-8">
              {/* Diagram Left */}
              <div className="w-1/2 pr-12 flex justify-end">
                <div className="w-56 h-32 bg-[#141418] border border-[#2A2A32] rounded-lg p-4 relative flex items-center justify-between">
                  {/* Chaos */}
                  <div className="w-16 h-full flex flex-col justify-center gap-2 opacity-50">
                    <svg viewBox="0 0 50 20" className="w-full h-4 stroke-[#6B6B78] fill-none stroke-2"><path d="M0 10 Q10 0 20 10 T40 10 T50 10"/></svg>
                    <svg viewBox="0 0 50 20" className="w-full h-4 stroke-[#6B6B78] fill-none stroke-2"><path d="M0 5 Q15 20 25 10 T45 5 T50 10"/></svg>
                  </div>
                  {/* Filter Node */}
                  <div className="w-6 h-16 border border-[#C9A84C] rounded bg-[#C9A84C]/10 flex items-center justify-center">
                    <Filter className="w-3 h-3 text-[#C9A84C]" />
                  </div>
                  {/* Order */}
                  <div className="w-16 h-full flex flex-col justify-center gap-3">
                    <div className="w-full h-[2px] gold-bg"></div>
                    <div className="w-3/4 h-[2px] gold-bg"></div>
                    <div className="w-full h-[2px] gold-bg"></div>
                  </div>
                </div>
              </div>
              {/* Node Center */}
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#141418] border-2 border-[#C9A84C]"></div>
              {/* Text Right */}
              <div className="w-1/2 pl-12">
                <p className="font-outfit text-[#C9A84C] font-bold text-lg mb-1">02</p>
                <h3 className="font-sora text-xl text-[#F0F0F5] font-semibold mb-2">Find the Signal</h3>
                <p className="text-xs text-[#9B9BA8] leading-[1.6]">
                  Our systems analyze raw input to find the core message, stripping noise and extracting structure while preserving your tone.
                </p>
              </div>
            </div>

            {/* STEP 3: Build Engine (Left Side) */}
            <div className="relative h-[180px] w-full flex items-center mb-8">
              {/* Text Left */}
              <div className="w-1/2 pr-12 text-right">
                <p className="font-outfit text-[#C9A84C] font-bold text-lg mb-1">03</p>
                <h3 className="font-sora text-xl text-[#F0F0F5] font-semibold mb-2">Build the Engine</h3>
                <p className="text-xs text-[#9B9BA8] leading-[1.6]">
                  We set up the logic rules and automated pathways, ensuring the system routes and triggers actions securely and reliably.
                </p>
              </div>
              {/* Node Center */}
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#141418] border-2 border-[#C9A84C]"></div>
              {/* Diagram Right */}
              <div className="w-1/2 pl-12">
                <div className="w-48 h-36 bg-[#141418] border border-[#2A2A32] rounded-lg p-4 relative flex items-center justify-center">
                  <Workflow className="absolute top-3 left-3 w-4 h-4 text-[#6B6B78]" />
                  <div className="relative w-full h-full">
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 w-8 h-8 rounded border border-[#C9A84C]/50 bg-[#C9A84C]/10 flex items-center justify-center z-10"><div className="w-2 h-2 gold-bg rounded-full"></div></div>
                    
                    <div className="absolute top-[20%] left-12 w-16 h-[2px] bg-[#2A2A32] origin-left rotate-45"></div>
                    <div className="absolute bottom-[20%] left-12 w-16 h-[2px] bg-[#2A2A32] origin-left -rotate-45"></div>
                    <div className="absolute top-1/2 left-12 w-16 h-[2px] gold-bg -translate-y-1/2"></div>
                    
                    <div className="absolute top-[10%] right-4 w-6 h-6 rounded border border-[#2A2A32] bg-[#0A0A0F] z-10"></div>
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 w-8 h-8 rounded border border-[#C9A84C] bg-[#141418] shadow-[0_0_15px_rgba(201,168,76,0.2)] z-10 flex items-center justify-center"><div className="w-3 h-3 gold-bg rounded-full"></div></div>
                    <div className="absolute bottom-[10%] right-4 w-6 h-6 rounded border border-[#2A2A32] bg-[#0A0A0F] z-10"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: Scale (Right Side) */}
            <div className="relative h-[180px] w-full flex items-center">
              {/* Diagram Left */}
              <div className="w-1/2 pr-12 flex justify-end">
                <div className="w-48 h-36 bg-gradient-to-br from-[#1E1E24] to-[#141418] border border-[#C9A84C]/60 rounded-lg p-4 relative flex flex-col items-center shadow-[0_10px_30px_rgba(201,168,76,0.15)]">
                  <Share2 className="absolute top-3 right-3 w-4 h-4 text-[#C9A84C]" />
                  <div className="w-full flex justify-between gap-2 mt-4 px-2">
                    <div className="w-10 h-14 bg-[#0A0A0F] border border-[#C9A84C]/40 rounded flex flex-col gap-1 p-1"><div className="w-full h-1 gold-bg rounded"></div><div className="w-full h-[2px] bg-[#2A2A32]"></div></div>
                    <div className="w-10 h-14 bg-[#0A0A0F] border border-[#C9A84C]/80 rounded flex flex-col gap-1 p-1 shadow-[0_0_10px_rgba(201,168,76,0.2)]"><div className="w-full h-1 gold-bg rounded"></div><div className="w-3/4 h-[2px] bg-[#6B6B78]"></div></div>
                    <div className="w-10 h-14 bg-[#0A0A0F] border border-[#C9A84C]/40 rounded flex flex-col gap-1 p-1"><div className="w-full h-1 gold-bg rounded"></div><div className="w-1/2 h-[2px] bg-[#2A2A32]"></div></div>
                  </div>
                  <div className="w-3/4 h-[2px] gold-bg mt-6 rounded-full"></div>
                  <p className="text-[8px] text-[#C9A84C] mt-2 uppercase tracking-widest">Multi-Platform Scale</p>
                </div>
              </div>
              {/* Node Center */}
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full gold-bg flex items-center justify-center shadow-[0_0_15px_#C9A84C]">
                <div className="w-2 h-2 bg-[#0A0A0F] rounded-full"></div>
              </div>
              {/* Text Right */}
              <div className="w-1/2 pl-12">
                <p className="font-outfit text-[#C9A84C] font-bold text-lg mb-1">04</p>
                <h3 className="font-sora text-xl text-[#F0F0F5] font-semibold mb-2">Scale Your Reach</h3>
                <p className="text-xs text-[#9B9BA8] leading-[1.6]">
                  A single video or idea is automatically transformed into a full month of content. You record once; the system distributes continuously.
                </p>
              </div>
            </div>
            
          </div>
          
          <footer className="mt-4 flex justify-between items-end text-[#6B6B78]">
            <p className="font-outfit uppercase tracking-[0.3em] text-[8px] font-bold">Kramaniti Architecture</p>
            <p className="text-[10px] font-mono">02 // 04</p>
          </footer>
        </div>
      </div>

      {/* ========================================== */}
      {/* PAGE 3: SERVICE TIERS (Infographic Cards) */}
      {/* ========================================== */}
      <div className="a4-page page-break">
        <div className="a4-inner">
          <header className="mb-6 border-b border-[#2A2A32] pb-4">
            <h2 className="font-outfit text-3xl font-bold tracking-tight">How We Can Help</h2>
          </header>

          <div className="flex-grow grid grid-rows-4 gap-5">
            
            {/* TIER 1: Audit */}
            <div className="bg-[#141418] border border-[#2A2A32] rounded-xl flex items-stretch overflow-hidden">
              <div className="w-1/3 border-r border-[#2A2A32] relative pattern-dots flex items-center justify-center p-6 bg-[#0A0A0F]">
                <Crosshair className="absolute w-24 h-24 text-[#2A2A32] stroke-[1px] opacity-50" />
                <div className="w-full h-full border border-[#6B6B78]/30 grid grid-cols-4 grid-rows-4 relative z-10">
                  <div className="col-start-2 row-start-2 col-span-2 row-span-2 border-2 border-[#C9A84C] bg-[#C9A84C]/10 flex items-center justify-center shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                    <div className="w-2 h-2 gold-bg rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-center">
                <div className="inline-block border border-[#2A2A32] px-2 py-1 rounded bg-[#0A0A0F] w-fit mb-3">
                  <p className="text-[9px] text-[#6B6B78] uppercase tracking-widest font-bold">I. Entry Level</p>
                </div>
                <h3 className="font-sora text-xl text-[#F0F0F5] font-semibold mb-2">The Strategy Audit</h3>
                <p className="text-xs text-[#9B9BA8] leading-[1.6]">
                  A high-impact review of your current operations. We pinpoint exact bottlenecks using the targeting framework above and deliver an actionable AI integration blueprint.
                </p>
              </div>
            </div>

            {/* TIER 2: Narrative Kit */}
            <div className="bg-[#141418] border border-[#2A2A32] rounded-xl flex items-stretch overflow-hidden">
              <div className="w-1/3 border-r border-[#2A2A32] relative flex items-center justify-center p-6 bg-[#0A0A0F]">
                <div className="relative w-24 h-16">
                  {/* Documents behind */}
                  <div className="absolute -right-2 top-2 w-16 h-20 border border-[#6B6B78]/50 bg-[#141418] rounded rotate-12"></div>
                  <div className="absolute -right-4 top-4 w-16 h-20 border border-[#C9A84C]/50 bg-[#1A1A24] rounded rotate-[24deg] shadow-[0_0_10px_rgba(201,168,76,0.1)] p-2">
                    <div className="w-full h-[2px] bg-[#C9A84C]/50 mb-1"></div><div className="w-2/3 h-[2px] bg-[#C9A84C]/50"></div>
                  </div>
                  {/* Video Player in front */}
                  <div className="absolute left-0 top-0 w-20 h-14 border-2 border-[#F0F0F5] bg-[#0A0A0F] rounded flex items-center justify-center shadow-lg">
                    <PlaySquare className="w-6 h-6 text-[#C9A84C] fill-[#C9A84C]/20" />
                  </div>
                </div>
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-center">
                <div className="inline-block border border-[#2A2A32] px-2 py-1 rounded bg-[#0A0A0F] w-fit mb-3">
                  <p className="text-[9px] text-[#6B6B78] uppercase tracking-widest font-bold">II. Core Project</p>
                </div>
                <h3 className="font-sora text-xl text-[#F0F0F5] font-semibold mb-2">The Founder Narrative Kit</h3>
                <p className="text-xs text-[#9B9BA8] leading-[1.6]">
                  We shoot a cinematic hero video (the source node), and our systems automatically expand it into a month&apos;s worth of scaled written documentation and social assets.
                </p>
              </div>
            </div>

            {/* TIER 3: Custom Build (Premium) */}
            <div className="bg-gradient-to-r from-[#141418] to-[#1E1E24] border border-[#C9A84C] rounded-xl flex items-stretch overflow-hidden shadow-[0_15px_40px_rgba(201,168,76,0.15)] relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 gold-bg"></div>
              <div className="w-1/3 border-r border-[#C9A84C]/30 relative flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.15)_0%,_#0A0A0F_100%)]">
                <Network className="absolute w-24 h-24 text-[#C9A84C] stroke-[1px] opacity-20" />
                <div className="relative w-20 h-20">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 border border-[#C9A84C] rounded bg-[#1A1A24] z-10 flex items-center justify-center"><Layers className="w-3 h-3 text-[#C9A84C]"/></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border border-[#6B6B78] rounded bg-[#1A1A24] z-10"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border border-[#C9A84C] rounded bg-[#C9A84C]/20 shadow-[0_0_15px_#C9A84C] z-10 flex items-center justify-center"><div className="w-2 h-2 gold-bg rounded-full"></div></div>
                  
                  <svg className="absolute inset-0 w-full h-full z-0" style={{ overflow: 'visible' }}>
                    <path d="M40 20 L10 60" stroke="#6B6B78" strokeWidth="1.5" strokeDasharray="3 3"/>
                    <path d="M40 20 L70 60" stroke="#C9A84C" strokeWidth="2" />
                    <path d="M10 60 L70 60" stroke="#2A2A32" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-center">
                <div className="inline-block border border-[#C9A84C]/50 px-2 py-1 rounded bg-[#C9A84C]/10 w-fit mb-3">
                  <p className="text-[9px] text-[#C9A84C] uppercase tracking-widest font-bold">III. Premium Build</p>
                </div>
                <h3 className="font-sora text-xl text-[#F0F0F5] font-semibold mb-2">Custom Automation Build</h3>
                <p className="text-xs text-[#9B9BA8] leading-[1.6]">
                  We build custom API routing and AI tools just for your team. From organizing leads to drafting emails, we engineer the exact network architecture your business requires.
                </p>
              </div>
            </div>

            {/* TIER 4: Retainer */}
            <div className="bg-[#141418] border border-[#2A2A32] rounded-xl flex items-stretch overflow-hidden">
              <div className="w-1/3 border-r border-[#2A2A32] relative flex items-center justify-center p-6 bg-[#0A0A0F]">
                <div className="w-20 h-20 border-4 border-[#2A2A32] rounded-full relative flex items-center justify-center">
                  <div className="w-full h-full absolute border-4 border-transparent border-t-[#C9A84C] rounded-full animate-spin"></div>
                  <RefreshCw className="w-8 h-8 text-[#C9A84C]" />
                </div>
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-center">
                <div className="inline-block border border-[#2A2A32] px-2 py-1 rounded bg-[#0A0A0F] w-fit mb-3">
                  <p className="text-[9px] text-[#6B6B78] uppercase tracking-widest font-bold">IV. Ongoing</p>
                </div>
                <h3 className="font-sora text-xl text-[#F0F0F5] font-semibold mb-2">The Content Retainer</h3>
                <p className="text-xs text-[#9B9BA8] leading-[1.6]">
                  For businesses that want to grow on autopilot. We manage the continuous engine every month, ensuring your brand stays active through an endless, automated loop.
                </p>
              </div>
            </div>

          </div>
          
          <footer className="mt-4 flex justify-between items-end text-[#6B6B78]">
            <p className="font-outfit uppercase tracking-[0.3em] text-[8px] font-bold">Kramaniti Architecture</p>
            <p className="text-[10px] font-mono">03 // 04</p>
          </footer>
        </div>
      </div>

      {/* ========================================== */}
      {/* PAGE 4: NEXT STEPS */}
      {/* ========================================== */}
      <div className="a4-page relative">
        <div className="absolute bottom-0 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_bottom,_rgba(201,168,76,0.15)_0%,_transparent_70%)] pointer-events-none"></div>
        <div className="motif-text text-[200px] text-center w-full" style={{ bottom: '-2%', left: '0' }}>BUILD</div>
        
        <div className="a4-inner items-center justify-center text-center">
          
          <div className="mb-20 w-full max-w-[500px] relative z-10">
            {/* Visual Node */}
            <div className="w-16 h-16 rounded-full border border-[#C9A84C]/50 flex items-center justify-center mx-auto mb-8 bg-[#141418] shadow-[0_0_30px_rgba(201,168,76,0.2)]">
              <div className="w-6 h-6 border-2 border-[#C9A84C] rounded flex items-center justify-center rotate-45">
                 <div className="w-2 h-2 gold-bg rounded-full"></div>
              </div>
            </div>
            <p className="font-outfit uppercase tracking-[0.3em] text-[#C9A84C] text-[10px] font-bold mb-6">The Standard</p>
            <p className="text-base text-[#9B9BA8] leading-[1.8] border-x border-[#2A2A32] px-8 py-4">
              Our work is backed by years of commercial media production for global brands and a deep understanding of modern automation. We don&apos;t just guess what works; we engineer systems that deliver results.
            </p>
          </div>

          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#C9A84C] to-transparent mb-12"></div>

          <div className="relative z-10 w-full max-w-[500px]">
            <h2 className="font-outfit text-5xl font-bold mb-10 leading-[1.2]">
              Let&apos;s build a system<br/>
              <span className="text-[#9B9BA8]">that works for you.</span>
            </h2>
            <div className="bg-[#141418] border border-[#C9A84C]/50 px-12 py-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 left-0 w-full h-1 gold-bg"></div>
              <p className="font-inter text-[#C9A84C] text-2xl font-bold tracking-[0.2em] mb-4">KRAMANITI.COM</p>
              <div className="w-full h-[1px] bg-[#2A2A32] mb-4"></div>
              <p className="font-inter text-[#F0F0F5] text-sm tracking-widest opacity-80 uppercase">karan@kramaniti.com</p>
            </div>
          </div>

          <footer className="absolute bottom-10 left-10 right-10 flex justify-between items-end border-t border-[#2A2A32] pt-6 z-10">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 border border-[#C9A84C] rounded-full flex items-center justify-center"><div className="w-1 h-1 gold-bg rounded-full"></div></div>
              <p className="font-outfit uppercase tracking-[0.3em] text-[#6B6B78] text-[8px] font-bold">© 2025 Kramaniti</p>
            </div>
            <p className="text-[10px] text-[#C9A84C] font-mono font-bold tracking-widest">04 // 04</p>
          </footer>
        </div>
      </div>
    </>
  );
}
