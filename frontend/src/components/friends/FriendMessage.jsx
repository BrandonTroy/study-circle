import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import Chat from '../Chat';
import Tab from '../Tab';
import { useEffect } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { getCurrentUser } from '../../api/accountApi';
import { getFriend } from '../../api/usersApi';

const FriendMessage = ({ friendMessageId, setIsFriendMessageOpen, isMobile, style }) => {  
  const [friend, setFriend] = useState(null);
  const openProfile = useContext(ProfileContext);

  useEffect(() => {
    getCurrentUser().then(user => {
      getFriend(user.id, friendMessageId).then(data => setFriend(data));
    });
  }, [friendMessageId]);

  if (!friend) return null;
  console.log(friend);
  return (
    <Tab
      title={<span style={{ cursor: 'pointer' }} onClick={() => openProfile(friendMessageId)}>{friend.name}</span>}
      onReturn={isMobile ? () => setIsFriendMessageOpen(false) : undefined}
      onClose={isMobile ? undefined : () => setIsFriendMessageOpen(false)}
      style={style}
      padding='0'
    >
      <Chat id={friend.chatId} />
    </Tab>
  )
}

FriendMessage.propTypes = {
  friendMessageId: PropTypes.number.isRequired,
  setIsFriendMessageOpen: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  style: PropTypes.object
}

export default FriendMessage;