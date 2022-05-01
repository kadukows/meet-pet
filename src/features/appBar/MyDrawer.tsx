import React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { NavLink } from 'react-router-dom';
import { UserType } from '../auth/userSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type Props = {};

const MyDrawer = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const openDrawer = React.useCallback(() => setOpen(true), [setOpen]);
    const closeDrawer = React.useCallback(() => setOpen(false), [setOpen]);
    const userType = useSelector(
        (state: RootState) => state.authReducer.user?.user_type
    );

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
            <Drawer anchor="left" open={open} onClose={closeDrawer}>
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
                        <UserLinks
                            userType={userType}
                            closeDrawer={closeDrawer}
                        />
                    </List>
                </Box>
            </Drawer>
        </React.Fragment>
    );
};

export default MyDrawer;

interface LinksProps {
    closeDrawer: () => void;
}

const NormalUserLinks = ({ closeDrawer }: LinksProps) => (
    <React.Fragment>
        <ListItemButton component={NavLink} onClick={closeDrawer} to="/meet">
            Meet!
        </ListItemButton>
        <ListItemButton component={NavLink} onClick={closeDrawer} to="/search">
            Search
        </ListItemButton>
        <ListItemButton
            component={NavLink}
            onClick={closeDrawer}
            to="/liked_animals"
        >
            Liked animals
        </ListItemButton>
        <ListItemButton
            component={NavLink}
            onClick={closeDrawer}
            to="/preferences"
        >
            Preferences
        </ListItemButton>
    </React.Fragment>
);

const ShelterUserLinks = ({ closeDrawer }: LinksProps) => (
    <React.Fragment>
        <ListItemButton
            component={NavLink}
            onClick={closeDrawer}
            to="/shelter/manage_animals"
        >
            Manage animals
        </ListItemButton>
    </React.Fragment>
);

interface UserLinksProps extends LinksProps {
    userType?: UserType;
}

const UserLinks = ({ userType, ...rest }: UserLinksProps) => {
    switch (userType) {
        case UserType.Normal:
            return <NormalUserLinks {...rest} />;
        case UserType.Shelter:
            return <ShelterUserLinks {...rest} />;
    }

    return <React.Fragment />;
};
