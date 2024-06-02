import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Lookup() {

    const [code, setCode] = useState("");
    const [email, setEmail] = useState("");
    const [isValidFormat, setIsValidFormat] = useState<{type: "email" | "code" | "", valid: boolean}>({type: "", valid: false});
    const [isValidCode, setIsValidCode] = useState<{type: "email" | "code" | "", valid: boolean, value?: string}>({type: "", valid: false});
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        if (!isValidFormat.valid) {
            setTimeout(()=>{
                setIsValidFormat({type: "", valid: true});
            }, 1500)
        }
    }, [isValidFormat])

    useEffect(()=>{
        if (isValidCode.valid) {
            setTimeout(()=>{
                if (isValidCode.type === 'code') {
                    navigate(`/quizzer/${isValidCode.value}`)
                } else {
                    navigate(`/users/${isValidCode.value}`)
                }
                
            }, 1000)
            
        }
    }, [isValidCode, code, navigate])

    function handleInput(e:ChangeEvent<HTMLInputElement>) {
        setCode(e.target.value);
    }

    function handleEmailInput(e:ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value)
    }

    async function handleCodeClick() {
        const valid = /[a-zA-Z0-9]{20}/.test(code);
        if (valid) {
            axios.get("https://audio-quizlet.vercel.app/api/quizzes/"+code)
                .then(response => {
                    if (response.status === 200) {
                        setIsValidCode({type: "code", valid: true, value: code});
                    }
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setIsValidFormat({type: "code", valid: false});
                    } else if (error.response.status === 500) {
                        inputRef.current!.value = "Server Error";
                    }
                })
        } else {
            setIsValidFormat({type: "code", valid: false});
        }
        
    }

    async function handleEmailClick() {
        const valid = /[a-zA-Z0-9]{3,40}/.test(email) && /@/g.test(email) && /./g.test(email);
        if (valid) {
            axios.get(`https://audio-quizlet.vercel.app/api/findUser/${btoa(email)}`)
                .then(response => {
                    if (response.status === 200) {
                        setIsValidCode({type: 'email', valid: true, value: response.data});
                    }
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setIsValidFormat({type: "email", valid: false});
                    } else if (error.response.status === 500) {
                        inputRef.current!.value = "Server Error";
                    }
                })
        } else {
            setIsValidFormat({type: "email", valid: false});
        }
        
    }

    return (
        <section id="welcomeMenu" className="softCorner shadow flex vertical bgBackground fontPrimary pad2">
            <h2>Lookup by code:</h2>
            <form className="textInputWrapper" onSubmit={(e)=>{e.preventDefault(); handleCodeClick()}}>
                <input
                    type="text"
                    className={isValidFormat.valid || isValidFormat.type !== "code" ? "textInput" : "textInput invalid"}
                    name="codeInput"
                    placeholder="Quizlet Code..."
                    onInput={handleInput}
                    ref={inputRef}
                ></input>
                <p className="invalidText">Invalid Code</p>
                {isValidCode.valid && isValidCode.type === 'code' && <i className="fa-solid fa-check validText"></i>}
            </form>
            <button 
                id="submitBtn" 
                className="primaryBtn softCorner"
                onClick={handleCodeClick}>
                Lookup
            </button>
            <h2>Lookup by creator:</h2>
            <form className="textInputWrapper" onSubmit={(e)=>{e.preventDefault(); handleEmailClick()}}>
                <input
                    type="text"
                    className={isValidFormat.valid || isValidFormat.type !== "email" ? "textInput" : "textInput invalid"}
                    name="emailInput"
                    placeholder="Email address..."
                    onInput={handleEmailInput}
                    ref={emailRef}
                ></input>
                <p className="invalidText">No User Found</p>
                {isValidCode.valid && isValidCode.type === 'email' && <i className="fa-solid fa-check validText"></i>}
            </form>
            <button 
                id="submitBtn" 
                className="primaryBtn softCorner"
                onClick={handleEmailClick}>
                Lookup
            </button>
        </section>
    )
}