import React, { useEffect, useState } from "react";
import "../style/home.css";
import first from "../../public/assets/1.jpg";
import second from "../../public/assets/2.jpg";
import third from "../../public/assets/3.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaGreaterThan } from "react-icons/fa";
import { FaLessThan } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState("Alexa");
  // Fetch courses when the component mounts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    axios
      .get("http://localhost:4000/api/course")
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

  const PrevArrow = ({ onClick }) => {
    return (
      <div className="custom-arrow prev-arrow" onClick={onClick}>
        <FaLessThan />
      </div>
    );
  };

  const NextArrow = ({ onClick }) => {
    return (
      <div className="custom-arrow next-arrow" onClick={onClick}>
        {/* &#9654; */}
        <FaGreaterThan />
      </div>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: false, // Ensure no partial images are shown
    // arrows: false, // Optional: Disable left-right arrows if not needed
    prevArrow: <PrevArrow />, // Left arrow component
    nextArrow: <NextArrow />, // Right arrow component
  };

  const images = [third,first, second];
  return (
    <div className="home">
      <div className="profile_container">
        <div className="profile_initials">SP</div>
        <div className="profile_info">
          <div className="profile_welcome">Welcome back, {user.Name}</div>
          <div className="profile_additional_info">
            Add occupation and interests
          </div>
        </div>
      </div>
      <div className="slider-container">
        <Slider {...sliderSettings}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Slide ${index}`}
                className="slider_image"
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className="what">What to learn next...</div>

      <div className="courses_list">
        {courses.map((course) => (
          <Link to={`/course/${course.CourseID}`}>
            <div key={course.CourseID} className="course">
              {course.Image && (
                <img src={course.Image} alt={course.CourseName} />
              )}
              <h3>{course.CourseName.slice(0, 53)}</h3>
              <p>{course.Author}</p>
            </div>
          </Link>
        ))}
      </div>
      <div>dee</div>
    </div>
  );
};

export default Home;
