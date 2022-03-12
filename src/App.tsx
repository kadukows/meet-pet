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

function App() {
    return (
        <ReduxProvider store={store}>
            <DarkThemeProvider>
                <CssBaseline enableColorScheme />
                <SnackbarProvider>
                    <NotifierComponent />

                    <Router>
                        {/*
                            <ul>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/counter">Counter</Link>
                                </li>
                                <li>
                                    <DarkThemeToggler />
                                </li>
                            </ul>
                            <hr />
                            */}
                        <Box
                            sx={{
                                display: 'inline-flex',
                                width: '100%',
                                flexDirection: 'column',
                                p: 0,
                                m: 0,
                            }}
                        >
                            <MyAppBar />
                            <Container maxWidth="sm">
                                <Routes>
                                    <Route path="/" element={'Home page!'} />
                                    <Route
                                        path="/counter"
                                        element={<Counter />}
                                    />
                                </Routes>
                            </Container>
                        </Box>
                    </Router>
                </SnackbarProvider>
            </DarkThemeProvider>
        </ReduxProvider>
    );
}

export default App;
