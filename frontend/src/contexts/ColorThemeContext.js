import { useState, createContext, useContext } from "react";

const ColorContext = createContext(null);

export const useColorContext = () => useContext(ColorContext);

function ColorThemeContextProvider({ children }) {
    const [color, setColor] = useState("start");

    return (
        <ColorContext.Provider value={{ color, setColor }}>
            {children}
        </ColorContext.Provider>
    );
}

export default ColorThemeContextProvider;
