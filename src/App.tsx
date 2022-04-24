import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { store } from './store';
import NotifierComponent from './features/alerts/NotifierComponent';
import DarkThemeProvider from './features/darkThemeProvider/DarkThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import MyAppBar from './features/appBar/MyAppBar';
import Container from '@mui/material/Container';
import GetUserAtInit from './features/auth/User';
import TinderChoose from './features/tinderChoose';
import HomePage from './features/homePage';
import RedirectIfNotLoggedIn from './features/auth/RedirectIfNotLoggedIn';
import Search from './features/search/Search';
import SheltersAnimal from './features/shelter/animals/SheltersAnimal';
import AnimalRetrieve from './features/animalRetrieve/AnimalRetrieve';

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
                                <Route
                                    path="/meet"
                                    element={
                                        <RedirectIfNotLoggedIn>
                                            <TinderChoose />
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
                                <Route
                                    path="/animal/:animalId"
                                    element={
                                        <RedirectIfNotLoggedIn>
                                            <AnimalRetrieve />
                                        </RedirectIfNotLoggedIn>
                                    }
                                />
                                <Route
                                    path="/shelters_animal"
                                    element={
                                        <RedirectIfNotLoggedIn>
                                            <SheltersAnimal />
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
