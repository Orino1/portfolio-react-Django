import "../assets/styles/style.css";
import styles from "../assets/styles/pages/Home.module.css";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { fetchProjects, fetchSkills } from "../apiService";
import ProjectCard from "../components/ProjectCard";
import LanguageCard from "../components/LanguageCard";
import TechnologyCard from "../components/TechnologyCard";

function Home() {
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState(null);
    const realName = process.env.REACT_APP_REALNAME;

    useEffect(() => {
        const getProject = async () => {
            const data = await fetchProjects();

            data && setProjects(data.projects);
        };

        getProject();
    }, []);

    useEffect(() => {
        const getSkills = async () => {
            const data = await fetchSkills();
            console.log(data)
            data && setSkills(data);
        };

        getSkills();
    }, []);

    return (
        <>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <div className={styles.main}>
                <section>
                </section>
                <section>
                    <div>
                        <div>
                            <p>{realName}</p>
                            <h1>
                                Building Solutions, for Your Needs
                                <span>.</span>
                            </h1>
                        </div>
                        <p>
                            Having worked across a range of projects, including
                            roles such as a software quality tester and a former
                            board repairman, I bring a diverse skill set with a
                            strong focus on troubleshooting and problem-solving.
                            My experience in quality assurance ensures that
                            every project is delivered with the highest
                            standards of reliability and performance. With
                            expertise in both front-end and back-end
                            development, I focus on crafting seamless user
                            experiences while maintaining efficiency and
                            creativity. Based in Morocco, I consistently strive
                            for precision and alignment with both client
                            objectives and user needs.
                        </p>
                    </div>
                </section>
                <section>
                    Building responsive applications that solve real-world
                    problems, with the ability to integrate into teams using a
                    diverse range of technologies and stacks to deliver
                    effective solutions.
                </section>
            </div>
            {projects && projects.length > 0 ? (
                <div className={`${styles.news} maxMainContainer`}>
                    <div className="maxSubContainer">
                        <div>
                            <div>
                                <p></p>
                                <h1>
                                    Latest <span>Projects.</span>
                                </h1>
                            </div>
                        </div>
                        <div>
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}

            {skills && skills.languages && (
                <div
                    className={`${styles.news} ${styles.languages} maxMainContainer`}
                >
                    <div className="maxSubContainer">
                        <div>
                            <div>
                                <p></p>
                                <h1>
                                    Programming <span>languages.</span>
                                </h1>
                            </div>
                        </div>
                        <div>
                            {skills.languages.map((language) => (
                                <LanguageCard key={language.id} language={language}/>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {skills && skills.technologies && (
                <div className={`${styles.news} maxMainContainer`}>
                    <div className="maxSubContainer">
                        <div>
                            <div>
                                <p></p>
                                <h1>
                                    Other <span>technologies.</span>
                                </h1>
                            </div>
                        </div>
                        <div>
                        {skills.technologies.map((tech) => (
                                <TechnologyCard key={tech.id} tech={tech}/>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;
