import styles from "../assets/styles/components/TechnologyCardv2.module.css";
import { deleteTechnology } from "../apiService";

function TechnologyCardv2({ tech, setTechnologies, setUpdateTechnology }) {
    const hadnleDeletion = async () => {
        const success = await deleteTechnology(tech.id);

        success &&
            setTechnologies((prev) =>
                prev.filter((technology) => technology.id !== tech.id)
            );
    };

    return (
        <div className={styles.container}>
            <i onClick={hadnleDeletion} className="fa-solid fa-trash"></i>
            <i
                onClick={() => setUpdateTechnology(tech)}
                className="fa-regular fa-pen-to-square"
            ></i>
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

export default TechnologyCardv2;
