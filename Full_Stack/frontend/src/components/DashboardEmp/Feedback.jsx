import { useState, useEffect } from "react";
import axios from "axios";
import "../../style/Feedback.css";

const Feedback = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [rating, setRating] = useState(0); // Set rating to 0 initially
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch courses for dropdown on component mount
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/course")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCourse || !rating || !comment) {
      setErrorMessage("All fields are required.");
      return;
    }

    const feedbackData = {
      courseId: selectedCourse,
      rating,
      comment,
    };
    console.log(feedbackData);

    axios
      .post(
        "http://localhost:4000/api/dashboard/employee/submitFeedback",
        feedbackData
      )
      .then((response) => {
        setSuccessMessage("Feedback submitted successfully!");
        setErrorMessage("");
        setRating(0); // Reset rating
        setComment("");
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        setErrorMessage("Failed to submit feedback. Try again later.");
      });
  };

  // Function to set rating on star click
  const handleStarClick = (ratingValue) => {
    setRating(ratingValue);
  };

  return (
    <div className="feedback-form">
      <h2>Submit Feedback for Course</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="course">Select Course:</label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">-- Select a Course --</option>
            {courses.map((course) => (
              <option key={course.CourseID} value={course.CourseID}>
                {course.CourseName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Rating (1-5):</label>
          <div className="star-rating">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => handleStarClick(ratingValue)}
                  />
                  <span
                    className={`star ${ratingValue <= rating ? "filled" : ""}`}
                    role="button"
                  >
                    &#9733;
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default Feedback;
