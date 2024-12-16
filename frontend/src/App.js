import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollTop from "./components/ScrollTop";
import GlobalMsgProvider from "./contexts/GlobalMsgContext";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/admin/Login";
import GlobalMsg from "./components/GlobalMsg";
import AdminStatusContextProvider from "./contexts/AdminStatusContext";
import Dashboard from "./pages/admin/Dashboard";

function App() {
    return (
        <Router>
            <ScrollTop />
            <AdminStatusContextProvider>
                <GlobalMsgProvider>
                    <GlobalMsg />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <MainLayout>
                                    <Home />
                                </MainLayout>
                            }
                        ></Route>
                        <Route
                            path="/contact"
                            element={
                                <MainLayout>
                                    <Contact />
                                </MainLayout>
                            }
                        ></Route>
                        <Route path="/admin" element={<Dashboard />}></Route>
                        <Route path="/admin/login" element={<Login />}></Route>
                    </Routes>
                </GlobalMsgProvider>
            </AdminStatusContextProvider>
        </Router>
    );
}

export default App;
