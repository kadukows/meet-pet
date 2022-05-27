import React from 'react';
import Button from '@mui/material/Button';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { resetAuth, User } from '../auth/userSlice';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { addAlert } from '../alerts/alertsSlice';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { UserType } from '../auth/userSlice';
import { useNavigate } from 'react-router';
import { Avatar } from '@mui/material';
import { getUserAvatarUrl } from '../avatar/Avatar';

type Props = {
    text?: string;
};

const MenuBar = (props: Props) => {
    const user = useSelector((state: RootState) => state.authReducer.user);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const dispatch = useDispatch();
    const logoutCallback = React.useCallback(() => {
        dispatch(resetAuth());
        dispatch(
            addAlert({
                message: 'Logged out!',
                type: null,
            })
        );
    }, [dispatch]);

    const navigate = useNavigate();
    const profileCallback = React.useCallback(() => {
        navigate('/profile');
        handleClose();
    }, [navigate, handleClose]);

    return (
        <React.Fragment>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color="inherit"
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1,
                        height: '3rem',
                    }}
                >
                    <Avatar src={getUserAvatarUrl(user)} />
                    <p>{getFullName(user)}</p>
                    <Divider orientation="vertical" flexItem />
                    <p>{translateUserType(user?.user_type)}</p>
                </Box>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={profileCallback}>Profile</MenuItem>
                <MenuItem onClick={logoutCallback}>Logout</MenuItem>
            </Menu>
        </React.Fragment>
    );
};

export default MenuBar;

const translateUserType = (user_type: UserType | undefined) => {
    switch (user_type) {
        case UserType.Normal:
            return 'User';
        case UserType.Shelter:
            return 'Shelter';
        default:
            break;
    }

    return '';
};

export const getFullName = (user: User | null) =>
    user ? user.first_name.concat(' ', user.last_name) : '';
