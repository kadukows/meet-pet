import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ImageList from '@mui/material/ImageList';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import ButtonGroup from '@mui/material/ButtonGroup';
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
import { useUser } from '../useUser';
import SearchSvgDefinitions from './SearchSvgDefinitions';

type Props = {};

const Search = (props: Props) => {
    const [animals, setAnimals] = React.useState<Animal[]>([]);
    const [lastQuery, setLastQuery] = React.useState<AnimalQueryParams>({});
    const [count, setCount] = React.useState(0);
    const [itemsPerPage, setItemsPerPage] = React.useState(25);
    const [page, setPage] = React.useState(0);
    const [pageDisabled, setPageDisabled] = React.useState(false);
    const token = useSelector((state: RootState) => state.authReducer.token);
    const user = useUser();

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
        [token, setAnimals, setCount, itemsPerPage, page]
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
        async (event: React.ChangeEvent<unknown>, value: number) => {
            setPageDisabled(true);
            setPage(value - 1);
            await fetchAnimals(lastQuery, null, (value - 1) * itemsPerPage);
            setPageDisabled(false);
        },
        [setPage, lastQuery, itemsPerPage, fetchAnimals, setPageDisabled]
    );

    const onPageSizeChange = React.useCallback(
        async (event: React.MouseEvent<unknown>) => {
            setPageDisabled(true);
            const newItemsPerPage = parseInt(
                (event.target as any).dataset.value
            );
            setItemsPerPage(newItemsPerPage);
            await fetchAnimals(lastQuery, newItemsPerPage);
            setPageDisabled(false);
        },
        [setPageDisabled, setItemsPerPage, fetchAnimals, lastQuery]
    );

    return (
        <Container sx={{ mt: 4 }}>
            <SearchSvgDefinitions />
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
                <PaginationRow
                    count={Math.ceil(count / itemsPerPage)}
                    page={page + 1}
                    onPageChange={onPageChange}
                    pageDisabled={pageDisabled}
                    pageSize={itemsPerPage}
                    onPageSizeChange={onPageSizeChange}
                />
                <ImageList cols={2} variant="masonry" gap={8}>
                    {animals.map((a) => (
                        <AnimalImageListItem
                            key={a.id}
                            animal={a}
                            liked={user.getLikedAnimals().has(a.id)}
                        />
                    ))}
                    {animals.length === 0 &&
                        [...Array(10).keys()].map((k) => (
                            <Skeleton
                                key={k}
                                sx={{
                                    height: `${
                                        192 + ((88 * (k + 4) + 217) % 48) - 24
                                    }px`,
                                    m: 3,
                                }}
                                variant="rectangular"
                            />
                        ))}
                </ImageList>
                <PaginationRow
                    count={Math.ceil(count / itemsPerPage)}
                    page={page + 1}
                    onPageChange={onPageChange}
                    pageDisabled={pageDisabled}
                    pageSize={itemsPerPage}
                    onPageSizeChange={onPageSizeChange}
                />
            </Box>
        </Container>
    );
};

export default Search;

////////////////////////

const Container = styled(Box)`
    display: flex;
`;

interface PaginationRowProps {
    count: number;
    page: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
    onPageSizeChange: (event: React.MouseEvent<unknown>) => void;
    pageSize: number;
    pageDisabled: boolean;
}

const PaginationRow = ({
    count,
    page,
    onPageChange,
    pageDisabled,
    pageSize,
    onPageSizeChange,
}: PaginationRowProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <div />
            <Pagination
                count={count}
                page={page}
                onChange={onPageChange}
                disabled={pageDisabled}
            />
            <ButtonGroup variant="text">
                {ALLOWED_LIMITS.map((l) => (
                    <Button
                        key={l}
                        data-value={l}
                        disabled={pageSize === l}
                        onClick={onPageSizeChange}
                    >
                        {l}
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    );
};

const ALLOWED_LIMITS = [10, 25, 50];
