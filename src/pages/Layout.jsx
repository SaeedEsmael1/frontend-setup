import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
export const Layout = () => {
  const [isDark, setIsDark] = useState(() =>
    localStorage.getItem('theme' === 'dark'),
  );

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <div>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <Outlet />
    </div>
  );
};
