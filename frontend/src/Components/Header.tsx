
import LightModeControl from './lightDark';
import LogoLink from './Logo';
// import NavMenu from './Nav';

export default function Header() {
    return (
        <>
            <LightModeControl />
            <LogoLink tag={true} />
            {/* <NavMenu /> */}
        </>
    )
}