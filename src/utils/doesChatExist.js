const doesChatExist = (chats, recipientId) =>{
    console.log(chats)
    let res = chats?.docs.filter(chat => chat.data().memberIDs[0]===recipientId || chat.data().memberIDs[1]===recipientId)
    return res?.length ? true : false
}
export default doesChatExist
