import Header from "../Components/Header";
import '../index.css'

export default function PageNotFound() {
    return (
        <>
            <Header />
            <section style={{position: "fixed", top: '50%', left: '50%', translate: '-50% -50%', textAlign: 'center'}}>
                <h1 style={{color: "var(--secondary)", fontSize: '3rem'}}>Ope...</h1>
                <h2 style={{color: "var(--primary)"}}>That page doesn't exist.</h2>
            </section>
        </>
        

    )
}