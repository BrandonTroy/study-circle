import { Typography, Container, AppBar, Toolbar, IconButton, /*Tabs, Tab*/ } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Landing = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton>
            <MenuIcon fontSize='medium' sx={{ color: 'white' }} />
          </IconButton>
          {/* <Container sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}> */}
            <Typography variant="h6">StudyCircle</Typography>
            {/* <Tabs>
              <Tab label="Home" />
              <Tab label="About" />
              <Tab label="Contact" />
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs> */}
          {/* </Container> */}
        </Toolbar>
      </AppBar>
      
      <main>
        <Container sx={{
          textAlign: "center"
        }}>
          <Typography variant="h1">StudyCircle</Typography>
          <Typography variant="h2">StudyCircle</Typography>
          <Typography variant="h3">StudyCircle</Typography>
          <Typography variant="h4">StudyCircle</Typography>
          <Typography variant="h5">StudyCircle</Typography>
          <Typography variant="h6">StudyCircle</Typography>
          <Typography variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea assumenda, saepe ducimus, suscipit facere perspiciatis labore dignissimos ad officia eum nulla temporibus aliquid! Consequuntur unde dicta sunt, neque nulla rerum?</Typography>
          <Typography variant="body2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores molestias ab laboriosam quod voluptatem minima esse perspiciatis beatae nesciunt. Praesentium nihil aliquid velit explicabo ipsam! Tempora quia velit odio rerum.</Typography>
        </Container>
      </main>
    </>
  );
}

export default Landing;