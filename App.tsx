import React, { useState } from 'react';
import { AppView, Post, AdSlot, Language, ChannelStats } from './types';
import { MOCK_STATS, INITIAL_POSTS, INITIAL_AD_SLOTS } from './constants';
import { Navigation } from './Navigation';
import { ConnectView } from './ConnectView';
import { DashboardView } from './DashboardView';
import { SchedulerView } from './SchedulerView';
import { AnalyticsView } from './AnalyticsView';
import { MonetizationView } from './MonetizationView';
import { api } from './api';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<AppView>('connect');
  const [lang, setLang] = useState<Language>('en');
  const [channelName, setChannelName] = useState<string>('');
  const [stats, setStats] = useState<ChannelStats[]>(MOCK_STATS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [adSlots, setAdSlots] = useState<AdSlot[]>(INITIAL_AD_SLOTS);
  
  // Handlers
  const handleConnect = async (name: string) => {
    setChannelName(name);
    try {
        const fetchedStats = await api.getChannelStats(name);
        if (fetchedStats && fetchedStats.length > 0) {
            setStats(fetchedStats);
        }
    } catch (e) {
        console.log("Using mock stats initially");
    }
    setView('dashboard');
  };

  const handleAddPost = (post: Post) => {
    setPosts([...posts, post]);
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleAddAdSlot = (slot: AdSlot) => {
    setAdSlots([...adSlots, slot]);
  };

  // Get upcoming post for dashboard
  const upcomingPost = posts
    .filter(p => p.scheduledTime > new Date())
    .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())[0];

  // Render content based on view
  const renderContent = () => {
    switch (view) {
      case 'connect':
        return <ConnectView onConnect={handleConnect} lang={lang} setLang={setLang} />;
      case 'dashboard':
        return (
          <DashboardView 
            channelName={channelName} 
            stats={stats} 
            upcomingPost={upcomingPost}
            goToScheduler={() => setView('scheduler')}
            lang={lang}
            setLang={setLang}
          />
        );
      case 'scheduler':
        return (
          <SchedulerView 
            posts={posts} 
            onAddPost={handleAddPost}
            onDeletePost={handleDeletePost}
            lang={lang}
            setLang={setLang}
          />
        );
      case 'analytics':
        return <AnalyticsView stats={stats} lang={lang} setLang={setLang} />;
      case 'monetization':
        return <MonetizationView adSlots={adSlots} onAddSlot={handleAddAdSlot} lang={lang} setLang={setLang} />;
      default:
        return <div className="p-4">Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen font-sans max-w-md mx-auto relative overflow-x-hidden bg-tg-bg">
      {renderContent()}
      <Navigation currentView={view} setView={setView} lang={lang} />
    </div>
  );
};

export default App;
