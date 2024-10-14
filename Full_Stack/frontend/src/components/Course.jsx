import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../style/home.css";

function Course() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch courses when the component mounts
  useEffect(() => {
    axios.get('http://localhost:4000/api/course')
      .then((response) => {
        setCourses(response.data); // Store courses in state
        setLoading(false); // Set loading to false after fetching data
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="CourseList">
      <h1>All Courses</h1>
      <div className="courses_list">
        {courses.map((course) => (
          <Link key={course.CourseID} to={`/course/${course.CourseID}`}>
            <div className="course">
              {course.Image && (
                <img src={course.Image} alt={course.CourseName} />
              )}
              <h3>{course.CourseName.slice(0, 53)}</h3>
              <p>{course.Author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Course;
