import { useState, useEffect, createContext, useContext } from "react";

const GlobalMsgContext = createContext(null);

let setMsgRefrence = null;

export function useGlobalMsgContext() {
    return useContext(GlobalMsgContext);
}

export function GlobalMsgProvider({ children }) {
    const [msg, setMsg] = useState(null);

    setMsgRefrence = setMsg;

    useEffect(() => {
        if (msg) {
            const timeout = setTimeout(() => {
                setMsg(null);
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [msg]);

    return (
        <GlobalMsgContext.Provider value={{ msg, setMsg }}>
            {children}
        </GlobalMsgContext.Provider>
    );
}

export default GlobalMsgProvider;

export function setMsg(msg) {
    if (setMsgRefrence) {
        setMsgRefrence(msg);
    }
}
