import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../style/CourseDetail.css";
import Discuss from "./Discuss";
import tik from "../assets/tik.png";
function CourseDetail() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeModule, setActiveModule] = useState(null);
  const [currentEngagementId, setCurrentEngagementId] = useState(null);
  const [user, setUser] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0); // Track course completion
  const [isEnrollmment, setisEnrollmment] = useState(false);
  const [moduleStatus, setModuleStatus] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  useEffect(() => {
    if (user) {
      enrollmentCheck(user.EmployeeID);
    }
  }, [user]);

  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/course/details/${courseId}`
      );
      const { courseDetails, moduleCompletion } = response.data;
      setCourse(courseDetails);
      setModuleStatus(moduleCompletion);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourseDetails(id);
  }, [id]);

  useEffect(() => {
    percentageTime(user, id);
  }, [user, id]);

  const enrollmentCheck = async (employeeID) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/enrollment/check",
        {
          EmployeeID: employeeID,
          CourseID: id,
        }
      );

      setisEnrollmment(res.data.enrollment);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const enrollmentSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/enrollment",
        {
          EmployeeID: user.EmployeeID,
          CourseID: id,
        }
      );
      setisEnrollmment(response.data.enrollment);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  function percentageTime(user, id) {
    if (user && id) {
      axios
        .get(
          `http://localhost:4000/api/course/completion/${user.EmployeeID}/${id}`
        )
        .then((response) => {
          setCompletionPercentage(response.data.completionPercentage);
          setTime(response.data.totalTimeSpent);
        })
        .catch((error) => {
          console.error("Error fetching completion percentage:", error);
        });
    }
  }
  const startEngagement = async (moduleId) => {
    const employeeId = user.EmployeeID;
    const currentTime = new Date().toISOString();

    try {
      const response = await axios.put(
        "http://localhost:4000/api/course/engagement/start",
        {
          employeeId,
          moduleId,
          courseId: id,
          startTime: currentTime,
        }
      );
      setCurrentEngagementId(response.data.EngagementID);
    } catch (error) {
      console.error("Error starting engagement:", error);
    }
  };
  const endEngagement = async () => {
    const currentTime = new Date().toISOString();
    if (currentEngagementId) {
      try {
        await axios.put(
          `http://localhost:4000/api/course/engagement/end/${currentEngagementId}`,
          {
            endTime: currentTime,
          }
        );
        percentageTime(user, id);
        fetchCourseDetails(id);
      } catch (error) {
        console.error("Error ending engagement:", error);
      }
    }
  };
  const toggleModuleDescription = (moduleId) => {
    // Check if the user is collapsing the currently active module
    if (activeModule === moduleId) {
      endEngagement(); // End engagement when collapsing the active module
      setActiveModule(null); // Collapse the module
    } else {
      if (activeModule !== null) {
        endEngagement(); // End engagement for the previously active module
      }
      startEngagement(moduleId); // Start engagement for the newly opened module
      setActiveModule(moduleId); // Set the new active module
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>No course found</div>;

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad with zero if the number is less than 10
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(remainingSeconds).padStart(2, "0");

    return (
      <div className="timer-container">
        <p className="time">
          {paddedMinutes} min : {paddedSeconds} sec
        </p>
      </div>
    );
  }

  return (
    <div className="course-detail">
      {/* Course header and modules as before */}
      <div className="course-header">
        <div className="course-info">
          <h1>{course.CourseName}</h1>
          <p>{course.CourseDescription}</p>
          <p>Author: {course.Author}</p>
        </div>
        {course.Image && (
          <div className="course-image">
            <img src={course.Image} alt={course.CourseName} />
          </div>
        )}
      </div>
      {!isEnrollmment && <button onClick={enrollmentSubmit}>Enroll</button>}
      {isEnrollmment ? (
        <div className="course_details_container">
          <div>
            <p>{completionPercentage}% completed</p>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {formatTime(time)}

          <h3 className="module-heading">Modules</h3>
          <div className="module-list">
            {course.Modules.map((module) => (
              <div key={module.ModuleID} className="module-item">
                <div
                  className="module-header"
                  onClick={() => toggleModuleDescription(module.ModuleID)}
                >
                  <span className="dropdown-icon">
                    {activeModule === module.ModuleID ? "-" : "+"}
                  </span>
                  <h4>{module.ModuleName}</h4>

                  <div className="completion-checkbox">
                    {/* Green checkmark for completed modules */}
                    {/* <img className="green_tick" src={tik} alt="" /> */}
                    {moduleStatus.some(
                      (status) =>
                        status.module_id === module.ModuleID &&
                        status.is_completed
                    ) && (
                      <img className="green_tick" src={tik} alt="Completed" />
                    )}
                  </div>
                </div>

                {activeModule === module.ModuleID && (
                  <div className="module-description">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: module.ModuleDescription,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {completionPercentage == "100.00" && (
            <button
              className="discuss_button test"
              onClick={() => navigate(`/quiz/${id}`)}
            >
              Start test
            </button>
          )}

          <Discuss courseId={course.CourseID} userId={user.EmployeeID} />
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}

export default CourseDetail;
