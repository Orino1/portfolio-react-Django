import styles from "../assets/styles/layout/MainLayout.module.css";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

function MainLayout({ children }) {
    return (
        <>
            <NavBar />
            <div className={styles.main}>{children}</div>
            <Footer />
        </>
    );
}

export default MainLayout;
