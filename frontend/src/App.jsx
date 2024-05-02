import { useEffect, useState } from 'react';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import FriendList from './components/friends/FriendList';
import FriendMessage from './components/friends/FriendMessage';
import Home from './components/home/Home';
import CircleList from './components/circles/CircleList';
import CircleView from './components/circles/CircleView';
import CircleContext from './contexts/CircleContext';
import ProfileContext from './contexts/ProfileContext';
import { getCurrentUser } from './api/accountApi';
import './styles/App.css';

import {
  AppBar,
  Toolbar,
  Grid,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  Box,
  Button,
  Hidden,
  // IconButton,  // TODO: leaving this here as a reminder to use later
  useMediaQuery,
  Popover
} from '@mui/material';

import {
  AccountCircle as AccountIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  ChatBubble as MessagesIcon,
  Animation as CirclesIcon
} from '@mui/icons-material';

import { useTheme } from '@mui/system';


const Tabs = {
  MESSAGES: 'messages',
  HOME: 'home',
  CIRCLES: 'circles',
};

const App = () => {
  // This will return information about our custom theme once it is configured
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktopThin = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktopWide = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Which tab is currently selected
  // for mobile view, whichever tab is set is the only content shown
  // for desktop thin view, tab is used to determine whether messages or circles are shown
  const [tab, setTab] = useState(Tabs.HOME);

  // Set the default tab to be the circles tab for desktop thin view
  useEffect(() => {
    setTab(isDesktopThin ? Tabs.CIRCLES : Tabs.HOME);
  }, [isDesktopThin]);

  // The currently logged in user
  const [loggedInUser, setLoggedInUser] = useState({});
  useEffect(() => {
    getCurrentUser().then(user => {
      setLoggedInUser(user);
    });
  }, []);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileId, setProfileId] = useState(0);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  // Opens a user's profile
  function openProfile(id) {
    setProfileId(id);
    setIsProfileOpen(true);
  }

  // Called when the notifications button in the app bar is clicked
  function handleNotificationsClick(event) {
    setIsNotificationsOpen(true);
    setNotificationsAnchorEl(event.currentTarget);
  }

  // Called when the user profile button in the app bar is clicked
  function handleProfileClick(event) {
    setProfileAnchorEl(event.currentTarget);
  }

  const [isFriendMessageOpen, setIsFriendMessageOpen] = useState(false);
  const [friendId, setFriendId] = useState(0);

  const [isCircleViewOpen, setIsCircleViewOpen] = useState(false);
  const [circleId, setCircleMessageId] = useState(0);

  function openCircle(id) {
    setCircleMessageId(id);
    setIsCircleViewOpen(true);
  }

  // Close the other views when a message is opened
  useEffect(() => {
    if (!isFriendMessageOpen) return;
    setIsCircleViewOpen(false);
    setIsProfileOpen(false);
  }, [isFriendMessageOpen]);

  // Close the other views when a circle is opened
  useEffect(() => {
    if (!isCircleViewOpen) return;
    setIsFriendMessageOpen(false);
    setIsProfileOpen(false);
  }, [isCircleViewOpen]);

  // Close the other views when a profile is opened
  useEffect(() => {
    if (!isProfileOpen) return;
    setIsFriendMessageOpen(false);
    setIsCircleViewOpen(false);
  }, [isProfileOpen]);

  return (
    <ProfileContext.Provider value={openProfile}>
      <CircleContext.Provider value={openCircle}>
        <Box className='app'>
          {/* Top bar, always rendered */}
          <AppBar position='sticky'>
            <Toolbar>
              {isDesktopThin &&
                (tab === Tabs.CIRCLES ?
                  <Button className='nav-btn' onClick={() => setTab(Tabs.MESSAGES)}> <MessagesIcon fontSize='large' /> </Button>
                : <Button className='nav-btn' onClick={() => setTab(Tabs.CIRCLES)}> <CirclesIcon fontSize='large' /> </Button>
                )
              }
              
              <Box display='flex' flex={1}>
                <Button className='nav-btn' onClick={handleNotificationsClick}>
                  <NotificationsIcon fontSize='large' />
                  <Hidden smDown only='md'> <Typography>Notifications</Typography> </Hidden>
                </Button>      
              </Box>

              <Typography variant='h5' flex={1} textAlign='center'>StudyCircle</Typography>

              <Box display='flex' flex={1} justifyContent='flex-end'>
                <Button className='nav-btn' onClick={handleProfileClick}>
                  <Hidden smDown> <Typography>@{loggedInUser.username}</Typography> </Hidden>
                  <AccountIcon fontSize='large' />
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          
          {/* Notifications popup */}
          <Popover
            id='notifications-popover'
            open={isNotificationsOpen}
            anchorEl={notificationsAnchorEl}
            onClose={() => setIsNotificationsOpen(false)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            slotProps={{ paper: { style: theme.popup } }}
          >
            <Notifications setIsNotificationsOpen={setIsNotificationsOpen} style={{ maxHeight: 'min(90vh, 40rem)' }} />
          </Popover>

          {/* Profile popup */}
          <Popover
            id='profile-popover'
            open={Boolean(profileAnchorEl)}
            anchorEl={profileAnchorEl}
            onClose={() => setProfileAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{ paper: { style: theme.popup } }}
          >
            {loggedInUser.id !== undefined &&
              <Profile
                profileId={loggedInUser.id}
                loggedInUser
                setIsProfileOpen={setProfileAnchorEl}
                style={{ maxHeight: 'min(90vh, 40rem)' }}
              />
            }
          </Popover>

          {/* This is how the content will be rendered on mobile */}
          {isMobile &&
            <Box className='column'>
              {isProfileOpen && <Profile profileId={profileId} setIsProfileOpen={setIsProfileOpen} />}
              {!isProfileOpen && tab === Tabs.HOME && <Home />}
              {!isProfileOpen && tab === Tabs.MESSAGES &&
                (isFriendMessageOpen ?
                  <FriendMessage
                    friendMessageId={friendId}
                    setIsFriendMessageOpen={setIsFriendMessageOpen}
                    isMobile
                  />
                  : <FriendList
                    isFriendMessageOpen={isFriendMessageOpen}
                    setIsFriendMessageOpen={setIsFriendMessageOpen}
                    friendMessageId={friendId}
                    setFriendMessageId={setFriendId}
                  />
                )
              }
              {!isProfileOpen && tab === Tabs.CIRCLES &&
                (isCircleViewOpen ?
                  <CircleView
                    openCircle={circleId}
                    setIsCircleOpen={setIsCircleViewOpen}
                  />
                  : <CircleList
                    isCircleMessageOpen={isCircleViewOpen}
                    setIsCircleMessageOpen={setIsCircleViewOpen}
                    circleMessageId={circleId}
                    setCircleMessageId={setCircleMessageId}
                  />
                )
              }
            </Box>
          }

          {/* This is how the content will be rendered on desktop thin */}
          {isDesktopThin &&
            <Grid className='grid' container>
              <Grid className='column' item xs={5}>
                {
                  tab === Tabs.MESSAGES ?
                    <FriendList
                      isFriendMessageOpen={isFriendMessageOpen}
                      setIsFriendMessageOpen={setIsFriendMessageOpen}
                      friendMessageId={friendId}
                      setFriendMessageId={setFriendId}
                    />
                  :
                    <CircleList
                      isCircleMessageOpen={isCircleViewOpen}
                      setIsCircleMessageOpen={setIsCircleViewOpen}
                      circleMessageId={circleId}
                      setCircleMessageId={setCircleMessageId}
                    />
                }
              </Grid>
              <Grid className='column' item xs={7} sx={{ borderLeft: '1px solid darkgrey' }}>
                {
                  isFriendMessageOpen ?
                    <FriendMessage
                      friendMessageId={friendId}
                      setIsFriendMessageOpen={setIsFriendMessageOpen}
                    />
                  : isCircleViewOpen ?
                    <CircleView
                      openCircle={circleId}
                      setIsCircleOpen={setIsCircleViewOpen}
                  />
                  : isProfileOpen ? <Profile profileId={profileId} setIsProfileOpen={setIsProfileOpen} />
                  : <Home />
                }
              </Grid>
            </Grid>
          }
          
          {/* This is how the content will be rendered on desktop wide */}
          {isDesktopWide &&
            <Grid className='grid' container>
              <Grid className='column' item xs={3}>
                <FriendList
                  isFriendMessageOpen={isFriendMessageOpen}
                  setIsFriendMessageOpen={setIsFriendMessageOpen}
                  friendMessageId={friendId}
                  setFriendMessageId={setFriendId}
                />
              </Grid>

              <Grid className='column' item xs={6} sx={{ borderWidth: '0 1px', borderStyle: 'solid', borderColor: 'darkgrey' }}>
                {
                  isFriendMessageOpen ?
                  <FriendMessage
                    friendMessageId={friendId}
                    setIsFriendMessageOpen={setIsFriendMessageOpen}
                  />
                  : isCircleViewOpen ?
                  <CircleView
                    openCircle={circleId}
                    setIsCircleOpen={setIsCircleViewOpen}
                  />
                  : isProfileOpen ? <Profile profileId={profileId} setIsProfileOpen={setIsProfileOpen} />
                  : <Home />
                }
              </Grid>

              <Grid className='column' item xs={3}>
                <CircleList
                  isCircleMessageOpen={isCircleViewOpen}
                  setIsCircleMessageOpen={setIsCircleViewOpen}
                  circleMessageId={circleId}
                  setCircleMessageId={setCircleMessageId}
                />
              </Grid>
            </Grid>
          }
          
          {/* Bottom bar, only rendered only on mobile */}
          {isMobile &&
            <Paper sx={{ position: 'sticky', top: 'auto', bottom: 0, left: 0, right: 0}} elevation={3}>
              <BottomNavigation
                showLabels
                value={tab}
                onChange={(event, newTab) => {
                  setTab(newTab);
                }}
              >
                <BottomNavigationAction label="Messages" value="messages" icon={<MessagesIcon />} />
                <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Circles" value="circles" icon={<CirclesIcon />} />
              </BottomNavigation>
            </Paper>
          }
        </Box>
      </CircleContext.Provider>
    </ProfileContext.Provider>
  )
}

export default App;
