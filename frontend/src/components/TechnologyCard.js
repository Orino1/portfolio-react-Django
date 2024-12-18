import styles from "../assets/styles/components/TechnologyCard.module.css";
import { useColorContext } from "../contexts/ColorThemeContext";

function TechnologyCard({ tech }) {
    const { color } = useColorContext();

    return (
        <div
            className={`${styles.container} ${
                color === "end" ? styles.darkmode : ""
            }`}
        >
            <h2>
                <i className="fa-solid fa-server"></i> {tech.name}
            </h2>
            <hr></hr>
            {tech.sections.map((section) => (
                <div className={styles.section}>
                    <h3>{section.header}</h3>
                    <p>{section.content}</p>
                </div>
            ))}
        </div>
    );
}

export default TechnologyCard;
