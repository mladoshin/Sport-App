import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import MailIcon from '@material-ui/icons/Mail';

export default function MobileDrawer({ open, setOpen, menuItems, goToPage, handleMenuButtonClick }) {

    //function to toggle the drawer
    const toggleDrawer = (open) => {
        setOpen(open);
    };

    return (
        <Drawer anchor={"left"} open={open} onClose={() => toggleDrawer(false)}>
            <List>
                <ListItem>
                    <ListItemText>LOGO</ListItemText>
                </ListItem>

                {menuItems.map((menuItem, index) => {
                    return (
                        <ListItem button key={index} onClick={() => handleMenuButtonClick(menuItem.path)}>
                            <ListItemIcon>{menuItem.icon && <menuItem.icon/>}</ListItemIcon>
                            <ListItemText>{menuItem.title}</ListItemText>
                        </ListItem>
                    )
                })}
            </List>
        </Drawer>
    )
}