// import React, { useState } from "react";
// import axios from "axios";
// import "../style/CreateCourse.css"

// function CreateCourse() {
//   const [courseName, setCourseName] = useState("");
//   const [courseDescription, setCourseDescription] = useState("");
//   const [author, setAuthor] = useState("");
//   const [image, setImage] = useState("");
//   const [modules, setModules] = useState([
//     { moduleName: "", moduleDescription: "" },
//   ]);
//   const [message, setMessage] = useState("");

//   // Handle course and modules submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const courseData = {
//       courseName,
//       courseDescription,
//       author,
//       image,
//       modules,
//     };
//     console.log(courseData);

//     try {
//       const response = await axios.post(
//         "http://localhost:4000/api/course",
//         courseData
//       );
//       setMessage(response.data.message);
//       resetForm();
//     } catch (error) {
//       setMessage("Error creating course: " + error.message);
//     }
//   };

//   // Handle module input change
//   const handleModuleChange = (index, e) => {
//     const updatedModules = modules.map((module, i) =>
//       i === index ? { ...module, [e.target.name]: e.target.value } : module
//     );
//     setModules(updatedModules);
//   };

//   // Add new module field
//   const addModule = () => {
//     setModules([...modules, { moduleName: "", moduleDescription: "" }]);
//   };

//   // Remove module field
//   const removeModule = (index) => {
//     setModules(modules.filter((_, i) => i !== index));
//   };

//   // Reset form fields
//   const resetForm = () => {
//     setCourseName("");
//     setCourseDescription("");
//     setAuthor("");
//     setImage("");
//     setModules([{ moduleName: "", moduleDescription: "" }]);
//   };

//   return (
//     <div className="CreateCourse">
//     <h1>Create Course</h1>
//     <form onSubmit={handleSubmit}>
//       {/* Course Section */}
//       <div className="course-section">
//         <div>
//           <label>Course Name:</label>
//           <input
//             type="text"
//             value={courseName}
//             onChange={(e) => setCourseName(e.target.value)}
//             required
//           />
//         </div>
  
//         <div>
//           <label>Course Description:</label>
//           <textarea
//             value={courseDescription}
//             onChange={(e) => setCourseDescription(e.target.value)}
//             required
//           ></textarea>
//         </div>
  
//         <div>
//           <label>Author:</label>
//           <input
//             type="text"
//             value={author}
//             onChange={(e) => setAuthor(e.target.value)}
//             required
//           />
//         </div>
  
//         <div>
//           <label>Image URL (Optional):</label>
//           <input
//             type="text"
//             value={image}
//             onChange={(e) => setImage(e.target.value)}
//           />
//         </div>
//       </div>
  
//       {/* Modules Section */}
//       <div className="modules-section">
//         <h3>Modules</h3>
//         {modules.map((module, index) => (
//           <div key={index}>
//             <div>
//               <label>Module Name:</label>
//               <input
//                 type="text"
//                 name="moduleName"
//                 value={module.moduleName}
//                 onChange={(e) => handleModuleChange(index, e)}
//                 required
//               />
//             </div>
  
//             <div>
//               <label>Module Description:</label>
//               <textarea
//                 name="moduleDescription"
//                 value={module.moduleDescription}
//                 onChange={(e) => handleModuleChange(index, e)}
//                 required
//               ></textarea>
//             </div>
  
//             {modules.length > 1 && (
//               <button type="button" onClick={() => removeModule(index)}>
//                 Remove Module
//               </button>
//             )}
//           </div>
//         ))}
  
//         <button type="button" onClick={addModule}>
//           Add Module
//         </button>
//       </div>
//     </form>
  
//     {message && <p>{message}</p>}
//   </div>
  
//   );
// }


// export default CreateCourse;


import React, { useState } from "react";
import axios from "axios";
import "../style/CreateCourse.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [modules, setModules] = useState([
    { moduleName: "", moduleDescription: "" },
  ]);
  const [message, setMessage] = useState("");

  // Handle course and modules submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      courseName,
      courseDescription,
      author,
      image,
      modules,
    };
    console.log(courseData);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/course",
        courseData
      );
      setMessage(response.data.message);
      resetForm();
    } catch (error) {
      setMessage("Error creating course: " + error.message);
    }
  };

  // Handle module input change
  const handleModuleChange = (index, e, editor = null) => {
    const updatedModules = modules.map((module, i) =>
      i === index
        ? editor
          ? { ...module, moduleDescription: editor.getData() } // Update CKEditor data
          : { ...module, [e.target.name]: e.target.value }
        : module
    );
    setModules(updatedModules);
  };

  // Add new module field
  const addModule = () => {
    setModules([...modules, { moduleName: "", moduleDescription: "" }]);
  };

  // Remove module field
  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  // Reset form fields
  const resetForm = () => {
    setCourseName("");
    setCourseDescription("");
    setAuthor("");
    setImage("");
    setModules([{ moduleName: "", moduleDescription: "" }]);
  };

  return (
    <div className="CreateCourse">
      <h1>Create Course</h1>
      <form onSubmit={handleSubmit}>
        {/* Course Section */}
        <div className="course-section">
          <div>
            <label>Course Name:</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Course Description:</label>
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label>Author:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Image URL (Optional):</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
        </div>

        {/* Modules Section */}
        <div className="modules-section">
          <h3>Modules</h3>
          {modules.map((module, index) => (
            <div key={index}>
              <div>
                <label>Module Name:</label>
                <input
                  type="text"
                  name="moduleName"
                  value={module.moduleName}
                  onChange={(e) => handleModuleChange(index, e)}
                  required
                />
              </div>

              <div>
                <label>Module Description:</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={module.moduleDescription}
                  onChange={(event, editor) => handleModuleChange(index, null, editor)}
                  required
                />
              </div>

              {modules.length > 1 && (
                <button type="button" onClick={() => removeModule(index)}>
                  Remove Module
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addModule}>
            Add Module
          </button>
        </div>

        <button type="submit">Create Course</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateCourse;
