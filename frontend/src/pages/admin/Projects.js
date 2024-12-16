import styles from "../../assets/styles/pages/Projects.module.css";
import { fetchProjects } from "../../apiService";
import { useState, useEffect } from "react";
import ProjectCardv2 from "../../components/ProjectCardv2";
import NewProject from "../../components/NewProject";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [content, setContent] = useState("");

    useEffect(() => {
        const getProjects = async () => {
            const data = await fetchProjects();

            data && setProjects(data.projects);
        };

        getProjects();
    }, []);

    const renderContent = () => {
        switch (content) {
            case "newProject":
                return (
                    <NewProject
                        setContent={setContent}
                        setProjects={setProjects}
                    />
                );
            case "updateProject":
                break;
            default:
                return (
                    <Home
                        setContent={setContent}
                        projects={projects}
                        setProjects={setProjects}
                    />
                );
        }
    };

    return renderContent();
}

export default Projects;

function Home({ setContent, projects, setProjects }) {
    const handleNewProjectBtn = () => setContent("newProject");

    return (
        <div className={styles.main}>
            <div class={styles.header}>
                <h1>Projects ({projects.length})</h1>
                <div className={styles.btnsContainer}>
                    <button onClick={handleNewProjectBtn}>New Project</button>
                </div>
            </div>
            <div className={styles.mainContent}>
                {projects.map((project) => (
                    <ProjectCardv2
                        key={project.id}
                        project={project}
                        setProjects={setProjects}
                    />
                ))}
            </div>
        </div>
    );
}
