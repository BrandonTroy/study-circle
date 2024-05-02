const courses = require('../../data/courses/ncsu.json');

// Function to process a course
function processCourse(course) {
  if (!course) return {};
  const [subject, code, section] = course.course_code.split('-');
  
  return {
    name: courses[subject][code].name,
    description: courses[subject][code].description,
    abbreviation: course.course_code.split('-').slice(0, 2).join(' '),
    code: course.course_code,
    section: section,
    ...courses[subject][code]['sections'][section],
    circles: course.circles
  }
}

module.exports = processCourse;