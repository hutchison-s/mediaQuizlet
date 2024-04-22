import { Link } from "react-router-dom";

export default function Welcome() {
    return (
        <section id="welcomeMenu" className="softCorner flex vertical even bgBackground fontPrimary pad2 shadow">
            <div className="buttonBox"><Link to="/generator" className="softCorner buttonLink primaryBtn">Generate</Link><p>Create a new Quizlet to share in minutes!</p></div>
            <div className="buttonBox"><Link to="/lookup" className="softCorner buttonLink primaryBtn">Lookup</Link><p>Look up a Quizlet by its code</p></div>
        </section>
    )
}