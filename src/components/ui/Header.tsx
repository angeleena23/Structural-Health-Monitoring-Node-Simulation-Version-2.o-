import React from 'react';
import { useSimulation, ScreenView } from '../../context/SimulationContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Volume2, VolumeX, Cpu, Layers, Network, RotateCcw, X } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    activeBridge,
    isAudioMuted,
    toggleAudioMute,
    resetSimulation
  } = useSimulation();

  const { theme, toggleTheme } = useTheme();

  const isSimulationFlow = ['bridge-select', 'bridge-info', 'sensor-placement', 'simulation'].includes(activeScreen);

  const getBreadcrumbs = () => {
    return (
      <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-slate-400">
        <button
          onClick={() => setActiveScreen('bridge-select')}
          className={`hover:text-cyan-300 transition-colors cursor-pointer ${
            activeScreen === 'bridge-select' ? 'text-cyan-400 font-bold underline underline-offset-4' : ''
          }`}
        >
          1. Select
        </button>
        <span>→</span>

        <button
          onClick={() => setActiveScreen('bridge-info')}
          className={`hover:text-cyan-300 transition-colors cursor-pointer ${
            activeScreen === 'bridge-info' ? 'text-cyan-400 font-bold underline underline-offset-4' : ''
          }`}
        >
          2. Info
        </button>
        <span>→</span>

        <button
          onClick={() => setActiveScreen('sensor-placement')}
          className={`hover:text-cyan-300 transition-colors cursor-pointer ${
            activeScreen === 'sensor-placement' ? 'text-cyan-400 font-bold underline underline-offset-4' : ''
          }`}
        >
          3. Nodes
        </button>
        <span>→</span>

        <button
          onClick={() => setActiveScreen('simulation')}
          className={`hover:text-cyan-300 transition-colors cursor-pointer ${
            activeScreen === 'simulation' ? 'text-cyan-400 font-bold underline underline-offset-4' : ''
          }`}
        >
          4. Simulation
        </button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#050b14]/90 border-b border-white/10 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Brand Logo matching screenshots */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveScreen('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white tracking-wide group-hover:text-cyan-400 transition-colors font-mono">
                  STM32 SHM
                </h1>
                <span className="text-[10px] text-slate-400 font-mono">Node Simulation</span>
              </div>
            </div>
          </div>

          {/* Active Bridge Badge if in flow */}
          {isSimulationFlow && activeBridge && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 ml-2">
              {activeBridge.name}
            </span>
          )}
        </div>

        {/* Center Breadcrumb Navigation */}
        {isSimulationFlow ? getBreadcrumbs() : (
          <nav className="hidden md:flex items-center gap-1 font-mono text-xs text-slate-400">
            <button
              onClick={() => setActiveScreen('home')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeScreen === 'home' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'hover:text-slate-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveScreen('bridge-select')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeScreen === 'bridge-select' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'hover:text-slate-200'
              }`}
            >
              Bridge Archetypes
            </button>
            <button
              onClick={() => setActiveScreen('node-designs')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeScreen === 'node-designs' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'hover:text-slate-200'
              }`}
            >
              Node Designs
            </button>
          </nav>
        )}

        {/* Right Action Buttons matching screenshot headers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('system-arch')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Architecture</span>
          </button>

          {isSimulationFlow && (
            <>
              <button
                onClick={resetSimulation}
                title="Reset Simulation"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono border border-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setActiveScreen('bridge-select')}
                title="Select Bridge"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono border border-white/10 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bridges</span>
              </button>
            </>
          )}

          {/* Audio Mute */}
          <button
            onClick={toggleAudioMute}
            title={isAudioMuted ? 'Unmute' : 'Mute'}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors cursor-pointer"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {isSimulationFlow && (
            <button
              onClick={() => setActiveScreen('home')}
              title="Close to Home"
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
