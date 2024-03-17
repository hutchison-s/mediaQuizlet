// Function to set root styles based on given style object
const setRootStyles = (styleObject) => {
    for (let key in styleObject.properties) {
        document.documentElement.style.setProperty(key, styleObject.properties[key]);
    }
}

// Style objects for light and dark modes
const light = {
properties: {
        "--primary": "#09011c",
        "--primary-half": "#09011c55",
        "--secondary": "cornflowerblue",
        "--light-secondary": "#e5e9f9",
        "--background": "#fafcfc",
        "--texture": "linear-gradient(83deg, rgba(239,242,237, 0.2) 0%, rgba(239,242,237, 0.2) 16.667%,rgba(197,212,219, 0.15) 16.667%, rgba(197,212,219, 0.15) 33.334%,rgba(232,233,242, 0.2) 33.334%, rgba(232,233,242, 0.2) 50.001%,rgba(255,255,255, 0.2) 50.001%, rgba(255,255,255, 0.2) 66.668%,rgba(179,180,188, 0) 66.668%, rgba(179,180,188, 0) 83.335%,rgba(254,255,255, 0.71) 83.335%, rgba(254,255,255, 0.71) 100.002%),linear-gradient(22.5deg, rgba(239,242,237, 0.2) 0%, rgba(239,242,237, 0.2) 16.667%,rgba(197,212,219, 0.15) 16.667%, rgba(197,212,219, 0.15) 33.334%,rgba(232,233,242, 0.2) 33.334%, rgba(232,233,242, 0.2) 50.001%,rgba(255,255,255, 0.2) 50.001%, rgba(255,255,255, 0.2) 66.668%,rgba(179,180,188, 0) 66.668%, rgba(179,180,188, 0) 83.335%,rgba(254,255,255, 0.71) 83.335%, rgba(254,255,255, 0.71) 100.002%),linear-gradient(157.5deg, rgba(239,242,237, 0.2) 0%, rgba(239,242,237, 0.2) 16.667%,rgba(197,212,219, 0.15) 16.667%, rgba(197,212,219, 0.15) 33.334%,rgba(232,233,242, 0.2) 33.334%, rgba(232,233,242, 0.2) 50.001%,rgba(255,255,255, 0.2) 50.001%, rgba(255,255,255, 0.2) 66.668%,rgba(179,180,188, 0) 66.668%, rgba(179,180,188, 0) 83.335%,rgba(254,255,255, 0.71) 83.335%, rgba(254,255,255, 0.71) 100.002%),linear-gradient(173deg, rgba(224,231,240, 0.2),rgba(231,231,240, 0.2))",
        "--sidebar": "repeating-linear-gradient(112.5deg, rgba(244,250,255, 0.3333333333333333) 0px, rgba(244,250,255, 0.3333333333333333) 0px,transparent 0px, transparent 1px,rgba(244,250,255, 0.3333333333333333) 1px, rgba(244,250,255, 0.3333333333333333) 4px,transparent 4px, transparent 5px,rgba(244,250,255, 0.3333333333333333) 5px, rgba(244,250,255, 0.3333333333333333) 8px),repeating-linear-gradient(0deg, rgba(244,250,255, 0.3333333333333333) 0px, rgba(244,250,255, 0.3333333333333333) 0px,transparent 0px, transparent 1px,rgba(244,250,255, 0.3333333333333333) 1px, rgba(244,250,255, 0.3333333333333333) 4px,transparent 4px, transparent 5px,rgba(244,250,255, 0.3333333333333333) 5px, rgba(244,250,255, 0.3333333333333333) 8px),linear-gradient(135deg, rgb(229,233,249),rgba(94,109,135, 0.44))"
    }
}
const dark = {
    properties: {
        "--primary": "#fafcfc",
        "--primary-half": "#fafcfc55",
        "--secondary": "#e5e9f9",
        "--light-secondary": "cornflowerblue",
        "--background": "#09011c",
        "--texture": "linear-gradient(94deg, rgba(11,12,11, 0.34) 0%, rgba(11,12,11, 0.34) 16.667%,rgba(20,25,34, 0.6) 16.667%, rgba(20,25,34, 0.6) 33.334%,rgba(1,2,3, 0.49) 33.334%, rgba(1,2,3, 0.49) 50.001%,rgba(42,35,35, 0.4) 50.001%, rgba(42,35,35, 0.4) 66.668%,rgba(47,50,69, 0.38) 66.668%, rgba(47,50,69, 0.38) 83.335%,rgba(31,31,38, 0.93) 83.335%, rgba(31,31,38, 0.93) 100.002%),linear-gradient(22.5deg, rgba(11,12,11, 0.34) 0%, rgba(11,12,11, 0.34) 16.667%,rgba(20,25,34, 0.6) 16.667%, rgba(20,25,34, 0.6) 33.334%,rgba(1,2,3, 0.49) 33.334%, rgba(1,2,3, 0.49) 50.001%,rgba(42,35,35, 0.4) 50.001%, rgba(42,35,35, 0.4) 66.668%,rgba(47,50,69, 0.38) 66.668%, rgba(47,50,69, 0.38) 83.335%,rgba(31,31,38, 0.93) 83.335%, rgba(31,31,38, 0.93) 100.002%),linear-gradient(157.5deg, rgba(11,12,11, 0.34) 0%, rgba(11,12,11, 0.34) 16.667%,rgba(20,25,34, 0.6) 16.667%, rgba(20,25,34, 0.6) 33.334%,rgba(1,2,3, 0.49) 33.334%, rgba(1,2,3, 0.49) 50.001%,rgba(42,35,35, 0.4) 50.001%, rgba(42,35,35, 0.4) 66.668%,rgba(47,50,69, 0.38) 66.668%, rgba(47,50,69, 0.38) 83.335%,rgba(31,31,38, 0.93) 83.335%, rgba(31,31,38, 0.93) 100.002%),linear-gradient(184deg, rgba(9,9,9, 0.55),rgba(14,14,14, 0.79))",
        "--sidebar": "repeating-linear-gradient(112.5deg, rgba(9,22,63, 0.3333333333333333) 0px, rgba(9,22,63, 0.3333333333333333) 0px,transparent 0px, transparent 1px,rgba(9,22,63, 0.3333333333333333) 1px, rgba(9,22,63, 0.3333333333333333) 4px,transparent 4px, transparent 5px,rgba(9,22,63, 0.3333333333333333) 5px, rgba(9,22,63, 0.3333333333333333) 8px),repeating-linear-gradient(0deg, rgba(9,22,63, 0.3333333333333333) 0px, rgba(9,22,63, 0.3333333333333333) 0px,transparent 0px, transparent 1px,rgba(9,22,63, 0.3333333333333333) 1px, rgba(9,22,63, 0.3333333333333333) 4px,transparent 4px, transparent 5px,rgba(9,22,63, 0.3333333333333333) 5px, rgba(9,22,63, 0.3333333333333333) 8px),linear-gradient(135deg, rgb(115,144,168),rgb(6,6,28))"
    }
}


// Function to toggle between light and dark modes
const changeMode = () => {
    let setting = localStorage.getItem("quizDarkMode")
    let isLightMode = setting ? JSON.parse(setting).isLightMode : true;
    if (isLightMode) {
        setRootStyles(dark)
    } else {
        setRootStyles(light)
    }
    isLightMode = !isLightMode;
    localStorage.setItem("quizDarkMode", JSON.stringify({isLightMode: isLightMode}))
};

const setInitialStyle = () => {
    let setting = localStorage.getItem("quizDarkMode")
    if (setting) {
        let isLightMode = JSON.parse(setting).isLightMode;
        if (isLightMode) {
            setRootStyles(light)
        } else {
            setRootStyles(dark)
        } 
    } else {
        setRootStyles(light)
        localStorage.setItem("quizDarkMode", JSON.stringify({isLightMode: true}))
    }

}


export {changeMode, setInitialStyle};