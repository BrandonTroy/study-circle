import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { Box, Typography} from '@mui/material';
import { Popover, IconButton } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FullCalendar from '@fullcalendar/react';
import { formatDate } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import CourseList from './CourseList';
import Tab from '../Tab';
import { getCurrentUser } from '../../api/accountApi';
import { getEnrolledCourses } from '../../api/courseApi';


const Home = ({ style }) => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    function fetchCourses() {
      getCurrentUser().then((user) => {
        getEnrolledCourses(user.id).then(data => setCourses(data));
      });
    }

    fetchCourses();
    const interval = setInterval(fetchCourses, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const calendarRef = useRef(null);

  // Show the events details when clicked
  const [anchorEl, setAnchorEl] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  
  const handleViewChange = () => {
    const calendarApi = calendarRef.current.getApi();
    const newView = calendarApi.view.type === 'dayGridMonth' ? 'listMonth' : 'dayGridMonth';
    calendarApi.changeView(newView);
  };

  
  /**
   * Format the time to be displayed in the popover
   * @param {object} date - event object
   * @returns {string} - formatted time
   */
  const formatTime = (date) => {
    if (!date.start || !date.end) return 'No time specified';
    const startTime = formatDate(date.start, { hour: 'numeric', minute: '2-digit' });
    const endTime = formatDate(date.end, { hour: 'numeric', minute: '2-digit' });
    return `${startTime} - ${endTime}`;
  };
  
  /**
   * State to keep track of which event is clicked
   * @param {object} info - event object
   */
  const handleEventClick = (info) => {
    setAnchorEl(info.jsEvent.currentTarget);
    setEventDetails(`Event: ${info.event.title}. \n Time: ${formatTime(info.event)}`);
  }

  /**
   * State to keep track of which event is clicked
   */
  const handleClose = () => {
    setAnchorEl(null);
  }

  // Open is true if anchorEl is not null, else it is false
  const open = Boolean(anchorEl);
  // If open is true, id is set to simple-popover, else it is undefined
  const id = open ? 'simple-popover' : undefined;

  return (
    <Tab style={style}>
      <section>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6'>Events This Month</Typography>
          <IconButton onClick={handleViewChange} color="primary" aria-label="calendar">
            <CalendarTodayIcon />
          </IconButton>
        </Box>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView= "listMonth"
          weekends={true}
          headerToolbar={false}
          events={[
            { title: 'Study group name', date: '2024-05-05', start: '2024-05-05T15:00:00', end: '2024-05-05T16:00:00', color: 'blue'},
            { title: 'event 2', date: '2024-05-06', editable: false, color: 'red' },
            { title: 'event 1', date: '2024-05-10', editable: true, color: 'blue'},
            { title: 'event 2', date: '2024-04-11', editable: false, color: 'blue' },
            { title: 'event 2', date: '2024-05-12', editable: false, color: 'red' },
            { title: 'event 2', date: '2024-04-13', editable: false, color: 'red' },
            { title: 'event 2', date: '2024-04-14', editable: false, color: 'red' },
            { title: 'event 2', date: '2024-04-15', start: '2024-04-15T15:00:00', end: '2024-04-15T16:00:00', editable: false, color: 'red' },
            { title: 'event 2', date: '2024-04-16', editable: false, color: 'red' },
          ]}
          noEventsContent="No study sessions scheduled"
          height='45vh'
          eventClick={handleEventClick}
        />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Typography sx={{ p: 2 }}>
            {eventDetails}
          </Typography>
        </Popover>
      </section>
      <section>
        <CourseList courses={courses} />
      </section>
    </Tab>
  )
}

Home.propTypes = {
  style: PropTypes.object
}

export default Home;