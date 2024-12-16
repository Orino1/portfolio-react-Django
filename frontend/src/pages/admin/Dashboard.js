import styles from "../../assets/styles/pages/Dashboard.module.css";
import { useAdminStatusContext } from "../../contexts/AdminStatusContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../apiService";
import Account from "./Account";
import Skills from "./Skills";
import Projects from "./Projects";

// this dashboard will be as following
// a place when it renders content

// and the content eill be either one of those pages
// and each inner page will be in a sub page layout ( wich is just a style ) okay
// and each click will make that actual page

function Dashboard() {
    const [content, setContent] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { adminStatus, loading, setAdminStatus, setLoading } = useAdminStatusContext();
    const navigate = useNavigate();
    const name = process.env.REACT_APP_NAME;

    useEffect(() => {
        if (!loading && !adminStatus) {
            navigate("/admin/login");
        }
    }, [adminStatus, loading, navigate]);

    const handleContentClick = (val) => {
        setContent(val);
        setSidebarOpen(false);
    };

    const handleLogout = async () => {
        const responseOk = logout();

        if (responseOk) {
            setAdminStatus(false);
            setLoading(false);
        }
    };

    // conte wich will be rener content
    const renderContent = () => {
        switch (content) {
            case "projects":
                return <Projects/>;
            case "account":
                return <Account/>;
            default:
                return <Skills/>;
        }
    };

    return (
        <div className={styles.main}>
            <div
                className={`${styles.sideBar} ${sidebarOpen && styles.opened}`}
            >
                <Link to="/" className={styles.logo}>
                    {name}
                </Link>
                <button
                    className={`${styles.elements} ${
                        content === "" ? styles.selected : ""
                    }`}
                    onClick={() => handleContentClick("")}
                >
                    Skills
                </button>
                <button
                    className={`${styles.elements} ${
                        content === "projects" ? styles.selected : ""
                    }`}
                    onClick={() => handleContentClick("projects")}
                >
                    Projects
                </button>
                <button
                    className={`${styles.elements} ${
                        content === "account" ? styles.selected : ""
                    }`}
                    onClick={() => handleContentClick("account")}
                >
                    Account
                </button>
                <button
                    className={styles.openBtn}
                    onClick={() => setSidebarOpen(true)}
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
                <button className={styles.logout} onClick={handleLogout}>logout</button>
            </div>
            <div className={styles.mainContent}>
                {renderContent()}
            </div>
        </div>
    );
}

export default Dashboard;
