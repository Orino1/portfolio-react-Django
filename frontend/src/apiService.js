import axios from "axios";
import { setMsg } from "./contexts/GlobalMsgContext";
import { setAdminStatus } from "./contexts/AdminStatusContext";

const domain = process.env.REACT_APP_DOMAIN;

const api = axios.create({
    baseURL: domain,
    withCredentials: true,
});

const privateApi = axios.create({
    baseURL: domain,
    withCredentials: true,
});

privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                await api.get("/auth/refresh/");
                return api.request(error.config);
            } catch (error) {
                setAdminStatus(false);
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export async function fetchProjects() {
    try {
        const response = await api.get("/projects/");
        return response.data;
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}


export async function fetchSkills() {
    try {
        const response = await api.get("/skills/");
        return response.data;
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}


export async function login(loginInfo) {
    try {
        const response = await api.post("/auth/login/", loginInfo);
        setAdminStatus(true);
        setMsg(response.data.msg);
        return true;
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}


export async function status() {
    try {
        const response = await privateApi.get("/auth/status/");
        return response.data;
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}

export async function logout() {
    try {
        const response = await privateApi.get("/auth/logout/");
        setAdminStatus(false)
        setMsg(response.data.msg)
        return true
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}


export async function passChnage(newPass) {
    try {
        const response = await privateApi.patch("/auth/password/", newPass);
        setMsg(response.data.msg)
        return true
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}


export async function createLanguage(language) {
    try {
        const response = await privateApi.post("/skills/language/", language);
        return response.data
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}


export async function createTechnology(technology) {
    try {
        const response = await privateApi.post("/skills/technology/", technology);
        return response.data
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}


export async function deleteLanguage(langId) {
    try {
        const response = await privateApi.delete(`/skills/language/${langId}/`);
        setMsg(response.data.msg);
        return true
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}

export async function deleteTechnology(techId) {
    try {
        const response = await privateApi.delete(`/skills/technology/${techId}/`);
        setMsg(response.data.msg);
        return true
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}


export async function updateLanguage(langId, updatedLanguage) {
    try {
        const response = await privateApi.patch(`/skills/language/${langId}/`, updatedLanguage);
        return response.data
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}



export async function updateTechnology(techId, updatedTech) {
    try {
        const response = await privateApi.patch(`/skills/technology/${techId}/`, updatedTech);
        return response.data
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}


export async function deleteProject(projectId) {
    try {
        const response = await privateApi.delete(`/projects/${projectId}/`);
        setMsg(response.data.msg);
        return true
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}


export async function createProject(projectData) {
    try {
        const response = await privateApi.post("/projects/", projectData);
        return response.data
    } catch (err) {
        if (err.response) {
            console.error("backend error:", err.response.data.msg);
            setMsg(err.response.data.msg);
        } else if (err.request) {
            console.error("network error:", err.request);
            setMsg("unable to reach the server");
        } else {
            console.error("unknown error:", err.message);
            setMsg("Unknown error occurred");
        }
        return null;
    }
}
