import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import WishForm from './WishForm';
import PortalManager from './portals/PortalManager';
import SuccessScreen from './components/SuccessScreen';
import { DEMO_DATA } from './config/demoData';
import { API_BASE } from './config/api';


function App() {
  const [view, setView] = useState('landing'); // 'landing', 'create', 'portal', 'success'
  const [data, setData] = useState(null);
  const [portalId, setPortalId] = useState(null);
  const [celebrationType, setCelebrationType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to process loaded data safely
  const processLoadedData = (inputData) => {
    if (!inputData) return { chapters: [] };
    let processed = inputData;
    if (typeof processed === 'string') {
      try {
        processed = JSON.parse(processed);
        return processLoadedData(processed);
      } catch (e) {
        console.error("Failed to parse data string", e);
        return { chapters: [] };
      }
    }
    if (processed.data && !processed.chapters) return processLoadedData(processed.data);
    if (processed.attributes && !processed.chapters) return processLoadedData(processed.attributes);
    if (!processed.chapters) processed.chapters = [];
    if (!processed.recipientName) processed.recipientName = "Someone Special";
    return processed;
  };

  // 1. Check URL for ?id= or ?demo= on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const demoType = params.get('demo');

    if (demoType && DEMO_DATA[demoType]) {
      setData(DEMO_DATA[demoType]);
      setView('portal');
      setLoading(false);
    } else if (id) {
      fetch(`${API_BASE}/api/portal?id=${id}`)
        .then(res => {
          if (!res.ok) throw new Error("Portal not found");
          return res.json();
        })
        .then(json => {
          setData(processLoadedData(json.data));
          setView('portal');
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Could not load portal. It may have expired or the ID is invalid.");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleCreateNew = (preselectedType = null) => {
    setCelebrationType(preselectedType);
    setView('create');
  };

  const handleViewStory = (portalId) => {
    let id = portalId;
    if (portalId.includes('?id=')) {
      id = portalId.split('?id=')[1].split('&')[0];
    }
    setLoading(true);
    fetch(`${API_BASE}/api/portal?id=${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Portal not found");
        return res.json();
      })
      .then(json => {
        setData(processLoadedData(json.data));
        const newUrl = `${window.location.pathname}?id=${id}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        setView('portal');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Could not find that portal. Please check the ID and try again.");
        setLoading(false);
      });
  };

  const handleGenerate = async (formData) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData })
      });
      if (!res.ok) throw new Error("Failed to save portal");
      const json = await res.json();
      const newUrl = `${window.location.pathname}?id=${json.id}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
      setData(formData);
      setPortalId(json.id);
      setView('success');
    } catch (err) {
      console.error(err);
      alert("Error saving portal. Showing local preview...");
      setData(formData);
      setView('portal');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLanding = () => {
    setView('landing');
    setData(null);
    setCelebrationType(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white/80 font-medium">Loading your experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white p-6">
        <div className="max-w-md bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl text-center">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-white/60 mb-8">{error}</p>
          <button onClick={handleBackToLanding} className="px-8 py-4 bg-white text-black font-bold rounded-2xl">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {view === 'landing' && <LandingPage onCreateNew={handleCreateNew} onViewStory={handleViewStory} />}
      {view === 'create' && <WishForm onGenerate={handleGenerate} onBack={handleBackToLanding} initialCelebrationType={celebrationType} />}
      {view === 'portal' && data && <PortalManager formData={data} onBack={handleBackToLanding} isDemo={!!new URLSearchParams(window.location.search).get('demo')} />}
      {view === 'success' && data && portalId && <SuccessScreen portalId={portalId} formData={data} onBackToHome={handleBackToLanding} />}
    </div>
  );
}

export default App;