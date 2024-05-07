import SideBar from '../Components/GeneratorComponents/Sidebar';
import './Generator.css';
import {ItemsProvider} from '../Context/ItemsProvider';
import ItemCarousel from '../Components/GeneratorComponents/ItemCarousel';
import LightModeControl from '../Components/lightDark';



export default function Generator() {

    

    return (
        <>
            <main id="generatorBody">
                <LightModeControl />
                <ItemsProvider>
                    <SideBar />
                    <section id="genWindow">
                        <ItemCarousel />
                    </section>
                </ItemsProvider>
            </main>
            
        </>
        
    )
}