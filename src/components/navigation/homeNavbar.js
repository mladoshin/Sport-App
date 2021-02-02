import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function HomeNavbar(props) {
    const classes = useStyles();

    return (
        <AppBar position="static">
            
            <Toolbar>
                {/*LOGO*/}
                <Typography variant="h4" style={{color: "black", fontWeight: "600"}} onClick={()=>props.goToPage("/")}>SportApp</Typography>

                {/*LINKS*/}
                <div style={{ flexGrow: 1, display: "flex", flexDirection: "row", padding: "0px 0px 0px 50px" }}>
                    <Typography variant="h5" style={{width: 130, textAlign: "center"}}>About Us</Typography>
                    <Typography variant="h5" style={{width: 130, textAlign: "center"}}>Contacts</Typography>
                </div>

                {/*LOGIN BUTTON*/}
                <Button color="inherit" onClick={()=>props.goToPage("/sportsman-login")}>Login</Button>
            </Toolbar>
        </AppBar>
    );
}