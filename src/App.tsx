import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginPage from '@/pages/LoginPage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TodayPage from '@/pages/TodayPage';
import CalendarPage from '@/pages/CalendarPage';
import AllTasksPage from '@/pages/AllTasksPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import CategoriesPage from '@/pages/CategoriesPage';
import FocusTimerPage from '@/pages/FocusTimerPage';
import SettingsPage from '@/pages/SettingsPage';

type Page = 'today' | 'calendar' | 'all-tasks' | 'analytics' | 'categories' | 'focus-timer' | 'settings';

export default function App() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>('today');
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [darkMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <p className="text-[#8c7a5e] text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const dm = darkMode;
  const bgMain = dm ? 'bg-[#1a1510]' : 'bg-[#f5f0e8]';
  const pendingCount = 0;

  const shiftDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d);
  };

  return (
    <div className={`flex h-screen ${bgMain} overflow-hidden`}>
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        darkMode={dm}
        onToggleDarkMode={() => setDarkMode(!dm)}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          date={date}
          onPrev={() => shiftDate(-1)}
          onNext={() => shiftDate(1)}
          search={search}
          onSearch={setSearch}
          notifications={pendingCount}
          user={user}
          darkMode={dm}
        />

        <main className="flex-1 overflow-y-auto">
          {page === 'today' && <TodayPage date={date} search={search} darkMode={dm} />}
          {page === 'calendar' && <CalendarPage darkMode={dm} />}
          {page === 'all-tasks' && <AllTasksPage darkMode={dm} />}
          {page === 'analytics' && <AnalyticsPage darkMode={dm} />}
          {page === 'categories' && <CategoriesPage darkMode={dm} />}
          {page === 'focus-timer' && <FocusTimerPage darkMode={dm} />}
          {page === 'settings' && <SettingsPage user={user} darkMode={dm} onToggleDarkMode={() => setDarkMode(!dm)} />}
        </main>
      </div>
    </div>
  );
}
