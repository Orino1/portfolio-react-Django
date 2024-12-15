import styles from "../assets/styles/components/TechnologyCard.module.css";

function TechnologyCard({ tech }) {
    return (
        <div className={styles.container}>
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
