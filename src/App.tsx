import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from './store';
import Counter from './features/counter/Counter';

function App() {
    return (
        <ReduxProvider store={store}>
            <div className="App">
                <Router>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/counter">Counter</Link>
                        </li>
                    </ul>
                    <hr />
                    <Routes>
                        <Route path="/" element={'Home page!'} />
                        <Route path="/counter" element={<Counter />} />
                    </Routes>
                </Router>
            </div>
        </ReduxProvider>
    );
}

export default App;
