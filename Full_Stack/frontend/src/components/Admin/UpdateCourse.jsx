import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../style/UpdateCourse.css"; // Import the CSS file

const UpdateCourse = ({ courseId = 1 }) => {
  const [courseData, setCourseData] = useState({
    CourseName: "",
    CourseDescription: "",
    Author: "",
    Image: "",
    Modules: [{ ModuleName: "", ModuleDescription: "" }],
  });
  console.log(courseData);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/course/details/${courseId}`
        );
        setCourseData(response.data);
      } catch (error) {
        console.error("Failed to fetch course data", error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModuleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedModules = [...courseData.Modules];
    updatedModules[index][name] = value;
    setCourseData((prevData) => ({
      ...prevData,
      Modules: updatedModules,
    }));
  };

  const addModule = () => {
    setCourseData((prevData) => ({
      ...prevData,
      Modules: [...prevData.Modules, { ModuleName: "", ModuleDescription: "" }],
    }));
  };

  const removeModule = (index) => {
    const updatedModules = courseData.Modules.filter((_, i) => i !== index);
    setCourseData((prevData) => ({
      ...prevData,
      Modules: updatedModules,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/course/courses/${courseId}`,
        courseData
      );
      alert("Course updated successfully!");
    } catch (error) {
      console.error("Failed to update course", error);
      alert("Error updating course");
    }
  };

  return (
    <div className="update-course-container">
      <form onSubmit={handleSubmit} className="update-course-form">
        <h2>Update Course</h2>
        <div className="form-group">
          <label>Course Name:</label>
          <input
            type="text"
            name="CourseName"
            value={courseData.CourseName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Course Description:</label>
          <textarea
            name="CourseDescription"
            value={courseData.CourseDescription}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input
            type="text"
            name="Author"
            value={courseData.Author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="Image"
            value={courseData.Image}
            onChange={handleChange}
          />
        </div>
        <h3>Modules</h3>
        {courseData.Modules.map((module, index) => (
          <div key={index} className="module-container">
            <div className="form-group">
              <label>Module Name:</label>
              <input
                type="text"
                name="ModuleName"
                value={module.ModuleName}
                onChange={(e) => handleModuleChange(index, e)}
                required
              />
            </div>
            <div className="form-group">
              <label>Module Description:</label>
              <textarea
                name="ModuleDescription"
                value={module.ModuleDescription}
                onChange={(e) => handleModuleChange(index, e)}
                required
              />
            </div>
            <button
              type="button"
              className="remove-module-button"
              onClick={() => removeModule(index)}
            >
              Remove Module
            </button>
          </div>
        ))}
        <button type="button" className="add-module-button" onClick={addModule}>
          Add Module
        </button>
        <button type="submit" className="submit-button">
          Update Course
        </button>
      </form>
    </div>
  );
};

export default UpdateCourse;
