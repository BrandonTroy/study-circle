const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const cheerio = require('cheerio');

const URL_BASE = 'https://webappprd.acs.ncsu.edu/php/coursecat';
const URL_SUBJECTS = URL_BASE + '/subjects.php';
const URL_COURSES = URL_BASE + '/search.php';

const COURSES_DIRECTORY = './data/courses';
const SUBJECTS_DIRECTORY = './data/subjects';
const SCHOOL = 'ncsu';


/** All semesters and the integer they map to for requests */
const semesterMonths = {
  "spring": 1,
  "summer 1": 5,
  "summer 2": 7,
  "fall": 8
};


function request(subject, semester, year, callback) {
  const data = {
    term: '2' + year % 1000 + semesterMonths[semester],
    subject: subject,
  };

  axios.post(URL_COURSES, qs.stringify(data), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => {
    callback(response.data.html);
  })
  .catch(error => {
    console.error(error);
  });
}


function getCourseCodes(semester, year) {
  const data = {
    strm: '2' + year % 1000 + semesterMonths[semester]
  };

  axios.post(URL_SUBJECTS, qs.stringify(data), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => {
    const courseList = JSON.parse(response.data.subj_js);
    const subjects = {};
    courseList.forEach(course => {
      const [subject, name] = course.split(' - ', 2);
      subjects[subject] = name;
    });

    getCourses(subjects, semester, year);
    fs.writeFileSync('course_codes/ncsu.json', JSON.stringify(subjects, null, 2));
  })
  .catch(error => {
    console.error(error);
  });
}


function getCourses(subjects, semester, year, callback) {
  const courses = {};
  const subjectKeys = Object.keys(subjects);
  let requestsCompleted = 0;

  function processSubject(subject) {
    request(subject, semester, year, html => {      
      const $ = cheerio.load(html);
      
      // iterate through each course
      $('section').each((i, course) => {        
        const h1 = $(course).find('h1').first().clone();
        const name = h1.find('small').first().text();
        const credits = parseInt(h1.find('span').first().text().split('Units: ')[1]);
        h1.find('small').remove();
        h1.find('span').remove();
        const code = h1.text().split(' ')[1];
        const description = $(course).find('p').first().text();

        courses[subject][code] = {
          name: name,
          description: description,
          credits: credits,
          sections: {}
        }
        
        // iterate through each section for the course
        $(course).find('tbody tr').each((i, tr) => {
          const section = $(tr).find('td').eq(0).text();
          
          const days = [];
          $(tr).find('td').eq(4).find('li').each((i, li) => {
            if ($(li).text().slice(2) === 'meets') {
              days.push($(li).children().first().attr('title').split(' - ')[0].toLowerCase());
            }
          });
          $(tr).find('td').eq(4).find('ul').remove();
          const [startTime, endTime] = $(tr).find('td').eq(4).text().split(' - ');

          const location = $(tr).find('td').eq(5).text();
          const instructor = $(tr).find('td').eq(6).text();
          const [start, end] = $(tr).find('td').eq(7).text().split(' - ');

          courses[subject][code].sections[section] = {
            instructor: instructor,
            location: location,
            meetingDays: days,
            startTime: startTime ? startTime.trim(): startTime,
            endTime: endTime ? endTime.trim(): endTime,
            startDate: start,
            endDate: end
          }
        });
        
      });

      requestsCompleted++;
      if (requestsCompleted === subjectKeys.length) {
        // All requests completed, write the file
        fs.writeFileSync(`courses/ncsu.json`, JSON.stringify(courses, null, 2));
        if (callback) callback();
      }

    });
  }

  subjectKeys.forEach((subject, index) => {
    setTimeout(() => {
      courses[subject] = {};
      processSubject(subject);
    }, index * 2000); // 1-second delay between each request
  });
}



getCourseCodes('spring', 2024);