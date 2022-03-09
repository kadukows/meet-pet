import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { addOne, addMany } from './counterSlice';
import { RootState } from '../../store';
import Button from '@mui/material/Button';

type Props = {
    text?: string;
};

const Counter = (props: Props) => {
    const t = props.text ? props.text : 'Counter';

    const count = useSelector((state: RootState) => state.countReducer.count);
    const dispatch = useDispatch();
    const callback = React.useCallback(() => dispatch(addOne()), [dispatch]);
    const callback2 = React.useCallback(() => dispatch(addMany(5)), [dispatch]);

    return (
        <div>
            {t}: {count}
            <Button
                onClick={callback}
                color="secondary"
                sx={{ m: 2 }}
                variant="contained"
            >
                Click me
            </Button>
            <br />
            {t + '2'}: {count}
            <button onClick={callback2}>Click me2</button>
        </div>
    );
};

export default Counter;
