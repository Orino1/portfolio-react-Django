import styles from "../assets/styles/components/NewLanguage.module.css";
import { useState } from "react";
import { createLanguage } from "../apiService";
import { useGlobalMsgContext } from "../contexts/GlobalMsgContext";
import AdminSubPageLayout from "../layout/AdminSubPageLayout";

function NewLanguage({ setContent, setLanguages }) {
    const [langName, setLangeName] = useState(null);
    const [orms, setOrms] = useState([]);
    const [frameworks, setFrameworks] = useState([]);
    const [libs, setLibs] = useState([]);

    const { setMsg } = useGlobalMsgContext();

    const handleReturn = () => {
        setContent("");
    };

    const handleAddOrmBtn = () => {
        const newOrmId = Date.now().toString();
        setOrms((prevOrms) => [...prevOrms, { id: newOrmId, name: "" }]);
    };

    const handleOrmChange = (e, id) => {
        const value = e.target.value;
        setOrms((prevOrms) =>
            prevOrms.map((orm) =>
                orm.id === id ? { ...orm, name: value } : orm
            )
        );
    };

    const handleDeleteOrm = (id) => {
        setOrms((prevOrms) => prevOrms.filter((orm) => orm.id !== id));
    };

    const handleAddFrameworkBtn = () => {
        const newFrameworkId = Date.now().toString();
        setFrameworks((prevFr) => [
            ...prevFr,
            { id: newFrameworkId, name: "" },
        ]);
    };

    const handleFrameworkChange = (e, id) => {
        const value = e.target.value;
        setFrameworks((prevFr) =>
            prevFr.map((framework) =>
                framework.id === id ? { ...framework, name: value } : framework
            )
        );
    };

    const handleDeleteFramework = (id) => {
        setFrameworks((prevFrame) =>
            prevFrame.filter((frame) => frame.id !== id)
        );
    };

    const handleAddLibBtn = () => {
        const newId = Date.now().toString();
        setLibs((prev) => [...prev, { id: newId, name: "" }]);
    };

    const handleLibChange = (e, id) => {
        const value = e.target.value;
        setLibs((prevLibs) =>
            prevLibs.map((lib) =>
                lib.id === id ? { ...lib, name: value } : lib
            )
        );
    };

    const handleDeletelib = (id) => {
        setLibs((prevLibs) => prevLibs.filter((lib) => lib.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!langName) {
            setMsg("Language name cannot be empty.");
            return;
        }

        const language = {
            name: langName,
        };

        const ormNames = orms
            .map((orm) => orm.name.trim())
            .filter((name) => name !== "");
        if (ormNames.length > 0) {
            language.orms = ormNames;
        }

        const frameworkNames = frameworks
            .map((fw) => fw.name.trim())
            .filter((name) => name !== "");
        if (frameworkNames.length > 0) {
            language.frameworks = frameworkNames;
        }

        const libNames = libs
            .map((lib) => lib.name.trim())
            .filter((name) => name !== "");
        if (libNames.length > 0) {
            language.libs = libNames;
        }

        const data = await createLanguage(language);

        if (data) {
            setLanguages((prev) => [...prev, data.language]);
            handleReturn();
        }
    };

    return (
        <AdminSubPageLayout handleBack={handleReturn}>
            <div className={styles.main}>
                <form
                    className={styles.newLanguageForm}
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <h1>Language name</h1>
                    <input
                        onChange={(e) => setLangeName(e.target.value)}
                        placeholder="Language name"
                        type="text"
                    ></input>
                    <h1>Orms</h1>

                    {orms.map((orm) => (
                        <div className={styles.section}>
                            <input
                                key={orm.id}
                                placeholder="ORM"
                                type="text"
                                onChange={(e) => handleOrmChange(e, orm.id)}
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteOrm(orm.id)}
                            >
                                -
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddOrmBtn}>
                        New Orm
                    </button>
                    <h1>Frameworks</h1>
                    {frameworks.map((framework) => (
                        <div className={styles.section}>
                            <input
                                key={framework.id}
                                placeholder="Framework"
                                type="text"
                                onChange={(e) =>
                                    handleFrameworkChange(e, framework.id)
                                }
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    handleDeleteFramework(framework.id)
                                }
                            >
                                -
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddFrameworkBtn}>
                        New Framework
                    </button>
                    <h1>Libraries</h1>
                    {libs.map((lib) => (
                        <div className={styles.section}>
                            <input
                                key={lib.id}
                                placeholder="Library"
                                type="text"
                                onChange={(e) => handleLibChange(e, lib.id)}
                            />
                            <button
                                type="button"
                                onClick={() => handleDeletelib(lib.id)}
                            >
                                -
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddLibBtn}>
                        New library
                    </button>
                    <button type="submit">Create</button>
                </form>
            </div>
        </AdminSubPageLayout>
    );
}

export default NewLanguage;
