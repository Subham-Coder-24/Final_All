import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../style/AdminFeedback.css"

const AdminFeedback = () => {
  const [courses, setCourses] = useState([]); // List of courses
  const [selectedCourse, setSelectedCourse] = useState(''); // Selected course ID
  const [feedback, setFeedback] = useState([]); // Feedback list
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  // Fetch all courses on component mount
  useEffect(() => {
    axios
      .get('http://localhost:4000/api/course')
      .then((response) => {
        setCourses(response.data); // Set the list of courses
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses');
      });
  }, []);

  // Fetch feedback for the selected course
  const fetchFeedback = () => {
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }

    setLoading(true);
    setError('');

    axios
      .get(`http://localhost:4000/api/admin/getCourseFeedback/${selectedCourse}`)
      .then((response) => {
        setFeedback(response.data.feedback || []); // Set feedback data
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching feedback:', error);
        setError('Failed to load feedback');
        setLoading(false);
      });
  };

  return (
    <div className="admin-feedback">
      <h2>Course Feedback</h2>

      <div className="form-group">
        <label htmlFor="course">Select Course:</label>
        <select
          id="course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Select a Course --</option>
          {courses.map((course) => (
            <option key={course.CourseID} value={course.CourseID}>
              {course.CourseName}
            </option>
          ))}
        </select>
      </div>

      <button onClick={fetchFeedback}>View Feedback</button>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading feedback...</p>
      ) : feedback.length > 0 ? (
        <div className="feedback-list">
          <h3>Feedback for Selected Course</h3>
          <ul>
            {feedback.map((item, index) => (
              <li key={index}>
                <p>
                  <strong>{item.Employee.Name}:</strong> {item.Rating}/5
                </p>
                <p>{item.Comment}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && <p>No feedback available for this course.</p>
      )}
    </div>
  );
};

export default AdminFeedback;
