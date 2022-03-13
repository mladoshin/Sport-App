const isMessageALink = (text) => {
    let url;

    try {
        url = new URL(text);
    } catch (err) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export default isMessageALink