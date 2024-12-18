import styles from "../assets/styles/components/Footer.module.css";
import { Link } from "react-router-dom";
import { useColorContext } from "../contexts/ColorThemeContext";

function Footer() {
    const { color } = useColorContext();

    const name = process.env.REACT_APP_NAME;
    const email = process.env.REACT_APP_EMAIL;
    const phone = process.env.REACT_APP_PHONE;
    const location = process.env.REACT_APP_LOCATION;

    return (
        <footer className={`${styles.footer} ${color === "middle" ? styles.neutral : color === "end" ? styles.darkmode : ""}`}>
            <div>
                <section>
                    <div>
                        <h4>{name}</h4>
                        <div className={styles.firstSub}>
                            <Link>
                                <i className="fa-brands fa-linkedin"></i>
                            </Link>
                            <Link>
                                <i className="fa-brands fa-facebook"></i>
                            </Link>
                            <Link>
                                <i className="fa-brands fa-youtube"></i>
                            </Link>
                            <Link>
                                <i className="fa-brands fa-x-twitter"></i>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h4>Location</h4>
                        <p>{location}</p>
                    </div>
                    <div>
                        <h4>Work Inquiries</h4>
                        <div>
                            <p>
                                Email: <a href={`mailto:${email}`}>{email}</a>
                            </p>
                            <p>
                                Phone/WhatsApp:{" "}
                                <a href={`tel:${phone}`}>{phone}</a>
                            </p>
                        </div>
                    </div>
                </section>
                <section>
                    <div>© 2024, {name}. Made with passion</div>
                    <div>
                        <Link className={styles.legalLinks}>Privacy & Cookie Policy </Link>|
                        <Link className={styles.legalLinks}> Terms of Service</Link>
                    </div>
                </section>
            </div>
        </footer>
    );
}

export default Footer;
