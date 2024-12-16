import styles from "../assets/styles/components/ProjectCardv2.module.css";
import { useState } from "react";
import { deleteProject } from "../apiService";

function ProjectCardv2({ project, setProjects }) {
    const [selectedStack, setSelectedStack] = useState(project.variants[0]);

    const handleStackSelection = (variant) => {
        setSelectedStack(variant);
    };

    const handleDeletion = async () => {
        const responseOk = await deleteProject(project.id);
        responseOk &&
            setProjects((prev) =>
                prev.filter((proje) => project.id !== proje.id)
            );
    };

    return (
        <div className={styles.project}>
            <i onClick={handleDeletion} className="fa-solid fa-trash"></i>
            <h2>{project.name}</h2>
            <h3>{project.description}</h3>
            <p>The problem we're solving: {project.problem_statement}</p>
            <p>The solution offered by this project: {project.solution}</p>
            <hr></hr>
            <div className={styles.variants}>
                <div>
                    {project.variants.map((vr) => (
                        <span
                            className={
                                vr === selectedStack ? styles.selected : ""
                            }
                            onClick={() => handleStackSelection(vr)}
                            key={vr.id}
                        >
                            {vr.languages
                                .map((lang) => lang.language.name)
                                .join(", ")}
                        </span>
                    ))}
                </div>
                <div>
                    <p>Stack details:</p>
                    <div>
                        {selectedStack.languages.map((lang) => (
                            <>
                                <span>{lang.language.name}</span>
                                {lang.orms.map((orm) => (
                                    <span>{orm.orm.name}</span>
                                ))}
                                {lang.frameworks.map((fr) => (
                                    <span>{fr.framework.name}</span>
                                ))}
                                {lang.libs.map((lib) => (
                                    <span>{lib.lib.name}</span>
                                ))}
                            </>
                        ))}
                        {selectedStack.technologies.map((tech) => (
                            <span>{tech.technology.name}</span>
                        ))}
                    </div>
                    <p>
                        Github:{" "}
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={selectedStack.repo_link}
                        >
                            {selectedStack.repo_link}
                        </a>
                    </p>
                    {selectedStack.deployed_link && (
                        <p>
                            Deployed at:{" "}
                            <a
                                rel="noreferrer"
                                target="_blank"
                                href={selectedStack.deployed_link}
                            >
                                {selectedStack.deployed_link}
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectCardv2;
