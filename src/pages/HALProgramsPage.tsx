import React, { useState } from 'react';
import { HAL_PROGRAMS } from '../data/halProgramsData';
import { Cpu, Code, Copy, Check, FileCode, Terminal, Info, Zap } from 'lucide-react';

export const HALProgramsPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(HAL_PROGRAMS[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const activeProgram = HAL_PROGRAMS.find((p) => p.id === selectedId) || HAL_PROGRAMS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeProgram.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 pb-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 block mb-1">
            MICROCONTROLLERS CAPSTONE — STM32 FIRMWARE LABORATORY
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
            <Code className="w-8 h-8 text-cyan-400" /> STM32 HAL C/C++ Programs
          </h1>
        </div>

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer font-mono"
        >
          {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Code Copied!' : 'Copy Code to Clipboard'}</span>
        </button>
      </div>

      {/* Professor & File Location Reference Note */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>
            <strong>Academic Note:</strong> Production-grade STM32 Cube HAL C/C++ drivers for Microcontrollers course evaluation.
          </span>
        </div>
        <div className="text-[11px] text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
          <strong>Source Files:</strong> <code className="text-cyan-300">src/data/halProgramsData.ts</code>
        </div>
      </div>

      {/* Main 2-Column Code Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Program Select Cards */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" /> Embedded HAL Driver Modules
          </h3>

          <div className="flex flex-col gap-2.5">
            {HAL_PROGRAMS.map((program) => {
              const isSelected = program.id === selectedId;
              return (
                <div
                  key={program.id}
                  onClick={() => setSelectedId(program.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 font-mono text-left ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-xl ring-1 ring-cyan-500/40'
                      : 'bg-slate-950/60 border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">{program.filename}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                      {program.category}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white font-sans">
                    {program.title}
                  </h4>

                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3 h-3 text-cyan-400" /> {program.targetMcu}
                  </div>
                </div>
              );
            })}
          </div>

          {/* HAL Peripherals Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 text-xs font-mono">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Active HAL Peripherals
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeProgram.peripheralsUsed.map((perip, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-cyan-300 border border-cyan-500/20">
                  {perip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 glass-panel p-4 rounded-2xl border border-white/10 bg-slate-950/90 shadow-2xl flex flex-col gap-3 font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white">{activeProgram.filename}</h3>
              <span className="text-[11px] text-slate-400">— {activeProgram.title}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {activeProgram.description}
          </p>

          {/* Syntax Highlighted C Code Block */}
          <div className="flex-1 bg-[#050b14] p-4 rounded-xl border border-white/10 overflow-x-auto text-xs text-slate-200 leading-relaxed font-mono selection:bg-cyan-500 selection:text-white">
            <pre>
              <code>{activeProgram.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
