import React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import DarkThemeToggler from '../darkThemeProvider/DarkThemeToggler';
import { Location, useLocation } from 'react-router';
import MyDrawer from './MyDrawer';
import Login from './Login';
import MenuBar from './MenuBar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type Props = {};

const MyAppBar = (props: Props) => {
    const location = useLocation();
    const authed = useSelector(
        (state: RootState) =>
            state.authReducer.token != null && !state.authReducer.loading
    );

    return (
        <React.Fragment>
            <AppBar position="sticky">
                <Toolbar>
                    <MyDrawer />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        {translateLocationPathname(location)}
                    </Typography>
                    <DarkThemeToggler />
                    {authed ? <MenuBar /> : <Login />}
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
};

export default MyAppBar;

const REGEX_MAPPING = {
    Counter: /^\/counter$/,
    Preferences: /^\/preferences$/,
    Search: /^\/search$/,
    Home: /^\/$/,
    'Meet the pet!': /^\/meet$/,
    'Manage animals': /^\/shelter\/manage_animals$/,
    Details: /^\/animal\/[0-9]+$/,
    'Liked animals': /^\/liked_animals$/,
};

const translateLocationPathname = (location: Location) => {
    for (const [k, v] of Object.entries(REGEX_MAPPING)) {
        if (location.pathname.match(v)) {
            return k;
        }
    }

    return 'translateNotFound ;<';
};
