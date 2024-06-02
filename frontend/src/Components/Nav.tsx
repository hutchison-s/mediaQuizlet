import { Link } from "react-router-dom";

export default function NavMenu() {
    return (
        <ul className="flex even wrap">
            <Link to="/">
                <li>Home</li>
            </Link>
            <Link to="/generator">
                <li>Generator</li>
            </Link>
            <Link to="/lookup">
                <li>Look Up</li>
            </Link>
            <Link to="/quizzer">
                <li>Quizzer</li>
            </Link>
            <Link to="Viewer">
                <li>Viewer</li>
            </Link>
        </ul>
    )
}