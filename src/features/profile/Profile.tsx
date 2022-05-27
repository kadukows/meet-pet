import React from 'react';

import Box, { BoxProps } from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { styled, css } from '@mui/material/styles';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonalInfo from './PersonalInfo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserType } from '../auth/userSlice';

enum Page {
    Account = 'Account',
    Personal = 'Personal info',
}

type Props = {};

const Profile = (props: Props) => {
    const [page, setPage] = React.useState<Page>(Page.Account);
    const user_type = useSelector(
        (state: RootState) => state.authReducer.user?.user_type
    );

    return (
        <Box sx={{ display: 'flex', width: '100%', height: '85vh', mt: 2 }}>
            <Box>
                <List>
                    {getPagesForUserType(user_type as UserType).map((p) => (
                        <ListItem disablePadding key={p} sx={{ mb: 0.5 }}>
                            <PageButton
                                active={page === p}
                                onClick={() => setPage(p)}
                            >
                                <ListItemText primary={p} />
                            </PageButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Divider
                sx={{ height: '100%', ml: 2, mr: 2 }}
                orientation="vertical"
            />
            <Box sx={{ flex: 1 }}>
                <ProfileSwitch page={page} />
            </Box>
        </Box>
    );
};

export default Profile;

type ActiveBoxProps = BoxProps & {
    active: boolean;
};

const ActiveBox = styled(({ active, ...rest }: ActiveBoxProps) => (
    <Box {...rest} />
))(
    ({ theme, active }) => css`
        ${active &&
        css`
            border-radius: 8px;
            background-color: ${theme.palette.mode === 'dark'
                ? 'rgba(128, 128, 128, 0.25)'
                : 'rgba(64, 64, 64, 0.05)'};
        `}
    `
);

type PageButtonProps = {
    active: boolean;
    onClick: () => void;
};

const PageButton = ({
    active,
    onClick,
    children,
}: React.PropsWithChildren<PageButtonProps>) => {
    return (
        <ActiveBox active={active}>
            <ListItemButton onClick={onClick}>{children}</ListItemButton>
        </ActiveBox>
    );
};

type ProfileSwitchProps = {
    page: Page;
};

const ProfileSwitch = ({ page }: ProfileSwitchProps) => {
    switch (page) {
        case Page.Account:
            return <div>Page</div>;
        case Page.Personal:
            return <PersonalInfo />;
    }

    return <div />;
};

const getPagesForUserType = (user_type: UserType): Page[] => {
    switch (user_type) {
        case UserType.Normal:
            return [Page.Account, Page.Personal];
        case UserType.Shelter:
            return [Page.Account];
    }

    return [];
};
