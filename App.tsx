import React, { useState } from 'react';
import { ViewState } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { GuestList } from './components/GuestList';
import { OfferGenerator } from './components/OfferGenerator';
import { Settings } from './components/Settings';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedGuestId, setSelectedGuestId] = useState<string | undefined>(undefined);

  const handleGuestSelect = (guest: any) => {
    setSelectedGuestId(guest.id);
    setCurrentView(ViewState.GENERATOR);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.GUESTS:
        return <GuestList onSelectGuest={handleGuestSelect} />;
      case ViewState.GENERATOR:
        return <OfferGenerator initialGuestId={selectedGuestId} />;
      case ViewState.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-8">
            {/* Header Content can go here if needed, currently inside specific pages or Sidebar */}
        </header>
        
        {renderContent()}
      </main>
    </div>
  );
}