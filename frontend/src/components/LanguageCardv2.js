import styles from "../assets/styles/components/LanguageCardv2.module.css";
import { deleteLanguage } from "../apiService";

function LanguageCardv2({ language, setLanguages, setUpdateLanguage }) {
    const hadnleDeletion = async () => {
        const success = await deleteLanguage(language.id);

        success &&
            setLanguages((prev) =>
                prev.filter((lang) => lang.id !== language.id)
            );
    };

    return (
        <div className={styles.container}>
            <i onClick={hadnleDeletion} className="fa-solid fa-trash"></i>
            <i
                onClick={() => setUpdateLanguage(language)}
                className="fa-regular fa-pen-to-square"
            ></i>
            <h2>
                <i class="fa-solid fa-code"></i> {language.name}
            </h2>
            <hr></hr>
            <div className={styles.subContainer}>
                <h3>Frameworks:</h3>
                <div className={styles.elements}>
                    {language.frameworks.length === 0 ? (
                        <span>N/A</span>
                    ) : (
                        language.frameworks.map((fr) => <span>{fr.name}</span>)
                    )}
                </div>
            </div>
            <div className={styles.subContainer}>
                <h3>Orms:</h3>
                <div className={styles.elements}>
                    {language.orms.length === 0 ? (
                        <span>N/A</span>
                    ) : (
                        language.orms.map((orm) => <span>{orm.name}</span>)
                    )}
                </div>
            </div>
            <div className={styles.subContainer}>
                <h3>Libraries:</h3>
                <div className={styles.elements}>
                    {language.libs.length === 0 ? (
                        <span>N/A</span>
                    ) : (
                        language.libs.map((lib) => <span>{lib.name}</span>)
                    )}
                </div>
            </div>
        </div>
    );
}

export default LanguageCardv2;
