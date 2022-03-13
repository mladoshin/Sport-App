import { Menu, MenuItem, Menuitem, Typography } from "@material-ui/core"
import {withRouter} from "react-router"

function ChatInfoMenu({anchorEl, handleClose, deleteChat, history, chatId}) {
    const isOpen = Boolean(anchorEl)

    function handleMenuItemClick(route){
        history.replace("/chats/chatId="+chatId+"/"+route)
    }

    return (
        <Menu
            open={isOpen}
            anchorEl={anchorEl}
            id="chat-more-menu"
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'chat-more-menu-btn',
            }}
        >
            <MenuItem onClick={()=>handleMenuItemClick("chat-info")}>
                <Typography>Chat Info</Typography>
            </MenuItem>

            <MenuItem onClick={()=>handleMenuItemClick("chat-attachments")}>
                <Typography>Chat Attachments</Typography>
            </MenuItem>

            <MenuItem onClick={deleteChat}>
                <Typography>Delete chat</Typography>
            </MenuItem>

        </Menu >
    )
}

export default withRouter(ChatInfoMenu)
