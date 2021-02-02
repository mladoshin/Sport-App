function is_touchable() {
    return 'ontouchstart' in window;
}

export default is_touchable