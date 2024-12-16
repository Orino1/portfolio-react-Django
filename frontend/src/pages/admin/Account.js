import styles from "../../assets/styles/pages/Account.module.css";
import { useGlobalMsgContext } from "../../contexts/GlobalMsgContext";
import { useState } from "react";
import { passChnage } from "../../apiService";

function Account() {
    const [password, setPassword] = useState("");

    const { setMsg } = useGlobalMsgContext();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.trim() === "") {
          setMsg("password cannot be empty.");
          return;
        }

        const newPassword = {
            password: password,
        };

        const success = await passChnage(newPassword);
        if (success) {
            setPassword("");
        }
    };

    return (
        <div className={styles.main}>
            <h1>Acount information</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="new password"
                    type="password"
                ></input>
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default Account;
