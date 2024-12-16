import styles from "../assets/styles/layout/AdminSubPageLayout.module.css";

function AdminSubPageLayout({ children, handleBack }) {
    return (
        <div className={styles.main}>
            <div onClick={handleBack} className={styles.return}>
                <i class="fa-solid fa-arrow-left"></i>
            </div>
            {children}
        </div>
    );
}

export default AdminSubPageLayout;
