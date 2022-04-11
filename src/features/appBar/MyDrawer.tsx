import React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { NavLink } from 'react-router-dom';

type Props = {};

const MyDrawer = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const openDrawer = React.useCallback(() => setOpen(true), [setOpen]);
    const closeDrawer = React.useCallback(() => setOpen(false), [setOpen]);

    return (
        <React.Fragment>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={openDrawer}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={open}
                onClose={closeDrawer}
                //onOpen={openDrawer}
            >
                <Box
                    sx={{
                        width: 250,
                    }}
                    role="presentation"
                >
                    <List>
                        <ListItemButton
                            component={NavLink}
                            onClick={closeDrawer}
                            to="/"
                        >
                            Home
                        </ListItemButton>
                        <ListItemButton
                            component={NavLink}
                            onClick={closeDrawer}
                            to="/counter"
                        >
                            Counter
                        </ListItemButton>
                        <ListItemButton
                            component={NavLink}
                            onClick={closeDrawer}
                            to="/preferences"
                        >
                            Preferences
                        </ListItemButton>
                        <ListItemButton
                            component={NavLink}
                            onClick={closeDrawer}
                            to="/meet"
                        >
                            Meet!
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
        </React.Fragment>
    );
};

export default MyDrawer;
