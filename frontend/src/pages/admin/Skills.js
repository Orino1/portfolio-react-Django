import styles from "../../assets/styles/pages/Skills.module.css";
import { useState, useEffect } from "react";
import { fetchSkills } from "../../apiService";
import NewLanguage from "../../components/NewLanguage";
import NewTechnology from "../../components/NewTechnology";
import LanguageCardv2 from "../../components/LanguageCardv2";
import TechnologyCardv2 from "../../components/TechnologyCardv2";
import UpdateLanguage from "../../components/UpdateLanguage";
import UpdateTechnology from "../../components/UpdateTechnology";

function Skills() {
    const [content, setContent] = useState("");

    const [languages, setLanguages] = useState([]);
    const [technologies, setTechnologies] = useState([]);

    const [updateLanguage, setUpdateLanguage] = useState(null);
    const [updateTechnology, setUpdateTechnology] = useState(null);

    useEffect(() => {
        const getSkills = async () => {
            const data = await fetchSkills();

            if (data) {
                setLanguages(data.languages);
                setTechnologies(data.technologies);
            }
        };

        getSkills();
    }, []);

    const renderContent = () => {
        switch (content) {
            case "newLanguage":
                return (
                    <NewLanguage
                        setContent={setContent}
                        setLanguages={setLanguages}
                    />
                );
            case "newTechnology":
                return (
                    <NewTechnology
                    setContent={setContent}
                        setTechnologies={setTechnologies}
                    />
                );
            case "updateLanguage":
                return (
                    <UpdateLanguage
                        language={updateLanguage}
                        setContent={setContent}
                        setLanguages={setLanguages}
                        setUpdateLanguage={setUpdateLanguage}
                    />
                );
            case "updateTechnology":
                return (
                    <UpdateTechnology
                        technology={updateTechnology}
                        setContent={setContent}
                        setTechnologies={setTechnologies}
                        setUpdateTechnology={setUpdateTechnology}
                    />
                );
            default:
                return (
                    <Main
                        languages={languages}
                        technologies={technologies}
                        setContent={setContent}
                        setLanguages={setLanguages}
                        setTechnologies={setTechnologies}
                        setUpdateLanguage={setUpdateLanguage}
                        setUpdateTechnology={setUpdateTechnology}
                    />
                );
        }
    };

    return renderContent();
}

export default Skills;

function Main({
    languages,
    technologies,
    setContent,
    setLanguages,
    setTechnologies,
    setUpdateLanguage,
    setUpdateTechnology,
}) {
    const handleNewLanguageClick = () => {
        setContent("newLanguage");
    };

    const handleNewTechnologyClick = () => {
        setContent("newTechnology");
    };

    const handleLanguageToBeUpdated = (language) => {
        setUpdateLanguage(language);
        setContent("updateLanguage");
    }

    const handleTechnologyToBeUpdated = (technology) => {
        setUpdateTechnology(technology);
        console.log("here")
        setContent("updateTechnology");
    }

    return (
        <div class={styles.main}>
            <div class={styles.header}>
                <h1>Skills</h1>
                <div className={styles.btnsContainer}>
                    <button onClick={handleNewLanguageClick}>
                        New language
                    </button>
                    <button onClick={handleNewTechnologyClick}>
                        New technology
                    </button>
                </div>
            </div>
            <div class={styles.mainContent}>
                <div class={styles.languages}>
                    <h3>Languages: ({languages.length})</h3>
                    <div>
                        {languages.map((language) => (
                            <LanguageCardv2
                                key={language.id}
                                language={language}
                                setLanguages={setLanguages}
                                setUpdateLanguage={handleLanguageToBeUpdated}
                            />
                        ))}
                    </div>
                </div>
                <div class={styles.technologies}>
                    <h3>Technologies: ({technologies.length})</h3>
                    <div>
                        {technologies.map((tech) => (
                            <TechnologyCardv2
                                key={tech.id}
                                tech={tech}
                                setTechnologies={setTechnologies}
                                setUpdateTechnology={handleTechnologyToBeUpdated}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
