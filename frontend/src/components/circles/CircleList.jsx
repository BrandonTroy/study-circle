import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { List, Box, ListItemButton, ListItemText, Typography, IconButton, TextField, Switch, Select, MenuItem, Button } from '@mui/material';
import { Add as NewIcon, Close as CancelIcon, Public as PublicIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Tab from '../Tab';
import { getCircles, createCircle } from '../../api/circlesApi';
import { getCurrentUser } from '../../api/accountApi';
import { getEnrolledCourses } from '../../api/courseApi';


const CircleList = ({ isCircleMessageOpen, setIsCircleMessageOpen, circleMessageId, setCircleMessageId, style }) => {
  const theme = useTheme();
  const [circles, setCircles] = useState([]);
  const [newCircleMode, setNewCircleMode] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    getCurrentUser().then(user => setLoggedInUser(user));
    const fetchCircles = () => getCircles().then(data => setCircles(data));
    fetchCircles();
    const interval = setInterval(fetchCircles, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!newCircleMode || !loggedInUser) return;
    getEnrolledCourses(loggedInUser.id).then(data => setCourses(data));
  }, [newCircleMode, loggedInUser]);

  const openMessageView = (id) => {
    setIsCircleMessageOpen(true);
    setCircleMessageId(id);
  }

  const handleSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get('name'),
      description: data.get('description'),
      course: data.get('course') === 'none' ? null : data.get('course'),
      public: data.get('public') === 'on',
      owner: loggedInUser.id
    };
    createCircle(payload).then(() => setNewCircleMode(false));
  }
  
  return (
    <Tab title={newCircleMode ? 'New Circle' : 'Circles'}
      rightHeaderContent={newCircleMode ?
        <IconButton onClick={() => setNewCircleMode(false)} size='small'> <CancelIcon /> </IconButton> :
        <IconButton onClick={() => setNewCircleMode(true)} size='small'> <NewIcon /> </IconButton>
      }
      style={style}
      sx={{ overflow: 'auto' }}
    >
      {newCircleMode ?
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          display='flex'
          flexDirection='column'
          mt={2}
          gap={2}
        >
          <TextField
            name='name'
            label='Circle Name'
            variant='outlined'
            fullWidth
            autoComplete='off'
          />
          <TextField
            name='description'
            label='Description'
            variant='outlined'
            fullWidth
            multiline
            rows={4}
          />
          <Select name='course' defaultValue={'none'}>
            <MenuItem value={'none'}>No course</MenuItem>
            {courses.map((course, index) => (
              <MenuItem key={index} value={course.code}>{course.name}</MenuItem>
            ))}
          </Select>
          <Box display='flex' alignItems='center' gap={1}>
            <PublicIcon size='large' />
            <Typography>Public</Typography>
            <Switch name='public' defaultChecked sx={{ ml: 'auto' }} />
          </Box>
          <Button type='submit' variant='contained' color='primary'>Create Circle</Button>
        </Box>
        :
        <List disablePadding>
          {circles.map((circle, index) => (
            <ListItemButton
              key={index}
              onClick={() => openMessageView(circle.id)}
              sx={{
                pl: 4,
                mt: 2,
                border: 1,
                borderRadius: 2,
                borderColor: 'divider',
                backgroundColor: isCircleMessageOpen && circleMessageId === circle.id ? theme.palette.highlight.main + ' !important' : 'inherit',
              }}
            >
              <ListItemText primary={circle.name} />
            </ListItemButton>
          ))}
          {circles.length === 0 && <Typography color='grey' textAlign='center' sx={{ mt: 2 }}>Join some circles and get studying!</Typography>}
        </List>
      }
    </Tab>
  )
}

CircleList.propTypes = {
  isCircleMessageOpen: PropTypes.bool.isRequired,
  setIsCircleMessageOpen: PropTypes.func.isRequired,
  circleMessageId: PropTypes.number.isRequired,
  setCircleMessageId: PropTypes.func.isRequired,
  style: PropTypes.object
}

export default CircleList;