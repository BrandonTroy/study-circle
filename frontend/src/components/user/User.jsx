import { PropTypes } from "prop-types";
import { useEffect, useState } from "react";
import { Box, Avatar, ListItemText, Button } from '@mui/material';
import '../../styles/User.css';
import { getCurrentUser } from "../../api/accountApi";
import { getUser, getFriend, addFriend, removeFriend, acceptRequest, unsendRequest } from "../../api/usersApi";


const Action = {
  ADD: 'Add Friend',
  ACCEPT: 'Accept Request',
  UNSEND: 'Unsend Request',
  REMOVE: 'Remove Friend'
}

const User = ({ object, id, stacked, dontShowActionButton }) => {
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    function fetchFriend() {
      getCurrentUser().then(current => {
        setLoggedInUser(current);
        if (current.id === user.id) return;
        getFriend(current.id, user.id).then(connection => {
          if (!connection) return;
          setAction(connection.status ? Action.REMOVE : connection.sender === current.id ? Action.UNSEND : Action.ACCEPT);
        }).catch(() => setAction(Action.ADD));
      });
    }
    
    fetchFriend();
    const interval = setInterval(fetchFriend, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (object) setUser(object);
    else getUser(id).then(user => setUser(user));
  }, [id, object]);

  if (!user || !loggedInUser) return null;

  return (
    <Box display='flex' alignItems='center' gap={1} height='3rem' flex={1}>
      <Avatar alt={user.name} src={user.avatar} sx={{ mr: 0.5 }} />
      {
        stacked ? 
        <ListItemText
          primary={user.name}
          secondary={<span style={{ display: 'block', marginTop: -4 }}>{'@' + user.username}</span>}
        />
        :
        <Box lineHeight='1.2rem'>
          <span>{user.name}&nbsp;</span>
          <span style={{ color: 'grey' }}>{' @' + user.username}</span>
        </Box> 
      }
      {action !== null && !dontShowActionButton &&
        <Button
          variant='outlined'
          color={action === Action.ADD || action === Action.ACCEPT ? 'primary' : 'error'}
          sx={{ ml: 'auto' }}
          onClick={event => {
            event.stopPropagation();
            (
              action == Action.ADD ? addFriend :
              action == Action.ACCEPT ? acceptRequest :
              action == Action.UNSEND ? unsendRequest :
              removeFriend
            )(loggedInUser.id, user.id).then(() => {
              if (action === Action.ADD) setAction(Action.UNSEND);
              else if (action === Action.ACCEPT) setAction(Action.REMOVE);
              else if (action === Action.UNSEND) setAction(Action.ADD);
              else if (action === Action.REMOVE) setAction(Action.ADD);
            });
          }}
        >
          {action}
        </Button>
      }
    </Box>
  );
}

User.propTypes = {
  object: PropTypes.object,
  id: PropTypes.number,
  stacked: PropTypes.bool,
  dontShowActionButton: PropTypes.bool,
};

export default User;