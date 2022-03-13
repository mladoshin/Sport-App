const getRecipient = (membersInfo, uid) => {
    return membersInfo?.filter(memberInfo => memberInfo.uid !== uid)
}

export default getRecipient  