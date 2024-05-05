import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Lookup() {

    const [code, setCode] = useState("");
    const [isValidFormat, setIsValidFormat] = useState(true);
    const [isValidCode, setIsValidCode] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        if (!isValidFormat) {
            setTimeout(()=>{
                setIsValidFormat(true);
            }, 1500)
        }
    }, [isValidFormat])

    useEffect(()=>{
        if (isValidCode) {
            setTimeout(()=>{
                navigate("/quizzer/"+code)
            }, 1000)
            
        }
    }, [isValidCode, code, navigate])

    function handleInput(e:ChangeEvent<HTMLInputElement>) {
        setCode(e.target.value);
    }

    async function handleClick() {
        const valid = /[a-zA-Z0-9]{20}/.test(code);
        if (valid) {
            axios.get("http://localhost:8000/api/quizzes/"+code)
                .then(response => {
                    if (response.status === 200) {
                        setIsValidCode(true);
                    }
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setIsValidFormat(false);
                    } else if (error.response.status === 500) {
                        inputRef.current!.value = "Server Error";
                    }
                })
        } else {
            setIsValidFormat(false);
        }
        
    }

    return (
        <section id="welcomeMenu" className="softCorner shadow flex vertical bgBackground fontPrimary pad2">
            <h2>Enter Quizlet Code:</h2>
            <div className="textInputWrapper">
                <input
                    type="text"
                    className={isValidFormat ? "textInput" : "textInput invalid"}
                    name="codeInput"
                    placeholder="Quizlet Code..."
                    onInput={handleInput}
                    ref={inputRef}
                ></input>
                <p className="invalidText">Invalid Code</p>
                {isValidCode && <i className="fa-solid fa-check validText"></i>}
            </div>
            <button 
                id="submitBtn" 
                className="primaryBtn softCorner"
                onClick={handleClick}>
                Lookup
            </button>
        </section>
    )
}