import axios from "axios";
import { setMsg } from "./contexts/GlobalMsgContext";

const domain = process.env.REACT_APP_DOMAIN;

const api = axios.create({
    baseURL: domain,
});


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