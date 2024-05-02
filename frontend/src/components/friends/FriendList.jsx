import PropTypes from 'prop-types';
import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from '@mui/material';
import { useTheme, emphasize } from '@mui/material/styles';
import { ArrowForwardIos as ArrowIcon } from '@mui/icons-material';
import Tab from '../Tab';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../api/accountApi';
import { getFriends } from '../../api/usersApi';
import { formatDate } from '../../utils/formatTime';

// Lists all conversations
const FriendList = ({ isFriendMessageOpen, setIsFriendMessageOpen, friendMessageId, setFriendMessageId, style }) => {
  const theme = useTheme();
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    function fetchFriends() {
      getCurrentUser().then(user => {
        getFriends(user.id).then(data => setFriendList(data));
      });
    }

    fetchFriends();
    const interval = setInterval(fetchFriends, 5000);
    return () => clearInterval(interval);
  }, []);

  const openMessageView = (id) => {
    setIsFriendMessageOpen(true);
    setFriendMessageId(id);
  }

  return (
    <Tab title="Messages" style={style} padding='0'>
      <List disablePadding>
        {friendList.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem
              key={index}
              alignItems="flex-start"
              onClick={() => openMessageView(item.id)}
              sx={{
                alignItems: 'center',
                cursor: 'pointer',
                '--hover-color': emphasize(theme.palette.background.default, 0.05),
                '&:hover': {
                  backgroundColor: 'var(--hover-color)',
                  outline: '1px solid var(--hover-color)',
                },
                backgroundColor: isFriendMessageOpen && friendMessageId === item.id ? theme.palette.highlight.main + ' !important' : 'inherit',
                transition: 'background-color 0.1s',
              }}
            >
              <ListItemAvatar sx={{ m: 0 }}>
                <Avatar alt="Remy Sharp" src="AVATAR URL HERE" />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display='flex' gap='1rem' justifyContent='space-between' whiteSpace='nowrap'>
                    <Typography
                      fontWeight={500}
                      overflow='hidden'
                      textOverflow='ellipsis'
                      whiteSpace='nowrap'
                    >
                      {item.name}
                    </Typography>
                    <Typography variant='body2' color='grey' lineHeight='150%' display='flex' gap={1} alignItems='center' mr={-0.75}>
                      {item.lastMessage.send_datetime && formatDate(item.lastMessage.send_datetime)}
                      <ArrowIcon fontSize='inherit' sx={{ color: 'darkgrey' }} />
                    </Typography>
                  </Box>
                }
                secondary={
                  <span style={{
                    lineHeight: '1.3em',
                    height: '2.6em',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    marginBottom: '0.1rem'
                  }}>
                    {item.lastMessage.content || 'No messages'}
                  </span>
                }
              />
            </ListItem>
            {index < friendList.length - 1 && <Divider variant='middle' />}
          </React.Fragment>
        ))}
        {friendList.length === 0 && <Typography color='grey' textAlign='center' sx={{ mt: 2 }}>Add some friends and start messaging!</Typography>}
      </List>      
    </Tab>
  )
}

FriendList.propTypes = {
  isFriendMessageOpen: PropTypes.bool.isRequired,
  setIsFriendMessageOpen: PropTypes.func.isRequired,
  friendMessageId: PropTypes.number.isRequired,
  setFriendMessageId: PropTypes.func.isRequired,
  style: PropTypes.object
}


export default FriendList;