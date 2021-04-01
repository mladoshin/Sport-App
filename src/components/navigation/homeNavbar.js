import React, {Suspense} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';


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
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4)
    } 
}));

function HomeNavbar(props) {
    const classes = useStyles();

    function openProfile() {
        let role = props.user.claims.role
        
        if (role == "ADMIN") {
            props.goToPage("/adminApp/profile")
        } else if (role == "COACH") {
            props.goToPage("/coachApp/coachId=" + props.user.uid + "/profile")
        } else if (role == "SPORTSMAN") {
            props.goToPage("/sportsmanApp/userId=" + props.user.uid + "/profile")
        }
    }

    function handleConsoleBtnClick() {
        if (props.user.claims.role == "COACH") {
            props.goToPage("/coachApp/coachId=" + props.user.uid)
        } else if (props.user.claims.role == "SPORTSMAN") {
            props.goToPage("/sportsmanApp/userId=" + props.user.uid)
        } else if (props.user.claims.role == "ADMIN") {
            props.goToPage("/adminApp")
        }
    }

    function ActionButton() {
        if (props.user.uid) {
            //render avatar (link to profile)
            return (
                <>
                    <Button color="inherit" onClick={handleConsoleBtnClick}>Console</Button>

                    <Suspense fallback={null}>
                        <IconButton onClick={openProfile}><Avatar alt="User" src={props.user.photoURL} className={classes.avatar}>{props.user.name}</Avatar></IconButton>
                    </Suspense>
                </>
            )
        }
        else {
            return (
                <Button color="inherit" onClick={() => props.goToPage("/sportsman-login")}>Login</Button>
            )
        }
    }

    return (
        <AppBar position="static">

            <Toolbar>
                {/*LOGO*/}
                <Typography variant="h4" style={{ color: "black", fontWeight: "600" }} onClick={() => props.goToPage("/")}>SportApp</Typography>

                {/*LINKS*/}
                <div style={{ flexGrow: 1, display: "flex", flexDirection: "row", padding: "0px 0px 0px 50px" }}>
                    <Typography variant="h5" style={{ width: 130, textAlign: "center" }}>About Us</Typography>
                    <Typography variant="h5" style={{ width: 130, textAlign: "center" }}>Contacts</Typography>
                </div>

                {/*LOGIN BUTTON*/}

                <ActionButton />
            </Toolbar>
        </AppBar>
    );
}

const mapStateToProps = state => {
    return {
      user: state.user
    }
}

export default connect(mapStateToProps, null)(HomeNavbar)