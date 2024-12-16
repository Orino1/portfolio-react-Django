import styles from "../assets/styles/components/NewLanguage.module.css";
import { useState } from "react";
import { useGlobalMsgContext } from "../contexts/GlobalMsgContext";
import AdminSubPageLayout from "../layout/AdminSubPageLayout";
import { updateLanguage } from "../apiService";


export default function UpdateLanguage({ language, setLanguages, setContent, setUpdateLanguage }) {
    const [langName, setLangeName] = useState(language.name);
    const [orms, setOrms] = useState(language.orms);
    const [frameworks, setFrameworks] = useState(language.frameworks);
    const [libs, setLibs] = useState(language.libs);
    const [newOrms, setNewOrms] = useState([]);
    const [newFrameworks, setNewFrameworks] = useState([]);
    const [newLibs, setNewLibs] = useState([]);
    const [deletedOrms, setDeletedOrms] = useState([]);
    const [deletedFrameworks, setDeletedFrameworks] = useState([]);
    const [deletedlibs, setDeletedLibs] = useState([]);
    const { setMsg } = useGlobalMsgContext();

    const handleReturn = () => {
        setUpdateLanguage(null)
        setContent("");
    };

    const handleAddOrmBtn = () => {
        const newOrmId = Date.now().toString();
        setNewOrms((prevOrms) => [...prevOrms, { id: newOrmId, name: "" }]);
    };

    const handleOrmChange = (e, id) => {
        const value = e.target.value;
        setOrms((prevOrms) =>
            prevOrms.map((orm) =>
                orm.id === id ? { ...orm, name: value } : orm
            )
        );
    };

    const handleNewOrmChange = (e, id) => {
        const value = e.target.value;
        setNewOrms((prevOrms) =>
            prevOrms.map((orm) =>
                orm.id === id ? { ...orm, name: value } : orm
            )
        );
    };

    const handleDeleteOrm = (id) => {
        setDeletedOrms((prev) => [...prev, id]);
        setOrms((prevOrms) => prevOrms.filter((orm) => orm.id !== id));
    };

    const handleDeleteNewOrm = (id) => {
        setNewOrms((prevOrms) => prevOrms.filter((orm) => orm.id !== id));
    };

    const handleAddFrameworkBtn = () => {
        const newFrameworkId = Date.now().toString();
        setNewFrameworks((prevFr) => [
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

    const handleNewFrameworkChange = (e, id) => {
        const value = e.target.value;
        setNewFrameworks((prevFr) =>
            prevFr.map((framework) =>
                framework.id === id ? { ...framework, name: value } : framework
            )
        );
    };

    const handleDeleteFramework = (id) => {
        setDeletedFrameworks((prev) => [...prev, id]);
        setFrameworks((prevFrame) =>
            prevFrame.filter((frame) => frame.id !== id)
        );
    };

    const handleDeleteNewFramework = (id) => {
        setNewFrameworks((prevFrame) =>
            prevFrame.filter((frame) => frame.id !== id)
        );
    };

    // new ones

    const handleAddNewLibBtn = () => {
        const newId = Date.now().toString();
        setNewLibs((prev) => [
            ...prev,
            { id: newId, name: "" },
        ]);
    };

    const handleLibChange = (e, id) => {
        const value = e.target.value;
        setLibs((prev) =>
            prev.map((lib) => (lib.id === id ? { ...lib, name: value } : lib))
        );
    };

    const handleNewLibChange = (e, id) => {
        const value = e.target.value;
        setNewLibs((prev) =>
            prev.map((lb) => (lb.id === id ? { ...lb, name: value } : lb))
        );
    };

    const handleDeleteLib = (id) => {
        setDeletedLibs((prev) => [...prev, id]);
        setLibs((prev) => prev.filter((lb) => lb.id !== id));
    };

    const handleDeleteNewLib = (id) => {
        setNewLibs((prev) => prev.filter((lb) => lb.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedLanguage = {};

        if (langName.trim() === "") {
            setMsg("Language name is required.")
            return;
        }

        // new name
        if (langName !== language.language) {
            updatedLanguage.name = langName.trim();
        }

        // new orms
        const newOrmNames = newOrms
            .map((orm) => orm.name.trim())
            .filter((name) => name !== "");
        if (newOrmNames.length > 0) {
            updatedLanguage.new_orms = newOrmNames;
        }

        // new frameworks
        const newFrameworksNames = newFrameworks
            .map((frame) => frame.name.trim())
            .filter((name) => name !== "");
        if (newFrameworksNames.length > 0) {
            updatedLanguage.new_frameworks = newFrameworksNames;
        }

        // new libs
        const newLibsNames = newLibs
            .map((lb) => lb.name.trim())
            .filter((lb) => lb !== "");
        if (newLibsNames.length > 0) {
            updatedLanguage.new_libs = newLibsNames;
        }

        // old orms
        const updatedOrms = orms.filter((orm) => {
            const originalOrm = language.orms.find((o) => o.id === orm.id);
            return originalOrm && originalOrm.name !== orm.name.trim();
        });
        if (updatedOrms.length > 0) {
            updatedLanguage.old_orms = updatedOrms;
        }

        // old frameworks
        const updatedFrameworks = frameworks.filter((frame) => {
            const originalFramework = language.frameworks.find(
                (f) => f.id === frame.id
            );
            return (
                originalFramework &&
                originalFramework.name !== frame.name.trim()
            );
        });
        if (updatedFrameworks.length > 0) {
            updatedLanguage.old_frameworks = updatedFrameworks;
        }

        // old libraries
        const updatedLibs = libs.filter((lb) => {
            const originalLib = language.libs.find(
                (lib) => lib.id === lb.id
            );
            return originalLib && originalLib.name !== lb.name.trim();
        });
        if (updatedLibs.length > 0) {
            updatedLanguage.old_libs = updatedLibs;
        }

        // deleted orms
        if (deletedOrms.length > 0) {
            updatedLanguage.deleted_orms = deletedOrms;
        }

        // deleted frameworks
        if (deletedFrameworks.length > 0) {
            updatedLanguage.deleted_frameworks = deletedFrameworks;
        }

        // deleted libraries
        if (deletedlibs.length > 0) {
            updatedLanguage.deleted_libs = deletedlibs;
        }

        const data = await updateLanguage(language.id, updatedLanguage);
        if (data) {
            setLanguages(prev => prev.map((lang) => lang.id !== language.id ? lang : data.language))
            handleReturn();
        }
    };

    return (
        <AdminSubPageLayout handleBack={handleReturn}>
            <div>
                <form
                    className={styles.newLanguageForm}
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <h1>Language name</h1>
                    <input
                        value={langName}
                        onChange={(e) => setLangeName(e.target.value)}
                        placeholder="Language name"
                        type="text"
                    ></input>
                    <h1>Orms</h1>
                    {orms.map((orm) => (
                        <div className={styles.section}>
                            <input
                                value={orm.name}
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
                    {newOrms.map((orm) => (
                        <div className={styles.section}>
                            <input
                                key={orm.id}
                                placeholder="ORM"
                                type="text"
                                onChange={(e) => handleNewOrmChange(e, orm.id)}
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteNewOrm(orm.id)}
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
                                value={framework.name}
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
                    {newFrameworks.map((framework) => (
                        <div className={styles.section}>
                            <input
                                key={framework.id}
                                placeholder="Framework"
                                type="text"
                                onChange={(e) =>
                                    handleNewFrameworkChange(e, framework.id)
                                }
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    handleDeleteNewFramework(framework.id)
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
                                value={lib.name}
                                placeholder="Library"
                                type="text"
                                onChange={(e) =>
                                    handleLibChange(e, lib.id)
                                }
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteLib(lib.id)}
                            >
                                -
                            </button>
                        </div>
                    ))}
                    {newLibs.map((lib) => (
                        <div className={styles.section}>
                            <input
                                key={lib.id}
                                placeholder="Library"
                                type="text"
                                onChange={(e) =>
                                    handleNewLibChange(e, lib.id)
                                }
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteNewLib(lib.id)}
                            >
                                -
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddNewLibBtn}>
                        New Library
                    </button>
                    <button type="submit">Update</button>
                </form>
            </div>
        </AdminSubPageLayout>
    );
}
