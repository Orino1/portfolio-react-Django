import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollTop from "./components/ScrollTop";
import GlobalMsgProvider from "./contexts/GlobalMsgContext";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";

function App() {
    return (
        <GlobalMsgProvider>
            <Router>
                <ScrollTop />
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
                </Routes>
            </Router>
        </GlobalMsgProvider>
    );
}

export default App;
