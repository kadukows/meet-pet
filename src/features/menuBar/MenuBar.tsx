import React from 'react';
import Button from '@mui/material/Button';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { resetAuth } from '../auth/userSlice';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { addAlert } from '../alerts/alertsSlice';
type Props = {
    text?: string;
};

const MenuBar = (props: Props) => {
    const fullName = useSelector(
        (state: RootState) => state.authReducer.user?.full_name
    );

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
                {fullName}
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
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={logoutCallback}>Logout</MenuItem>
            </Menu>
        </React.Fragment>
    );
};

export default MenuBar;
