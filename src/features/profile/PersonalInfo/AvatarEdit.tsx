import React from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button, { ButtonProps } from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import MuiAvatar from '@mui/material/Avatar';
import { styled, SxProps } from '@mui/material/styles';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

import { RootState, useAppDispatch } from '../../../store';
import { updateUserPreferences, User } from '../../auth/userSlice';
import Avatar, { getUserAvatarUrl } from '../../avatar/Avatar';
import { getRequestMaker } from '../../apiConnection';
import { addAlert } from '../../alerts/alertsSlice';
import { sleep } from '../../../helpers';
import AsyncButton from '../../shelter/animals/AnimalDialog/AsyncButton';

type Props = {};

const AvatarEdit = (props: Props) => {
    const user = useSelector(
        (state: RootState) => state.authReducer.user
    ) as User;
    const token = useSelector(
        (state: RootState) => state.authReducer.token
    ) as string;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
            }}
        >
            <Typography variant="h5" sx={{ alignSelf: 'flex-start' }}>
                Your avatar
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <Avatar
                    url={getUserAvatarUrl(user)}
                    sx={{ aspectRatio: '1', width: '70%' }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        //display: 'flex',
                        //width: '100%',
                        zIndex: 4,
                        right: 0,
                    }}
                >
                    <DeleteAvatarButton
                        buttonProps={{
                            disabled: !Boolean(user.user_prefs?.avatar),
                        }}
                    />
                </Box>
            </Box>

            <ChangeAvatarForm />
        </Box>
    );
};

export default AvatarEdit;

const INPUT_EVENT = new Event('input');

const ChangeAvatarForm = () => {
    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const [submitting, setSubmitting] = React.useState(false);

    const user = useSelector(
        (state: RootState) => state.authReducer.user
    ) as User;
    const token = useSelector(
        (state: RootState) => state.authReducer.token
    ) as string;

    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<unknown>) => {
            e.preventDefault();
            setSubmitting(true);

            const formData = new FormData(e.target as any);
            const photo = await getRequestMaker().uploadAvatar(token, formData);
            await sleep(3000);

            if (photo === null) {
                dispatch(
                    addAlert({
                        type: 'error',
                        message: 'Error occured when uploading an avatar',
                    })
                );

                setSubmitting(false);
                return false;
            }

            dispatch(
                addAlert({
                    type: 'success',
                    message: 'Sucessfully changed the avatar',
                })
            );

            dispatch(
                updateUserPreferences({
                    avatar: photo.url,
                })
            );

            (imageInputRef.current as any).files = new DataTransfer().files;
            (imageInputRef.current as HTMLElement).dispatchEvent(INPUT_EVENT);

            setSubmitting(false);
            return false;
        },
        [token, dispatch, setSubmitting]
    );

    return (
        <MyForm onSubmit={handleSubmit}>
            <FormLabel sx={{ mt: 1, mb: 2 }}>
                Upload a photo, so shelters can see you beforehand!
            </FormLabel>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FileInputWrapper
                    inputProps={{
                        type: 'file',
                        name: 'avatar',
                        accept: 'image/png, image/jpeg',
                        required: true,
                    }}
                    buttonProps={{
                        children: (
                            <Box sx={{ display: 'flex' }}>
                                <PhotoCameraIcon /> Choose photo
                            </Box>
                        ),
                        variant: 'contained',
                        disabled: submitting,
                    }}
                    ref={imageInputRef}
                />
                <AsyncButton
                    type="submit"
                    loading={submitting}
                    variant="contained"
                >
                    Submit
                </AsyncButton>
            </Box>
        </MyForm>
    );
};

const MyForm = styled('form')`
    display: flex;
    flex-direction: column;
`;

type FileInputWrapperProps = {
    inputProps?: React.ComponentProps<'input'>;
    buttonProps?: ButtonProps;
};

const FileInputWrapper = React.forwardRef(
    ({ inputProps, buttonProps }: FileInputWrapperProps, ref: any) => {
        const handleClick = React.useCallback(() => {
            // @ts-ignore
            ref.current.click();
        }, [ref]);

        const [currentFile, setCurrentFile] = React.useState<any>(undefined);

        const fileChanged = React.useCallback<EventListener>(
            (e: any) => {
                if (e.target.files.length > 0) {
                    const preview = URL.createObjectURL(e.target.files[0]);
                    setCurrentFile(preview);
                } else {
                    setCurrentFile(undefined);
                }
            },
            [setCurrentFile]
        );

        React.useEffect(() => {
            if (ref?.current) {
                const element = ref.current as unknown as HTMLElement;
                element.addEventListener('input', fileChanged);

                return () => element.removeEventListener('input', fileChanged);
            }
        }, [ref, fileChanged]);

        return (
            <Box sx={{ display: 'flex' }}>
                <HiddenInput ref={ref as any} {...inputProps} />
                <MuiAvatar
                    src={currentFile}
                    sx={{
                        visibility: currentFile ? 'visible' : 'hidden',
                        mr: 2,
                    }}
                />
                <Button {...buttonProps} onClick={handleClick} />
            </Box>
        );
    }
);

const HiddenInput = styled('input')`
    display: none;
`;

type DeleteAvatarButtonProps = {
    buttonProps?: IconButtonProps;
};

const DeleteAvatarButton = ({ buttonProps }: DeleteAvatarButtonProps) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = React.useCallback(() => setOpen(true), [setOpen]);
    const handleClose = React.useCallback(() => setOpen(false), [setOpen]);

    const token = useSelector(
        (state: RootState) => state.authReducer.token
    ) as string;
    const dispatch = useAppDispatch();

    const deleteAvatarCallback = React.useCallback(async () => {
        const res = await getRequestMaker().deleteAvatar(token);

        if (res === null) {
            dispatch(
                addAlert({
                    type: 'error',
                    message: 'Something went wrong when deleting avatar',
                })
            );

            return;
        }

        dispatch(
            addAlert({
                type: 'success',
                message: 'Avatar deleted',
            })
        );

        dispatch(
            updateUserPreferences({
                avatar: null,
            })
        );

        setOpen(false);
    }, [token, setOpen, dispatch]);

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete avatar?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure? Your avatar helps us to pair you with the
                        best animal!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <AsyncButton onClick={deleteAvatarCallback} color="error">
                        Delete
                    </AsyncButton>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Tooltip title="Delete">
                <DeleteIconButton onClick={handleOpen} {...buttonProps}>
                    <DeleteIcon />
                </DeleteIconButton>
            </Tooltip>
        </React.Fragment>
    );
};

const DeleteIconButton = styled(IconButton)`
    :hover {
        color: ${({ theme }) => theme.palette.error.main};
    }

    transition-duration: 200ms;
    transition-property: color;
`;
