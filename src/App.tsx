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
import Preferences from './features/preferences/Preferences';
import Search from './features/search/Search';
import SheltersAnimal from './features/shelter/animals/SheltersAnimal';
import AnimalRetrieve from './features/animalRetrieve/AnimalRetrieve';
import LikedAnimals from './features/likedAnimals/LikedAnimals';
import Pretendents from './features/shelter/animals/pretendents';
import { UserType } from './features/auth/userSlice';

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
                                {/* User routes */}
                                <Route
                                    path="/meet"
                                    element={
                                        <RedirectIfNotLoggedIn
                                            type={UserType.Normal}
                                        >
                                            <TinderChoose />
                                        </RedirectIfNotLoggedIn>
                                    }
                                />
                                <Route
                                    path="/preferences"
                                    element={
                                        <RedirectIfNotLoggedIn
                                            type={UserType.Normal}
                                        >
                                            <Preferences />
                                        </RedirectIfNotLoggedIn>
                                    }
                                />
                                <Route
                                    path="/search"
                                    element={
                                        <RedirectIfNotLoggedIn
                                            type={UserType.Normal}
                                        >
                                            <Search />
                                        </RedirectIfNotLoggedIn>
                                    }
                                />
                                <Route
                                    path="/animal/:animalId"
                                    element={
                                        <RedirectIfNotLoggedIn
                                            type={UserType.Normal}
                                        >
                                            <AnimalRetrieve />
                                        </RedirectIfNotLoggedIn>
                                    }
                                />
                                <Route
                                    path="/liked_animals"
                                    element={
                                        <RedirectIfNotLoggedIn
                                            type={UserType.Normal}
                                        >
                                            <LikedAnimals />
                                        </RedirectIfNotLoggedIn>
                                    }
                                />
                                {/* Shelter routes */}
                                <Route
                                    path="/shelter/manage_animals"
                                    element={
                                        <RedirectIfNotLoggedIn
                                            type={UserType.Shelter}
                                        >
                                            <SheltersAnimal />
                                        </RedirectIfNotLoggedIn>
                                    }
                                />
                                <Route
                                    path="/shelter/pretendents/:animal_id"
                                    element={
                                        <RedirectIfNotLoggedIn
                                            type={UserType.Shelter}
                                        >
                                            <Pretendents />
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
