import { PropTypes } from "prop-types";
import { useState, useEffect } from "react";
import { Box, Typography, Switch, Button, Divider } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PublicIcon from '@mui/icons-material/Public';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import LogoutIcon from '@mui/icons-material/Logout';
import UserList from '../user/UserList';
import { getCircle, getCircleMembers } from "../../api/circlesApi";
import { getCurrentUser } from "../../api/accountApi";

/**
 * This component will fetch and render the circle profile
 * @param {Number} id id of the circle
 */
const CircleProfile = ({ id }) => {
  const [circle, setCircle] = useState(null);
  const [circleMembers, setCircleMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  function fetchCircle(id) {
    getCircle(id).then(data => setCircle(data));
    getCircleMembers(id).then(data => setCircleMembers(data));
  }

  useEffect(() => {
    getCurrentUser().then(data => setCurrentUser(data));
    fetchCircle(id);
    const interval = setInterval(() => fetchCircle(id), 5000);
    return () => clearInterval(interval);
  }, [id]);
  
  if (!circle) return null;

  return (
    <Box display='flex' flexDirection='column' p={2} overflow='auto'>
      <Box>
        <Typography variant='h6'>Description</Typography>
        <Typography>{circle.description}</Typography>
        {!circle.description && <Button variant="text">Add Description</Button>}
      </Box>
      <Button
        startIcon={<GroupAddIcon />}
        variant="contained"
        color="secondary"
        sx={{ my: 2 }}
      >
        Invite a Friend
      </Button>
      <Box flex={1} overflow='auto'>
        <UserList title="Members" users={circleMembers || []} />
      </Box>
      <Divider />
      <Box display="flex" alignItems='center' gap={1} ml={0.5} mt={2}>
        <PublicIcon size="large" />
        <Typography>Public</Typography>
        <Switch checked={circle.public} sx={{ ml: 'auto' }} disabled={circle.owner != currentUser.id} />
      </Box>
      <Box display="flex" alignItems='center' gap={1} ml={0.5} mb={1}>
        <VolumeOffIcon size="large" />
        <Typography>Mute</Typography>
        <Switch sx={{ ml: 'auto' }} />
      </Box>
      <Button
        color="error"
        size="large"
        variant="outlined"
        fullWidth
        startIcon={<LogoutIcon />}
      >
        Leave Circle
      </Button>
    </Box>
  )
}

CircleProfile.propTypes = {
  id: PropTypes.number.isRequired
}

export default CircleProfile;