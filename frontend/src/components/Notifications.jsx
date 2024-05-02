import { PropTypes } from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { Box, List, Typography, ListItemButton, Avatar, Button, Divider } from '@mui/material';
import Tab from './Tab';
import ProfileContext from '../contexts/ProfileContext';
import { formatDuration } from '../utils/formatTime';
import { getCurrentUser } from '../api/accountApi';
import { acceptRequest } from '../api/usersApi';
import { getNotifications } from '../api/notificationsApi';

const Notifications = ({ setIsNotificationsOpen, style }) => {
  const [loggedInUser, setLoggedInUser] = useState({});
  const openProfile = useContext(ProfileContext);
  const [friendRequests, setFriendRequests] = useState([]);

  function fetchNotifications() {
    getCurrentUser().then(user => {
      setLoggedInUser(user);
      getNotifications(user.id).then(data => setFriendRequests(data));
    });
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const [todayRequests, last7DaysRequests, olderRequests] = friendRequests.reduce((acc, request) => {
    const days = Math.floor((new Date() - new Date(request.requestTime)) / (1000 * 60 * 60 * 24));
    if (days === 0) acc[0].push(request);
    else if (days <= 7) acc[1].push(request);
    else if (days > 7) acc[2].push(request);
    return acc;
  }, [[], [], []]);

  const sections = [
    ["Today", todayRequests],
    ["Last 7 days", last7DaysRequests],
    ["Older", olderRequests]
  ]

  function renderRequestList(name, requests, index) {
    if (requests.length == 0) return null;
    return (
      <Box key={index}>
        <Typography variant="h6" mb={0}>{name}</Typography>
        {requests.map((request, index) => (
          <ListItemButton
            key={index}
            sx={{ mx: '-2rem', px: '2rem' }}
            disableGutters
            disableRipple
            onClick={() => openProfile(request.id)}
          >
            <Avatar alt={request.name} src={request.avatar} />
            <Box flex={1} mx={2} lineHeight='1.3rem'>
              <span style={{ fontWeight: '500' }}>{request.username}</span> sent you a friend request.&nbsp;
              <span style={{ color: 'grey' }}>{formatDuration(new Date(request.requestTime))}</span>
            </Box>
            <Button
              variant='contained'
              color='primary'
              disabled={request.status}
              sx={{
                width: '6em',
                fontSize: '1rem',
                textTransform: 'none',
                padding: '0.1rem'
              }}
              onClick={event => {
                event.stopPropagation();
                const requestIndex = friendRequests.findIndex(fr => fr.id === request.id);
                setFriendRequests(prevRequests => {
                  const newRequests = [...prevRequests];
                  newRequests[requestIndex].status = true;
                  return newRequests;
                });
                acceptRequest(loggedInUser.id, request.id);
              }}
            >
              {request.status ? 'Accepted' : 'Accept'}
            </Button>
          </ListItemButton>
        ))}
        {index !== sections.length - 1 && <Divider sx={{ mt: 2, mb: 1 }} />}
      </Box>  
    );
  }

  return (
    <Tab
      title='Notifications'
      padding='0.5rem 2rem 1rem'
      onClose={() => setIsNotificationsOpen(false)}
      style={style}
      dontOffsetScrollbarPadding
    >
      <List disablePadding>
        {friendRequests.length > 0 &&
          sections.map(([name, requests], index) => renderRequestList(name, requests, index))
        }
        {friendRequests.length === 0 &&
          <Typography color='grey' textAlign='center' sx={{ mt: 1 }}>No Notifications</Typography>
        }
      </List>
    </Tab>
  );
}

Notifications.propTypes = {
  setIsNotificationsOpen: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default Notifications;