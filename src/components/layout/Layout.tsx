import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-8">
        <Outlet />
      </main>
    </div>
  );
}
