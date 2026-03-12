import { createContext, useContext } from 'react';
import { lightTheme, commonStyles } from '../styles/lightTheme';

const ThemeContext = createContext({ theme: lightTheme, styles: commonStyles });

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ theme: lightTheme, styles: commonStyles }}>
      {children}
    </ThemeContext.Provider>
  );
}
