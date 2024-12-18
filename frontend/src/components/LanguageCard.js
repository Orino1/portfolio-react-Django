import styles from "../assets/styles/components/LanguageCard.module.css";
import { useColorContext } from "../contexts/ColorThemeContext";

function LanguageCard({ language }) {
    const { color } = useColorContext();

    return (
        <div
            className={`${styles.container} ${
                color === "end" ? styles.darkmode : ""
            }`}
        >
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

export default LanguageCard;
