const widthThreshold = 700
function is_touchable() {
    const screenWidth = window.innerWidth
    
    if(screenWidth < widthThreshold){
        return true
    }
    return false
    
}

export default is_touchable