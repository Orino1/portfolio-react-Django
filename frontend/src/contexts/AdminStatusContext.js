import { useState, useEffect, createContext, useContext } from "react";
import { status } from "../apiService";

const AdminContext = createContext(null);

export const useAdminStatusContext = () => useContext(AdminContext);

let adminStatusRef = null;

export default function AdminStatusContextProvider({ children }) {
    const [adminStatus, setAdminStatus] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            const responseOk = await status();

            if (responseOk) {
                setAdminStatus(true);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }

        checkStatus()
    }, []);

    return (
        <AdminContext.Provider value={{ adminStatus, setAdminStatus, loading, setLoading }}>
            {children}
        </AdminContext.Provider>
    );
}

export const setAdminStatus = (val) => {
    if (adminStatusRef) {
        adminStatusRef(val);
    }
}
