import { PropTypes } from 'prop-types';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login, signup } from '../api/accountApi';


const Copyright = (props) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        StudyCircle
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const SignIn = ({ returningUser = true, setIsSignedIn }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    if (returningUser) {
      login({
        login: data.get('login'),
        password: data.get('password')
      }).then(data => {
        setIsSignedIn(true);
      }).catch(error => {
        console.error(error);
        window.alert("Invalid username or password");
      });
    } else {
      signup({
        first_name: data.get('firstName'),
        last_name: data.get('lastName'),
        username: data.get('username'),
        email: data.get('email'),
        password: data.get('password')
      }).then(response => {
        setIsSignedIn(true);
        console.log(response);
      }).catch(error => {
        console.error(error);
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {returningUser ? "Sign in" : "Sign up"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {returningUser &&
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Username or email address"
              name="login"
              autoComplete="email"
            />
          }
          {!returningUser &&
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="first-name"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="last-name"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </>
          }
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {returningUser ? "sign in" : "sign up"}
          </Button>
          <Grid container justifyContent="center">
            {returningUser &&
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            }
            <Grid item>
              <Link href={returningUser ? "/signup" : "/login"} variant="body2">
                {returningUser ? "Don't have an account? Sign Up" : "Already have an account? Sign in"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}

SignIn.propTypes = {
  returningUser: PropTypes.bool,
  setIsSignedIn: PropTypes.func.isRequired
}

export default SignIn;