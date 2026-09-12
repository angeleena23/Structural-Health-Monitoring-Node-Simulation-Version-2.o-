import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Header } from './components/ui/Header';
import { Footer } from './components/ui/Footer';

import { HomePage } from './pages/HomePage';
import { BridgeSelectionPage } from './pages/BridgeSelectionPage';
import { BridgeInfoFrame } from './pages/BridgeInfoFrame';
import { SensorPlacementFrame } from './pages/SensorPlacementFrame';
import { SimulationDemoPage } from './pages/SimulationDemoPage';
import { HALProgramsPage } from './pages/HALProgramsPage';
import { NodeDesignsPage } from './pages/NodeDesignsPage';
import { SystemArchPage } from './pages/SystemArchPage';
import { MCUGuidePage } from './pages/MCUGuidePage';
import { ReportPage } from './pages/ReportPage';
import { RoadmapPage } from './pages/RoadmapPage';

const MainContent: React.FC = () => {
  const { activeScreen } = useSimulation();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomePage />;
      case 'bridge-select':
        return <BridgeSelectionPage />;
      case 'bridge-info':
        return <BridgeInfoFrame />;
      case 'sensor-placement':
        return <SensorPlacementFrame />;
      case 'simulation':
        return <SimulationDemoPage />;
      case 'hal-programs':
        return <HALProgramsPage />;
      case 'node-designs':
        return <NodeDesignsPage />;
      case 'system-arch':
        return <SystemArchPage />;
      case 'mcu-guide':
        return <MCUGuidePage />;
      case 'report':
        return <ReportPage />;
      case 'roadmap':
        return <RoadmapPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
      {renderScreen()}
    </main>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <SimulationProvider>
        <div className="min-h-screen flex flex-col transition-colors duration-300">
          <Header />
          <MainContent />
          <Footer />
        </div>
      </SimulationProvider>
    </ThemeProvider>
  );
}
