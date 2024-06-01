import { useEffect, useRef, useState } from "react"
import LogoLink from "./Logo"

interface ViewerLoginProps {
    login: (user: string, pass: string) => void
}

export default function ViewerLogin({login}: ViewerLoginProps) {
    
    const modalRef = useRef<HTMLDialogElement>(null)
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [hiddenPass, setHiddenPass] = useState(true);

    useEffect(()=>{
        modalRef.current?.showModal()
    }, [])

    const toggleVisibility = ()=>{
        setHiddenPass(prev => !prev)
    }

    const handleClick = ()=>{
        login(email, password);
    }

    return (
        <dialog id="viewerLogin" className="dialog softCorner" ref={modalRef}>
            <div className="dialogContent">
                <LogoLink tag={false}/>
                <h2 className="fontSecondary">Enter credentials to view responses</h2>
                <form onSubmit={(e)=>{e.preventDefault(); handleClick()}}>
                    <input
                        className="pad1 dialogInput softCorner bgBackground fontPrimary"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Admin email..."
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}
                        />
                    <div style={{width: '100%', position: 'relative'}}>
                        <input
                        required
                        type={hiddenPass ? "password" : "text"}
                        className="pad1 dialogInput softCorner bgBackground fontPrimary"
                        id="password"
                        name="password"
                        pattern="^[a-zA-Z0-9!@#%^&*]{4,16}$"
                        placeholder="Password..."
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                        />
                        <i id="peek" className="fa-solid fa-eye" onPointerDown={toggleVisibility} onPointerUp={toggleVisibility}></i>
                    </div>
                </form>
                <button onClick={handleClick} className="primaryBtn softCorner" style={{margin: '0 auto'}}>View Responses</button>
            </div>
        </dialog>
    )
}