import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Collapse, { CollapseProps } from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import List from '@mui/material/List';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { TransitionGroup } from 'react-transition-group';

import { Animal } from '../../../animal/animalSlice';
import { Img } from '../../../search/AnimalImageListItem';
import { store } from '../../../../store';
import { getRequestMaker } from '../../../apiConnection/RequestMakerFactory';
import styles from './ImageEdit.module.css';
import { addAlert } from '../../../alerts/alertsSlice';
import { shelterAnimalActions } from '../animalSlice';
import { MarginedForm } from './utils';

interface ImageEditProps {
    animal: Animal;
}

const ImageEdit = ({ animal }: ImageEditProps) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
            }}
        >
            <Typography variant="h3" component="h3">
                Photos:
            </Typography>
            <List
                sx={{
                    display: 'grid',
                    gridTemplateColumns: isSmall ? '1fr' : 'repeat(2, 1fr)',
                    gridAutoRows: '192px',
                    width: isSmall ? 'min(90%, 192px)' : '100%',
                    gap: 1,
                    alignSelf: 'center',
                }}
            >
                <TransitionGroup component={null}>
                    {animal.photos.map((p) => (
                        <MyImageListItem key={p.id} photo={p} animal={animal} />
                    ))}
                </TransitionGroup>
            </List>
            <Box sx={{ flex: 1 }} />
            <Box>
                <NewImageForm animal={animal} />
            </Box>
        </Box>
    );
};

export default ImageEdit;

////////////////////////////////

interface NewImageFormProps {
    animal: Animal;
}

const NewImageForm = ({ animal }: NewImageFormProps) => {
    const imageInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<unknown>) => {
            e.preventDefault();
            const formData = new FormData(e.target as any);
            formData.append('animal', animal.id.toString());

            const photo = await getRequestMaker().shelter.uploadPhoto(
                store.getState().authReducer.token as string,
                formData
            );

            if (photo === null) {
                store.dispatch(
                    addAlert({
                        type: 'error',
                        message: 'Problems with uploading a new file',
                    })
                );

                return false;
            }

            if (photo?.animal !== animal.id) {
                throw new Error("'photo?.animal !== animal.id', WTF !?");
            }

            store.dispatch(
                shelterAnimalActions.updateOne({
                    id: animal.id,
                    changes: {
                        photos: [
                            ...animal.photos,
                            { id: photo.id, url: photo.url },
                        ],
                    },
                })
            );

            store.dispatch(
                addAlert({
                    type: 'success',
                    message: 'Uploaded a file!',
                })
            );

            (imageInputRef.current as any).files = new DataTransfer().files;

            return false;
        },
        [animal]
    );

    return (
        <MarginedForm onSubmit={handleSubmit}>
            <FormControl>
                <Box sx={{ display: 'flex' }}>
                    <FormLabel sx={{ mr: 2 }}>Add photos:</FormLabel>
                    <input
                        id="image"
                        type="file"
                        name="file"
                        accept="image/png, image/jpeg"
                        required
                        ref={imageInputRef}
                    />
                </Box>
            </FormControl>

            <button type="submit">Submit</button>
        </MarginedForm>
    );
};

interface MyImageListItemProps extends CollapseProps {
    photo: {
        id: number;
        url: string;
    };
    animal: Animal;
}

const MyImageListItem = ({ photo, animal, ...rest }: MyImageListItemProps) => {
    const slideContainerRef = React.useRef<Element | null>(null);
    const [selected, setSelected] = React.useState(false);

    const handleDelete = React.useCallback(async () => {
        const res = await getRequestMaker().shelter.deletePhoto(
            store.getState().authReducer.token as string,
            photo.id
        );

        if (res === null) {
            store.dispatch(
                addAlert({
                    type: 'error',
                    message: 'something went wrong with deleting the photo',
                })
            );

            return;
        }

        store.dispatch(
            shelterAnimalActions.updateOne({
                id: animal.id,
                changes: {
                    photos: animal.photos.filter((p) => p.id !== photo.id),
                },
            })
        );

        store.dispatch(
            addAlert({
                type: null,
                message: 'Photo sucessfully deleted',
            })
        );

        setSelected(false);
    }, [photo.id, animal, setSelected]);

    return (
        <MyCollapse {...rest} sx={{ width: '100%', height: '100%' }}>
            <ImageListItem
                sx={{
                    width: '100%',
                    height: '100%',
                }}
                style={{ height: '100%' }}
            >
                <Img
                    src={photo.url}
                    alt="An image"
                    loading="lazy"
                    className={selected ? styles.redSelectedImage : ''}
                />
                <ImageListItemBar
                    ref={slideContainerRef}
                    sx={{
                        overflow: 'hidden',
                    }}
                    actionIcon={
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                height: '100%',
                            }}
                        >
                            <Slide
                                direction="right"
                                in={selected}
                                container={(e: any) =>
                                    slideContainerRef.current as Element
                                }
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        display: 'flex',
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        // @ts-ignore: Custom color
                                        color="neutral"
                                        sx={{
                                            fontSize: 12,
                                            m: 1,
                                            flex: 1,
                                            whiteSpace: 'nowrap',
                                        }}
                                        size="small"
                                        onClick={() => setSelected(!selected)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{
                                            fontSize: 12,
                                            m: 1,
                                            flex: 1,
                                            whiteSpace: 'nowrap',
                                        }}
                                        size="small"
                                        onClick={handleDelete}
                                    >
                                        Yes, I'm sure
                                    </Button>
                                </Box>
                            </Slide>
                            <Slide
                                direction="left"
                                in={!selected}
                                container={(e: any) =>
                                    slideContainerRef.current as Element
                                }
                            >
                                <IconButton
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.54)',
                                    }}
                                    onClick={() => setSelected(!selected)}
                                    data-photoid={photo.id}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Slide>
                        </Box>
                    }
                />
            </ImageListItem>
        </MyCollapse>
    );
};

const MyCollapse = styled(Collapse)`
    .MuiCollapse-wrapper {
        height: 100%;
    }

    .MuiCollapse-wrapperInner {
        height: 100%;
    }
`;
