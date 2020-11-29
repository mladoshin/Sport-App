import React, {useState} from "react"
import firebase from '../firebase/firebase'
import { Typography, Button, CssBaseline, TextField, Container} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import NavBar from '../components/navigation/navbar';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    }
  }));

function ResetPage(props){
    const [email, setEmail] = useState("");
    const classes = useStyles();
    return(
        <React.Fragment>
            <NavBar/>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                    Reset Password
                    </Typography>
                    <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        autoFocus
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={(e)=>firebase.resetUserPassword(e, email)}
                    >
                        Reset
                    </Button>
                    </form>
                </div>
            </Container>
        </React.Fragment>
    );
}

export default ResetPage;