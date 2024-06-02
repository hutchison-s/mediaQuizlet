
import LightModeControl from './lightDark';
import LogoLink from './Logo';

export default function Header() {
    return (
        <>
            <LightModeControl />
            <LogoLink tag={true} />
        </>
    )
}