import { useState } from 'react';
import { Header } from './components/Header';
import { LessonList } from './components/Input/LessonList';
import { ProblemList } from './components/Output/ProblemList';
import { Dashboard } from './components/Dashboard/Dashboard';
import { MockTab } from './components/Mock/MockTab';
import { Settings } from './components/Settings';
import styles from './App.module.css';

type Tab = 'dashboard' | 'input' | 'output' | 'mock';

const TAB_LABELS: Record<Tab, string> = {
  dashboard: 'ダッシュボード',
  input: 'インプット',
  output: 'アウトプット',
  mock: '模試',
};

export const App = () => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={styles.shell}>
      <Header onOpenSettings={() => setShowSettings(true)} />
      <nav className={styles.tabs}>
        {(['dashboard', 'input', 'output', 'mock'] as const).map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </nav>
      <main className={styles.main}>
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'input' && <LessonList />}
        {tab === 'output' && <ProblemList />}
        {tab === 'mock' && <MockTab />}
      </main>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
};
