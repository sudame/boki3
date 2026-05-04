import { useState } from 'react';
import { Header } from './components/Header';
import { LessonList } from './components/Input/LessonList';
import { ProblemList } from './components/Output/ProblemList';
import styles from './App.module.css';

type Tab = 'dashboard' | 'input' | 'output';

export const App = () => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={styles.shell}>
      <Header onOpenSettings={() => setShowSettings(true)} />
      <nav className={styles.tabs}>
        {(['dashboard', 'input', 'output'] as const).map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'dashboard' ? 'ダッシュボード' : t === 'input' ? 'インプット' : 'アウトプット'}
          </button>
        ))}
      </nav>
      <main className={styles.main}>
        {tab === 'dashboard' && <div>Dashboard placeholder</div>}
        {tab === 'input' && <LessonList />}
        {tab === 'output' && <ProblemList />}
      </main>
      {showSettings && <div onClick={() => setShowSettings(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>(settings placeholder — click to close)</div>}
    </div>
  );
};
