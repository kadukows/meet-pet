import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ImageList from '@mui/material/ImageList';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/system';
import QueryForm from './QueryForm';
import { AnimalQueryParams } from '../apiConnection/IRequestMaker';
import { getRequestMaker } from '../apiConnection/RequestMakerFactory';
import { Animal } from '../animal/animalSlice';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import AnimalImageListItem from './AnimalImageListItem';
import { store } from '../../store';
import { addAlert } from '../alerts/alertsSlice';

type Props = {};

const Search = (props: Props) => {
    const [animals, setAnimals] = React.useState<Animal[]>([]);
    const [lastQuery, setLastQuery] = React.useState<AnimalQueryParams>({});
    const [count, setCount] = React.useState(0);
    const [itemsPerPage, setItemsPerPage] = React.useState(25);
    const [page, setPage] = React.useState(0);
    const token = useSelector((state: RootState) => state.authReducer.token);

    const fetchAnimals = React.useCallback(
        async (
            a: AnimalQueryParams,
            limit: number | null = null,
            offset: number | null = null
        ) => {
            a.limit = limit ?? itemsPerPage;
            a.offset = offset ?? itemsPerPage * page;

            const res = await getRequestMaker().getAnimalList(
                token as string,
                a
            );

            if (res !== null) {
                setAnimals(res.results);
                setCount(res.count);
            } else {
                store.dispatch(
                    addAlert({
                        type: 'error',
                        message: 'Something went wrong when fetching animals',
                    })
                );
            }
        },
        [token, setAnimals, setCount]
    );

    const fetchOnLoad = React.useRef(false);
    React.useEffect(() => {
        if (!fetchOnLoad.current) {
            fetchAnimals({});
            fetchOnLoad.current = true;
        }
    }, [fetchAnimals]);

    const onQuerySubmit = React.useCallback(
        (a: AnimalQueryParams) => {
            fetchAnimals(a);
            setLastQuery(a);
        },
        [fetchAnimals, setLastQuery]
    );

    const onPageChange = React.useCallback(
        (event: React.ChangeEvent<unknown>, value: number) => {
            setPage(value - 1);
            fetchAnimals(lastQuery, null, (value - 1) * itemsPerPage);
        },
        [setPage, lastQuery, itemsPerPage]
    );

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ width: '30%', alignSelf: 'flexStart' }}>
                <Paper
                    sx={{
                        minHeight: '40vh',
                        maxHeight: '85vh',
                        position: 'sticky',
                        top: 70,
                        alignSelf: 'flexStart',
                        p: 3,
                        overflow: 'auto',
                    }}
                >
                    <QueryForm onQuerySubmit={onQuerySubmit} />
                </Paper>
            </Box>
            <Box sx={{ width: '70%', ml: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Pagination
                        count={Math.ceil(count / itemsPerPage)}
                        page={page + 1}
                        onChange={onPageChange}
                    />
                </Box>
                <ImageList cols={2} variant="masonry" gap={8}>
                    {animals.map((a) => (
                        <AnimalImageListItem key={a.id} animal={a} />
                    ))}
                </ImageList>
            </Box>
        </Container>
    );
};

export default Search;

////////////////////////

const Container = styled(Box)`
    display: flex;
`;

//const InnerContainer = styled(Box)

/*
const SearchBox = () => {
    const WIDTH = 320;



    return <Box sx={{ width: WIDTH, height: '60vh' }}>

    </>
};
*/
