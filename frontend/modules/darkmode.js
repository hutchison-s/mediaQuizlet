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
        "--background": "#fafcfc"
    }
}
const dark = {
    properties: {
        "--primary": "#fafcfc",
        "--primary-half": "#fafcfc55",
        "--secondary": "#e5e9f9",
        "--light-secondary": "cornflowerblue",
        "--background": "#09011c"
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