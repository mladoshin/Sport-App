import React from "react";
import {makeStyles} from "@material-ui/core/styles"
import { withRouter } from "react-router-dom";
import { Menu, MenuItem, Switch } from '@material-ui/core';
import firebase from '../../firebase/firebase'

const useStyles = makeStyles((theme) => ({
    menu: {
        position: "absolute", 
        right: 50, 
        top: 60
    }
  }));

function AccountMenu(props) {
    const clearReduxState = props.clearReduxState
    const setAccountAnchor = props.setAccountAnchor
    const setOpenProfile = props.setOpenProfile
    const accountAnchor = props.accountAnchor
    const theme = props.theme
    const setTheme = props.setTheme
    const classes = useStyles()

    const actions = {
        openProfile: "OPEN_PROFILE",
        switchTheme: "SET_THEME",
        logout: "LOGOUT"
    }

    function openProfile() {
        setAccountAnchor(null)
        setOpenProfile(true)
    }

    function switchTheme() {
        if (props.theme === "light") {
            setTheme("dark")
        } else {
            setTheme("light")
        }
    }

    function logout() {
        setAccountAnchor(null)
        setOpenProfile(true)
        clearReduxState()
        props.history.replace("/home")
        firebase.logout()
    }

    function handleClick(type) {
        if (type === actions.openProfile) {
            openProfile()
        } else if (type === actions.switchTheme) {
            switchTheme()
        } else if (type === actions.logout) {
            logout()
        }
    }

    return (
        <Menu
            id="simple-menu"
            anchorEl={accountAnchor}
            keepMounted
            open={Boolean(accountAnchor)}
            onClose={() => setAccountAnchor(null)}
            className={classes.menu}
        >
            <MenuItem onClick={() => handleClick(actions.openProfile)}>Profile</MenuItem>

            <MenuItem onClick={() => handleClick(actions.switchTheme)}>
                Dark Theme
                <Switch
                    checked={theme === "dark"}
                    name="checkedA"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            </MenuItem>

            <MenuItem onClick={() => handleClick(actions.logout)}>Log Out</MenuItem>
        </Menu>
    )
}

export default withRouter(AccountMenu);