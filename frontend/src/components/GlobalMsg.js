import styles from "../assets/styles/components/GlobalMsg.module.css";
import { useGlobalMsgContext } from "../contexts/GlobalMsgContext";

function GlobalMsg() {
    const { msg } = useGlobalMsgContext();

    return msg ? <div className={styles.main}>{msg}</div> : null;
}

export default GlobalMsg;
