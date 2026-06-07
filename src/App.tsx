import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TopicPage from './pages/TopicPage';
import LibraryHub from './pages/LibraryHub';

export default function App() {
  const [activePage, setActivePage] = useState<'dashboard' | 'topic' | 'library'>('dashboard');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aetherml_completed_topics');
      if (saved) {
        setCompletedTopics(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load completed topics:', err);
    }
  }, []);

  const handleNavigate = (page: 'dashboard' | 'topic' | 'library', id?: string) => {
    setActivePage(page);
    if (page === 'topic' && id) {
      setActiveTopicId(id);
    } else {
      setActiveTopicId(null);
    }
  };

  const handleToggleComplete = (id: string) => {
    setCompletedTopics((prev) => {
      const isDone = prev.includes(id);
      const next = isDone ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('aetherml_completed_topics', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save completed topics:', err);
      }
      return next;
    });
  };

  return (
    <Layout
      activePage={activePage}
      activeTopicId={activeTopicId}
      completedTopics={completedTopics}
      onNavigate={handleNavigate}
    >
      {activePage === 'dashboard' && (
        <Dashboard
          completedTopics={completedTopics}
          onNavigate={handleNavigate}
        />
      )}
      {activePage === 'topic' && activeTopicId && (
        <TopicPage
          topicId={activeTopicId}
          completedTopics={completedTopics}
          onToggleComplete={handleToggleComplete}
          onNavigate={handleNavigate}
        />
      )}
      {activePage === 'library' && (
        <LibraryHub />
      )}
    </Layout>
  );
}
