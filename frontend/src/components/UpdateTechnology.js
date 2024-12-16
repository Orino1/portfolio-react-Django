import styles from "../assets/styles/components/NewTechnology.module.css";
import AdminSubPageLayout from "../layout/AdminSubPageLayout";
import { useState } from "react";
import { useGlobalMsgContext } from "../contexts/GlobalMsgContext";
import { updateTechnology } from "../apiService";

function UpdateTechnology({
    technology,
    setTechnologies,
    setContent,
    setUpdateTechnology,
}) {
    const [name, setName] = useState(technology.name);
    const [sections, setSections] = useState(technology.sections);
    const [newSections, setNewSections] = useState([]);
    const [deletedSections, setDeletedSections] = useState([]);
    const { setMsg } = useGlobalMsgContext();

    const handleReturn = () => {
        setUpdateTechnology(null);
        setContent("");
    };

    const handleNewSectionBtn = () => {
        setNewSections((prev) => {
            const newId = Date.now().toString();
            return [...prev, { id: newId, header: "", content: "" }];
        });
    };

    const handleDeleteSectionBtn = (id) => {
        setDeletedSections((prev) => [...prev, id]);
        setSections((prev) => prev.filter((section) => section.id !== id));
    };

    const handleDeleteNewSectionBtn = (id) => {
        setNewSections((prev) => prev.filter((section) => section.id !== id));
    };

    const handleHeaderChnage = (e, id) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === id
                    ? { ...section, header: e.target.value }
                    : section
            )
        );
    };

    const handleNewHeaderChnage = (e, id) => {
        setNewSections((prev) =>
            prev.map((section) =>
                section.id === id
                    ? { ...section, header: e.target.value }
                    : section
            )
        );
    };

    const handleContentChnage = (e, id) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === id
                    ? { ...section, content: e.target.value }
                    : section
            )
        );
    };

    const handleNewContentChnage = (e, id) => {
        setNewSections((prev) =>
            prev.map((section) =>
                section.id === id
                    ? { ...section, content: e.target.value }
                    : section
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedTech = {};

        if (name.trim() === "") {
            setMsg("Name of the technology is required.");
            return;
        }

        if (name !== technology.name) {
            updatedTech.name = name.trim();
        }

        // new sections
        const new_sections = newSections
            .map((section) => ({
                header: section.header,
                content: section.content,
            }))
            .filter(
                (section) => section.header !== "" && section.content !== ""
            );
        if (new_sections.length > 0) {
            updatedTech.new_sections = new_sections;
        }

        // old sections
        const updatedSections = sections.filter((section) => {
            const originalSection = technology.sections.find(
                (s) => s.id === section.id
            );
            return (
                originalSection.header !== section.header ||
                originalSection.content !== section.content
            );
        });
        if (updatedSections.length > 0) {
            updatedTech.old_sections = updatedSections;
        }

        // deleted sections
        if (deletedSections.length > 0) {
            updatedTech.deleted_sections = deletedSections;
        }

        const data = await updateTechnology(technology.id, updatedTech);

        if (data) {
            // we gonan set new technology inside of the technologies
            setTechnologies((prev) =>
                prev.map((tech) =>
                    tech.id !== technology.id ? tech : data.technology
                )
            );
            handleReturn();
        }
    };

    return (
        <AdminSubPageLayout handleBack={handleReturn}>
            <div>
                <form
                    onSubmit={(e) => handleSubmit(e)}
                    className={styles.newTechnologyForm}
                >
                    <h1>Technology name</h1>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Technology name"
                    ></input>
                    <h1>Sections</h1>
                    {sections.map((section) => (
                        <div key={section.id} className={styles.subSections}>
                            <div>
                                <input
                                    value={section.header}
                                    onChange={(e) =>
                                        handleHeaderChnage(e, section.id)
                                    }
                                    type="text"
                                    placeholder="header"
                                ></input>
                                <input
                                    value={section.content}
                                    onChange={(e) =>
                                        handleContentChnage(e, section.id)
                                    }
                                    type="text"
                                    placeholder="content"
                                ></input>
                            </div>
                            <button
                                type="button"
                                onClick={(e) =>
                                    handleDeleteSectionBtn(section.id)
                                }
                            >
                                -
                            </button>
                        </div>
                    ))}

                    {newSections.map((section) => (
                        <div key={section.id} className={styles.subSections}>
                            <div>
                                <input
                                    value={section.header}
                                    onChange={(e) =>
                                        handleNewHeaderChnage(e, section.id)
                                    }
                                    type="text"
                                    placeholder="header"
                                ></input>
                                <input
                                    value={section.content}
                                    onChange={(e) =>
                                        handleNewContentChnage(e, section.id)
                                    }
                                    type="text"
                                    placeholder="content"
                                ></input>
                            </div>
                            <button
                                type="button"
                                onClick={(e) =>
                                    handleDeleteNewSectionBtn(section.id)
                                }
                            >
                                -
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={handleNewSectionBtn}>
                        New section
                    </button>
                    <button>Update</button>
                </form>
            </div>
        </AdminSubPageLayout>
    );
}

export default UpdateTechnology;
