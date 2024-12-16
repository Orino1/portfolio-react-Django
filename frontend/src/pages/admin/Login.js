import styles from "../../assets/styles/pages/Login.module.css";
import { useState, useEffect } from "react";
import { login } from "../../apiService";
import { useGlobalMsgContext } from "../../contexts/GlobalMsgContext";
import { useAdminStatusContext } from "../../contexts/AdminStatusContext";
import { useNavigate } from "react-router-dom";

function Login() {
    const [success, setSuccess] = useState(false);
    const [username, setUsernmae] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const { adminStatus, loading, setAdminStatus, setLoading } = useAdminStatusContext();

    const { setMsg } = useGlobalMsgContext();

    useEffect(() => {
        if (!loading && adminStatus) {
            navigate("/admin/");
        }
    }, [adminStatus, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (username.trim() === "") {
            console.log("here");
            setMsg("username field cannot be empty.");
            return;
        }
        if (password.trim() === "") {
            setMsg("password field cannot be empty.");
            return;
        }

        const loginInfo = {
            username: username.trim(),
            password: password.trim(),
        };

        const responseOk = await login(loginInfo);

        if (responseOk) {
            setSuccess(true);

            setTimeout(() => {
                setAdminStatus(true);
                setLoading(false);
            }, 200);
        }
    };

    return (
        <div className={`${styles.container} ${success && styles.success}`}>
            <form
                className={success && styles.success}
                onSubmit={(e) => handleSubmit(e)}
            >
                <h3>Welcom back</h3>
                <div>
                    <input
                        onChange={(e) => setUsernmae(e.target.value)}
                        placeholder="username"
                        type="text"
                    ></input>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        type="password"
                    ></input>
                </div>
                <button type="submit" className={success && styles.success}>
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
