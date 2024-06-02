import { Link } from 'react-router-dom';
import './Logo.css';

interface LogoProps {
    tag: boolean
}

export default function LogoLink({tag}: LogoProps) {

    return (
        tag
        ?   <div>
                <h1 className="logoHeading"><Link to="/"><i className="fa-solid fa-circle-play logoIcon"></i>Media&nbsp;Quizlet</Link></h1>
                <p className='logoTag'>Elevate your quizzes with media customization - Media Quizlet makes it effortless.</p>
            </div>
        :   <h1 className="logoHeading"><Link to="/"><i className="fa-solid fa-circle-play logoIcon"></i>Media&nbsp;Quizlet</Link></h1>
    )
}