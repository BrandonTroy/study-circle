import { PropTypes } from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { Box, Button, Divider } from '@mui/material';
import Tab from './Tab';
import User from './user/User';
import DropdownList from './DropdownList';
import UserList from './user/UserList';
import { logout } from '../api/accountApi';
import CircleContext from '../contexts/CircleContext';
import { getProfile } from '../api/usersApi';

const Profile = ({ profileId, loggedInUser, setIsProfileOpen, style }) => {  
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const openCircle = useContext(CircleContext);

  // TODO: save the edited profile data to the backend
  function saveEdits() {
    setEditMode(false);
  }

  useEffect(() => {
    const fetchProfile = () => getProfile(profileId).then(profile => setProfile(profile));
    fetchProfile();
    const interval = setInterval(fetchProfile, 5000);
    return () => clearInterval(interval);
  }, [profileId]);
  
  if (!profile) return null;
  return (
    <Tab
      title={loggedInUser ? 'Profile' : profile.user.username}
      onClose={() => setIsProfileOpen(false)}
      padding='1rem 1rem 0'
      style={style}
    >
      <Box display='flex' alignItems='center' mb={1}>
        <User object={profile.user} />
        {loggedInUser &&
          <Box display='flex' gap={1}>
            <Button variant='outlined' onClick={() => editMode ? saveEdits() : setEditMode(true)}>
              {editMode ? 'Save' : 'Edit'}
            </Button>
            <Button
              variant='outlined'
              color='error'
              sx={{ ml: 'auto' }}
              onClick={() => editMode ? setEditMode(false) : logout().then(() => window.location.reload())}
            >
              {editMode ? 'Cancel' : 'Log out'}
            </Button>
          </Box>
        }
      </Box>
      <Divider />
      <Box display='flex' flexDirection='column' gap={1} overflow='auto' pt={1} pb='1rem' mx='-1rem' px='1rem'>
        <DropdownList
          title='Courses'
          titleVariant='h6'
          items={profile.courses || []}
          showCount
          startOpen
          disableRippleOnToggle
          disableRippleOnItems
          noItemsContent='No courses'
          renderItem={item => <Box py={0.5}>{item.name}</Box>}
          onClickItem={item => console.log("clicked on course", item.name)}
        />
        <DropdownList
          title='Circles'
          titleVariant='h6'
          items={profile.circles || []}
          showCount
          startOpen
          disableRippleOnToggle
          disableRippleOnItems
          noItemsContent='No public circles'
          renderItem={item => <Box py={0.5}>{item.name}</Box>}
          onClickItem={item => { openCircle(item.id); console.log(item) }}
        />
        <UserList
          title='Friends'
          users={profile.friends || []}
          disableRippleOnToggle
          startOpen
        />
      </Box>
    </Tab>
  );
}

Profile.propTypes = {
  profileId: PropTypes.number.isRequired,
  setIsProfileOpen: PropTypes.func.isRequired,
  loggedInUser: PropTypes.bool,
  style: PropTypes.object
};

export default Profile;