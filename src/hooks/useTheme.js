import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../redux/themeSlice.js';

export default function useTheme() {
  const mode = useSelector((s) => s.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [mode]);

  return {
    mode,
    isDark: mode === 'dark',
    toggle: () => dispatch(toggleTheme()),
    set: (m) => dispatch(setTheme(m)),
  };
}
