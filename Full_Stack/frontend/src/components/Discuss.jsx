import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Discuss.css";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const Discuss = ({ courseId, userId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [ansText, setAnsText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all discussions for the course
  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/discuss/discussions/${courseId}`
      );
      const data = response.data;
      if (data.success) {
        setDiscussions(data.discussions);
      }
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ask a new question
  // Ask a new question
  const handleAskQuestion = async (DiscussionID = "") => {
    console.log(DiscussionID);
    
    try {
      const config = {
        headers: getAuthHeader(),
      };
      const response = await axios.post(
        "http://localhost:4000/api/discuss/ask",
        {
          // EmployeeID: userId,
          Text: DiscussionID ?ansText:questionText,
          CourseID: courseId,
          DiscussionID,
        },
        config
      );
      const data = response.data;
      if (data.success) {
        setQuestionText("");
        setAnsText("")
        fetchDiscussions(); // Refresh discussions
      }
    } catch (error) {
      console.error("Failed to ask question:", error);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  return (
    <div>
    <h2 className="discuss_header">Course Discussions</h2>
    <div className="discuss_input-container">
      <input
        type="text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Ask a question"
        className="discuss_input"
      />
      <button onClick={() => handleAskQuestion(null)} className="discuss_button">Ask</button>
    </div>
    {loading ? (
      <p className="discuss_loading">Loading discussions...</p>
    ) : (
      <div className="discuss_container">
        {discussions.map((discussion) => (
          <div key={discussion.DiscussionID} className="discuss_item">
            <p className="discuss_question">
              <strong>Q: {discussion.Text}</strong>    
              <em style={{ fontSize: '18px' }}> (Asked by: {discussion.Employee.Name})</em>

            </p>
            {discussion.ansList &&
              discussion.ansList.map((ans) => (
                <p key={ans.DiscussionID} className="discuss_answer">
                    ({ans.Employee.Name}):     {ans.Text} 
                </p>
              ))}
            <div className="discuss_answer-input-container">
              <input
                type="text"
                placeholder="Enter your answer"
                onChange={(e) => setAnsText(e.target.value)}
                className="discuss_answer-input"
              />
              <button
                onClick={() => handleAskQuestion(discussion?.DiscussionID)}
                className="discuss_button"
              >
                Answer
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

  
  );
};

export default Discuss;
