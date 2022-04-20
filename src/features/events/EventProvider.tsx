import React from 'react';

type CallbackType = (...a: any[]) => any;
type ContextState = { [n: string]: CallbackType | undefined };

const EventContext = React.createContext<ContextState>({});

const EventProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const st = React.useRef({} as ContextState);

    return (
        <EventContext.Provider value={st.current}>
            {children}
        </EventContext.Provider>
    );
};

export default EventProvider;

/////////////////////////////////////

export const useSlot = (name: string, callback: CallbackType) => {
    const dict = React.useContext(EventContext);

    React.useEffect(() => {
        if (dict[name] !== undefined) {
            throw new Error(
                `useSlot(): ${name} already exists in given context`
            );
        }

        dict[name] = callback;

        return () => {
            dict[name] = undefined;
        };
    }, [name, callback, dict]);
};

export const useSignal = (name: string) => {
    const dict = React.useContext(EventContext);

    return React.useCallback(
        (...a: any[]) => {
            const callback = dict[name];

            if (callback !== undefined) {
                return callback(...a);
            }

            throw new Error(
                `useSignal.result(): ${name} not defined in given context`
            );
        },
        [dict, name]
    );
};
