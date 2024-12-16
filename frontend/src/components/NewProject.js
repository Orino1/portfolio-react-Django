import { useGlobalMsgContext } from "../contexts/GlobalMsgContext";
import { useState, useEffect } from "react";
import AdminSubPageLayout from "../layout/AdminSubPageLayout";
import { createProject, fetchSkills } from "../apiService";
import styles from "../assets/styles/components/NewProject.module.css";

function NewProject({ setContent, setProjects }) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [problemStatement, setProblemStatement] = useState("");
    const [solution, setSolution] = useState("");

    const [variants, setVariants] = useState([]);

    const [langs, setLangs] = useState([]);
    const [techs, setTechs] = useState([]);

    const { setMsg } = useGlobalMsgContext();

    useEffect(() => {
        const setSkills = async () => {
            const data = await fetchSkills();

            if (data) {
                setLangs(data.languages);
                setTechs(data.technologies);
            }
        };

        setSkills();
    }, []);

    const handleReturn = () => setContent("");

    const handleAddVariant = () => {
        const newId = Date.now().toString();
        const newVariant = {
            id: newId,
            github: "",
            link: "",
            languages: [],
            technologies: [],
        };
        setVariants((prev) => [...prev, newVariant]);
    };

    // handle variant link change
    const handleVariantLink = (e, id) => {
        const value = e.target.value;
        setVariants((prev) => {
            return prev.map((variant) => {
                return variant.id !== id
                    ? variant
                    : { ...variant, link: value };
            });
        });
    };

    // handle variant github change
    const handleVariantGithub = (e, id) => {
        const value = e.target.value;
        setVariants((prev) => {
            return prev.map((variant) => {
                return variant.id !== id
                    ? variant
                    : { ...variant, github: value };
            });
        });
    };

    // handle variant languages
    const handleVariantLang = (variantId, langId) => {
        setVariants((prev) =>
            prev.map((variant) =>
                variant.id !== variantId
                    ? variant
                    : {
                          ...variant,
                          languages: variant.languages.find(
                              (lang) => lang.id === langId
                          )
                              ? variant.languages.filter(
                                    (lang) => lang.id !== langId
                                )
                              : [
                                    ...variant.languages,
                                    {
                                        id: langId,
                                        orms: [],
                                        frameworks: [],
                                        libraries: [],
                                    },
                                ],
                      }
            )
        );
    };

    // handle variant technologies
    const handleVariantTech = (variantId, techId) =>
        setVariants((prev) =>
            prev.map((variant) =>
                variant.id !== variantId
                    ? variant
                    : {
                          ...variant,
                          technologies: variant.technologies.includes(techId)
                              ? variant.technologies.filter(
                                    (id) => id !== techId
                                )
                              : [...variant.technologies, techId],
                      }
            )
        );

    const handleAddOrm = (variantId, langId, ormId) => {
        const selectedLanguage = variants
            .find((variant) => variant.id === variantId)
            .languages.find((lang) => lang.id === langId);

        if (!selectedLanguage) {
            setMsg("Select the main language first")
            return;
        }

        setVariants((prev) =>
            prev.map((variant) =>
                variant.id !== variantId
                    ? variant
                    : {
                          ...variant,
                          languages: variant.languages.map((language) =>
                              language.id !== langId
                                  ? language
                                  : {
                                        ...language,
                                        orms: language.orms.includes(ormId)
                                            ? language.orms.filter(
                                                  (id) => id !== ormId
                                              )
                                            : [...language.orms, ormId],
                                    }
                          ),
                      }
            )
        );
    };

    const handleAddFrameworks = (variantId, langId, frId) => {
        const selectedLanguage = variants
            .find((variant) => variant.id === variantId)
            .languages.find((lang) => lang.id === langId);

        if (!selectedLanguage) {
            setMsg("Select the main language first")
            return;
        }

        setVariants((prev) =>
            prev.map((variant) =>
                variant.id !== variantId
                    ? variant
                    : {
                          ...variant,
                          languages: variant.languages.map((language) =>
                              language.id !== langId
                                  ? language
                                  : {
                                        ...language,
                                        frameworks:
                                            language.frameworks.includes(frId)
                                                ? language.frameworks.filter(
                                                      (id) => id !== frId
                                                  )
                                                : [
                                                      ...language.frameworks,
                                                      frId,
                                                  ],
                                    }
                          ),
                      }
            )
        );
    };

    // handle libs herer
    const handleAddLib = (variantId, langId, libId) => {
        const selectedLanguage = variants
            .find((variant) => variant.id === variantId)
            .languages.find((lang) => lang.id === langId);

        if (!selectedLanguage) {
            setMsg("Select the main language first")
            return;
        }

        setVariants((prev) =>
            prev.map((variant) =>
                variant.id !== variantId
                    ? variant
                    : {
                          ...variant,
                          languages: variant.languages.map((language) =>
                              language.id !== langId
                                  ? language
                                  : {
                                        ...language,
                                        libraries: language.libraries.includes(
                                            libId
                                        )
                                            ? language.libraries.filter(
                                                  (id) => id !== libId
                                              )
                                            : [...language.libraries, libId],
                                    }
                          ),
                      }
            )
        );
    };

    const handleDeleteVariant = (id) => {
        setVariants((perv) => perv.filter((variant) => variant.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // we need to check teh name and desc and problem statment and sulotion
        if (name.trim() === "") {
            setMsg("Project name is required.")
            return;
        }
        if (desc.trim() === "") {
            setMsg("Project description is required.")
            return;
        }
        if (problemStatement.trim() === "") {
            setMsg("Project problem statment is required.")
            return;
        }
        if (solution.trim() === "") {
            setMsg("Project solution is required.")
            return;
        }

        // we need to check if we have at least one variant
        if (variants.length < 1) {
            setMsg("At least one project variant is required.")
            return;
        }

        // we need to loop on each variant and verify teh following
        for (const variant of variants) {
            if (variant.github.trim() === "") {
                setMsg("A GitHub link for the repository is required.")
                return;
            }
            if (variant.languages.length < 1) {
                setMsg("At least one language is required for each variant.")
                return;
            }
        }

        // now we format teh actual variants based on thier content and sends them
        const formattedVariants = variants.map((variant) => {
            const formattedVariant = {
                repo_link: variant.github.trim(),
                languages: [],
            };

            if (variant.link.trim() !== "") {
                formattedVariant.deployed_link = variant.link.trim();
            }

            // we need to add languages + technologies
            formattedVariant.languages = variant.languages.map((lang) => {
                const formattedLanguage = {
                    id: lang.id,
                };
                if (lang.orms.length > 0) {
                    formattedLanguage.orms = lang.orms;
                }
                if (lang.frameworks.length > 0) {
                    formattedLanguage.frameworks = lang.frameworks;
                }
                if (lang.libraries.length > 0) {
                    formattedLanguage.libraries = lang.libraries;
                }

                return formattedLanguage;
            });

            // we need to add technologies
            if (variant.technologies.length > 0) {
                formattedVariant.technologies = variant.technologies;
            }

            return formattedVariant;
        });

        const project = {
            name: name,
            description: desc,
            problem_statement: problemStatement,
            solution: solution,
            variants: formattedVariants,
        };

        const data = await createProject(project);

        if (data) {
            // we ste first the actual new project in our projects state
            setProjects(prev => [...prev, data.project])
            handleReturn();
        }
    };

    return (
        <AdminSubPageLayout handleBack={handleReturn}>
            <form
                className={styles.newProjectForm}
                onSubmit={(e) => handleSubmit(e)}
            >
                <input
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Project name"
                ></input>
                <input
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Project desc"
                ></input>
                <input
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Project problem statment"
                ></input>
                <input
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Project sulotion"
                ></input>

                {variants.map((variant) => (
                    <div key={variant.id} className={styles.variant}>
                        <div>
                            <input
                                onChange={(e) =>
                                    handleVariantLink(e, variant.id)
                                }
                                placeholder="Link"
                            ></input>
                            <input
                                onChange={(e) =>
                                    handleVariantGithub(e, variant.id)
                                }
                                placeholder="Github"
                            ></input>
                            <h4>Select languages (ORMS and Frameworks)</h4>
                            <div className={styles.languagesContainer}>
                                {langs.map((lang) => (
                                    <>
                                        <div
                                            className={
                                                variant.languages.find(
                                                    (lg) => lg.id === lang.id
                                                )
                                                    ? styles.selected
                                                    : ""
                                            }
                                            onClick={(e) =>
                                                handleVariantLang(
                                                    variant.id,
                                                    lang.id
                                                )
                                            }
                                            key={lang.id}
                                        >
                                            {lang.name}
                                        </div>
                                        {lang.orms.map((orm) => (
                                            <div
                                                className={
                                                    variant.languages
                                                        .find(
                                                            (lg) =>
                                                                lg.id ===
                                                                lang.id
                                                        )
                                                        ?.orms.find(
                                                            (id) =>
                                                                id === orm.id
                                                        )
                                                        ? styles.selected
                                                        : ""
                                                }
                                                onClick={(e) =>
                                                    handleAddOrm(
                                                        variant.id,
                                                        lang.id,
                                                        orm.id
                                                    )
                                                }
                                                key={orm.id}
                                            >
                                                {orm.name}
                                            </div>
                                        ))}
                                        {lang.frameworks.map((fr) => (
                                            <div
                                                className={
                                                    variant.languages
                                                        .find(
                                                            (lg) =>
                                                                lg.id ===
                                                                lang.id
                                                        )
                                                        ?.frameworks.find(
                                                            (id) => id === fr.id
                                                        )
                                                        ? styles.selected
                                                        : ""
                                                }
                                                onClick={(e) =>
                                                    handleAddFrameworks(
                                                        variant.id,
                                                        lang.id,
                                                        fr.id
                                                    )
                                                }
                                                key={fr.id}
                                            >
                                                {fr.name}
                                            </div>
                                        ))}
                                        {lang.libs.map((lib) => (
                                            <div
                                                className={
                                                    variant.languages
                                                        .find(
                                                            (lg) =>
                                                                lg.id ===
                                                                lang.id
                                                        )
                                                        ?.libraries.find(
                                                            (id) =>
                                                                id === lib.id
                                                        )
                                                        ? styles.selected
                                                        : ""
                                                }
                                                onClick={(e) =>
                                                    handleAddLib(
                                                        variant.id,
                                                        lang.id,
                                                        lib.id
                                                    )
                                                }
                                                key={lib.id}
                                            >
                                                {lib.name}
                                            </div>
                                        ))}
                                    </>
                                ))}
                            </div>

                            <h4>Select technologies</h4>
                            <div className={styles.languagesContainer}>
                                {techs.map((tech) => (
                                    <div
                                        className={
                                            variant.technologies.includes(
                                                tech.id
                                            )
                                                ? styles.selected
                                                : ""
                                        }
                                        onClick={(e) =>
                                            handleVariantTech(
                                                variant.id,
                                                tech.id
                                            )
                                        }
                                        key={tech.id}
                                    >
                                        {tech.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={(e) => handleDeleteVariant(variant.id)}
                            type="button"
                        >
                            -
                        </button>
                    </div>
                ))}
                <button onClick={handleAddVariant} type="button">
                    Add new Variant
                </button>
                <button>Create</button>
            </form>
        </AdminSubPageLayout>
    );
}

export default NewProject;
