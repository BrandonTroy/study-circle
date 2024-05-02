import { useState } from 'react';
import PropTypes from 'prop-types';
import { List, ListItemButton, ListItemText, ListSubheader, Typography, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';


const CourseList = ({ courses, style }) => {
  const [expandedCourse, setExpandedCourse] = useState(null);

  /**
   * State to keep track of which course is expanded
   * @param {number} itemIndex - index of the course clicked
   */
  const handleCourseClick = (courseIndex) => {
    setExpandedCourse(courseIndex === expandedCourse ? null : courseIndex);
  };

  return (
    <List
      sx={{ width: '100%', border: 1, borderColor: 'divider', marginTop: '1em', borderRadius: 1 }}
      style={style}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={<ListSubheader component="div" id="nested-list-subheader">Courses</ListSubheader>}
      disablePadding
    >
      {courses.map((course, index) => (
        <div key={index}>
          <ListItemButton
            onClick={() => handleCourseClick(index)}
            sx={{
              borderTop: '1px solid #f0f0f0',
              borderBottom: '1px solid #f0f0f0',
              marginTop: '0.5em',
              borderRadius: '4px',
            }}
          >
            <ListItemText primary={course.name} sx={{ mr: 'auto' }} />
            {expandedCourse === index ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={expandedCourse === index}>
            <List component="div" disablePadding>
              {course.circles.map((circle, index) => (
              <ListItemButton key={index} sx={{ pl: 4 }}>
                <ListItemText primary={circle.name} />
              </ListItemButton>
              ))}
            </List>
          </Collapse>
        </div>
      ))}
      {courses.length === 0 && <Typography color='grey' textAlign='center' sx={{ mb: 2 }}>Enroll in some courses and start studying with fellow classmates!</Typography>}
    </List>
  )
}

CourseList.propTypes = {
  courses: PropTypes.array.isRequired,
  style: PropTypes.object
}

export default CourseList;
