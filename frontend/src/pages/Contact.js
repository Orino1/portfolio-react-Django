import "../assets/styles/style.css";
import styles from "../assets/styles/pages/Contact.module.css";
import { Helmet } from "react-helmet";

function Contact() {
    const email = process.env.REACT_APP_EMAIL;
    const phone = process.env.REACT_APP_PHONE;

    return (
        <>
            <Helmet>
                <title>Contact</title>
            </Helmet>
            <div className={styles.container}>
                <div className={`${styles.header} maxMainContainer`}>
                    <div className="maxSubContainer">
                        <h1>Contact</h1>
                        <p>
                            I’m here to assist with any inquiries or projects
                            you may have. Feel free to reach out, and I’ll get
                            back to you within a couple of hours.
                        </p>
                        <a href={`mailto:${email}`}>Send an email</a>
                    </div>
                </div>
                <div className={`${styles.content} maxMainContainer`}>
                    <div className={`${styles.subContent} maxSubContainer`}>
                        <div>
                            <i className="fa-solid fa-message"></i>
                            <h3>Get in touch</h3>
                            <p>Work and general inquiries</p>
                            <a href={`mailto:${email}`}>{email}</a>
                            <a href={`tel:${phone}`}>{phone}</a>
                        </div>
                        <div>
                            <i className="fa-regular fa-clock"></i>
                            <h3>Availability hours</h3>
                            <p>Monday – Friday</p>
                            <p>9 am to 5 pm GMT+2</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;
