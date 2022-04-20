import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { store } from './store';
import Counter from './features/counter/Counter';
import NotifierComponent from './features/alerts/NotifierComponent';
import DarkThemeProvider from './features/darkThemeProvider/DarkThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import MyAppBar from './features/appBar/MyAppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import GetUserAtInit from './features/auth/User';
import TinderChoose from './features/tinderChoose';
import HomePage from './features/homePage';
import RedirectIfNotLoggedIn from './features/auth/RedirectIfNotLoggedIn';
import Preferences from './features/preferences/Preferences';
import Search from './features/search/Search';

/*
const Container = (p: any) => (
    <Box {...p} sx={{ ml: 8, mr: 8, width: '100%', ...p?.sx }} />
);
*/

function App() {
    return (
        <ReduxProvider store={store}>
            <GetUserAtInit />
            <DarkThemeProvider>
                <CssBaseline enableColorScheme />
                <SnackbarProvider>
                    <NotifierComponent />

                    <Router>
                        <MyAppBar />
                        <Container maxWidth="lg">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/counter" element={<Counter />} />
                                <Route
                                    path="/meet"
                                    element={
                                        <RedirectIfNotLoggedIn>
                                            <TinderChoose />
                                        </RedirectIfNotLoggedIn>
                                    }
                                />
                                <Route
                                    path="/preferences"
                                    element={
                                        <RedirectIfNotLoggedIn>
                                            <Preferences />
                                        </RedirectIfNotLoggedIn>
                                    }
                                />
                                <Route
                                    path="/search"
                                    element={
                                        <RedirectIfNotLoggedIn>
                                            <Search />
                                        </RedirectIfNotLoggedIn>
                                    }
                                />
                            </Routes>
                        </Container>
                    </Router>
                </SnackbarProvider>
            </DarkThemeProvider>
        </ReduxProvider>
    );
}

export default App;
