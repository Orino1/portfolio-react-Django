import styles from "../assets/styles/layout/MainLayout.module.css";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import GlobalMsg from "../components/GlobalMsg";

function MainLayout({ children }) {
    return (
        <>
            <GlobalMsg/>
            <NavBar />
            <div className={styles.main}>{children}</div>
            <Footer />
        </>
    );
}

export default MainLayout;
