const getSenderPhotoURL = (membersInfo, senderId) => {
    return membersInfo?.filter(memberInfo => memberInfo.uid === senderId)[0]?.photoURL
}

export default getSenderPhotoURL