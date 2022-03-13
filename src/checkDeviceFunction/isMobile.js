const widthThreshold = 700
function isMobile() {
    const screenWidth = window.innerWidth
    
    if(screenWidth < widthThreshold){
        return true
    }
    return false
    
}

export default isMobile