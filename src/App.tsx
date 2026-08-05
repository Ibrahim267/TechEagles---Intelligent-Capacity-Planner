import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CapacityProvider } from './context/CapacityContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AIChatDrawer } from './components/assistant/AIChatDrawer';

import { Landing } from './pages/Landing';
import { Upload } from './pages/Upload';
import { AnalysisLoading } from './pages/AnalysisLoading';
import { Dashboard } from './pages/Dashboard';
import { CapacityTable } from './pages/CapacityTable';
import { Recommendations } from './pages/Recommendations';
import { Simulator } from './pages/Simulator';
import { AssistantPage } from './pages/AssistantPage';

const AppContent: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const location = useLocation();

  // Hide header & sidebar on full Landing and Loading pages for clean immersion
  const isFullscreenPage = location.pathname === '/' || location.pathname === '/analysis-loading';

  if (isFullscreenPage) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analysis-loading" element={<AnalysisLoading />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <Header onToggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)} />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/upload" element={<Upload />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/capacity" element={<CapacityTable />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/assistant" element={<AssistantPage />} />
          </Routes>
        </main>
      </div>

      <AIChatDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <CapacityProvider>
      <Router>
        <AppContent />
      </Router>
    </CapacityProvider>
  );
}

export default App;
