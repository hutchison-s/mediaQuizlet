import LogoLink from "../Components/Logo";

export default function PageNotFound() {
    return (
        <section style={{position: "fixed", top: '50%', left: '50%', translate: '-50% -50%', textAlign: 'center'}}>
            <LogoLink tag={false} />
            <h1 style={{color: "var(--secondary)"}}>Ope...</h1>
            <h2 style={{color: "var(--primary)"}}>That page doesn't exist.</h2>
        </section>
        

    )
}