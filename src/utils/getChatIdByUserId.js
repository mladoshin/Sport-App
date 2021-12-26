import firebase from "../firebase/firebase"

export const getChatIdByUserID = (recipientId, userChats) => {
    let chatId = null
    
    
    userChats.forEach(chat => {
        if(chat?.memberIDs?.indexOf(recipientId)!==-1 && chat?.memberIDs?.indexOf(firebase.getCurrentUserId())!==-1){
            chatId = chat.chatId
        }
    });

    let p = new Promise((resolve, reject) => {
        let error = {}
        firebase.fireDB.collection("users").doc(recipientId).get().then(snap => {
            if (!snap.exists){
                error.message = "The user doesn't exist!"
            }
        }).finally(()=> {
            resolve({chatId: chatId, error})
        })
    })
    

    return p
}