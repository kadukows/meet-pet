import * as React from 'react';
import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import { RootState } from '../../store';

interface Props {}

const DarkThemeProvider = ({ children }: React.PropsWithChildren<Props>) => {
    const darkMode = useSelector(
        (state: RootState) => state.darkThemeProviderReducer.darkMode
    );

    const theme = React.useMemo(() => {
        const theme: ThemeOptions = {
            palette: {
                mode: darkMode ? 'dark' : 'light',
                neutral: {
                    main: '#64748B',
                    contrastText: '#fff',
                },
            },
        };

        return createTheme(theme);
    }, [darkMode]);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default DarkThemeProvider;

////////////////////////

declare module '@mui/material/styles' {
    interface Palette {
        neutral: Palette['primary'];
    }
    interface PaletteOptions {
        neutral: PaletteOptions['primary'];
    }
}
