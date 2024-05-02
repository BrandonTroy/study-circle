import { Box, Grid, List, ListItem, ListItemText, Avatar, Divider, TextField, Fab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PropTypes from 'prop-types';
import ProfileContext from '../contexts/ProfileContext';
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { getCurrentUser } from '../api/accountApi';
import { getMessages, sendMessage } from '../api/chatsApi';
import { getUser } from '../api/usersApi';

/**
 * This component will fetch and render a message feed
 * @param {Number} id id of the friend or circle
 */
const Chat = ({ id }) => {
  const openProfile = useContext(ProfileContext);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesLengthRef = useRef(0);
  const messagesEndRef = useRef(null);
  
  // Function to fetch messages
  const fetchMessages = useCallback(async () => {
    const data = await getMessages(id);
    if (data.length === messagesLengthRef.current) return;
    const messagesWithUserDetails = await Promise.all(data.map(async message => {
      const user = await getUser(message.sender);
      return { ...message, name: user.name, avatar: user.avatar };
    }));
    setMessages(messagesWithUserDetails);
    messagesLengthRef.current = messagesWithUserDetails.length;
  }, [id, messagesLengthRef]);

  // Keeps the bottom most message in view
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => { 
    getCurrentUser().then(user => setLoggedInUser(user));
    
    // Fetch messages immediately
    fetchMessages();
  
    // Set up interval to fetch messages every 5 seconds
    const intervalId = setInterval(fetchMessages, 5000);
  
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchMessages]);

  useEffect(scrollToBottom, [messages]);

  function onSendClick() {
    const message = document.querySelector('textarea').value.trim();
    if (!message) return;
    document.querySelector('textarea').value = '';
    sendMessage(id, { sender: loggedInUser.id, content: message }).then(() => fetchMessages());
  }

  if (!loggedInUser) return null;
  return (
    <Box display="flex" flex={1} flexDirection="column" overflow='auto'>
      <Grid container overflow='auto'>
        {messages.map((message, index) => (
          <Grid item xs={12} key={index}>
            <List disablePadding>
              <ListItem key={index} ref={index === messages.length - 1 ? messagesEndRef : null}>
                <Grid
                  container
                  direction={message.sender === loggedInUser.id ? 'row-reverse' : 'row'}
                  style={{ textAlign: message.sender === loggedInUser.id ? 'right' : 'left' }}
                >
                  <Grid
                    item xs={12}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: 'inherit', cursor: 'pointer' }}
                    onClick={() => openProfile(message.sender)}
                  >
                    <Avatar alt={message.name} src={message.avatar} />
                    <ListItemText secondary={message.name} />
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText primary={message.content}></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText secondary={message.time}></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </Grid>
        ))}
        {messages.length === 0 && <Box sx={{ textAlign: 'center', mt: 2, flex: 1, color: 'grey' }}>No messages yet</Box>}
        {/* <div id="test" ref={messagesEndRef}></div> */}
      </Grid>

      <Divider sx={{ mt: 'auto' }} />

      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, p: 1, py: { md: 2 } }}>
        <TextField
          placeholder='Message'
          multiline
          maxRows={20}
          onInput={scrollToBottom}
          sx={{
            flexGrow: 1,
          }}
        />
        <Fab color="primary" aria-label="add" size="small" sx={{ mb: '0.5rem' }}><SendIcon onClick={onSendClick} /></Fab>
      </Box>
    </Box>
  )
}

Chat.propTypes = {
  id: PropTypes.number.isRequired
}

export default Chat;