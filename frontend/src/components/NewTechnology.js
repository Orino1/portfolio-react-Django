import styles from "../assets/styles/components/NewTechnology.module.css";
import { useState } from "react";
import AdminSubPageLayout from "../layout/AdminSubPageLayout";
import { useGlobalMsgContext } from "../contexts/GlobalMsgContext";
import { createTechnology } from "../apiService";

function NewTechnology({ setContent, setTechnologies }) {
    const [name, setName] = useState("");
    const [sections, setSections] = useState([]);
    const { setMsg } = useGlobalMsgContext();

    const handleRetrun = () => setContent("");

    const handleNewSectionBtn = (e) => {
        e.preventDefault();

        setSections((prev) => {
            const newId = Date.now().toString();
            return [...prev, { id: newId, header: "", content: "" }];
        });
    };

    const handleDeleteSectionBtn = (e, id) => {
        e.preventDefault();

        setSections((prev) => prev.filter((section) => section.id !== id));
    };

    const handleHeaderChnage = (e, id) => {
        e.preventDefault();

        setSections((prev) =>
            prev.map((section) =>
                section.id === id
                    ? { ...section, header: e.target.value }
                    : section
            )
        );
    };

    const handleContentChnage = (e, id) => {
        e.preventDefault();

        setSections((prev) =>
            prev.map((section) =>
                section.id === id
                    ? { ...section, content: e.target.value }
                    : section
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === "") {
            setMsg("Name of the technology is required.")
            return;
        }

        const formatted_sections = sections
            .map((section) => ({
                header: section.header,
                content: section.content,
            }))
            .filter(
                (section) => section.header !== "" && section.content !== ""
            );

        if (formatted_sections.length < 1) {
            setMsg("At least 1 section is required.")
            return;
        }

        const technology = { name: name.trim(), sections: formatted_sections };

        const data = await createTechnology(technology);

        if (data) {
            setTechnologies(prev => [...prev, data.technology])
            handleRetrun();
        }
    };

    return (
        <AdminSubPageLayout handleBack={handleRetrun}>
            <div>
                <form
                    onSubmit={(e) => handleSubmit(e)}
                    className={styles.newTechnologyForm}
                >
                    <h1>Technology name</h1>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Technology name"
                    ></input>
                    <h1>Sections</h1>
                    {sections.map((section) => (
                        <div key={section.id} className={styles.subSections}>
                            <div>
                                <input
                                    onChange={(e) =>
                                        handleHeaderChnage(e, section.id)
                                    }
                                    type="text"
                                    placeholder="header"
                                ></input>
                                <input
                                    onChange={(e) =>
                                        handleContentChnage(e, section.id)
                                    }
                                    type="text"
                                    placeholder="content"
                                ></input>
                            </div>
                            <button
                                onClick={(e) =>
                                    handleDeleteSectionBtn(e, section.id)
                                }
                            >
                                -
                            </button>
                        </div>
                    ))}

                    <button onClick={(e) => handleNewSectionBtn(e)}>
                        New section
                    </button>
                    <button>Create</button>
                </form>
            </div>
        </AdminSubPageLayout>
    );
}

export default NewTechnology;
