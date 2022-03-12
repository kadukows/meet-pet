import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import DarkThemeToggler from '../darkThemeProvider/DarkThemeToggler';
import { Location, useLocation } from 'react-router';
import MyDrawer from './MyDrawer';

type Props = {};

const MyAppBar = (props: Props) => {
    const location = useLocation();

    return (
        <Box sx={{ flexGrow: 1 }}>
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
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default MyAppBar;

const REGEX_MAPPING = {
    Counter: /^\/counter$/,
    Home: /^\/$/,
};

const translateLocationPathname = (location: Location) => {
    for (const [k, v] of Object.entries(REGEX_MAPPING)) {
        if (location.pathname.match(v)) {
            return k;
        }
    }

    return 'translateNotFound ;<';
};
