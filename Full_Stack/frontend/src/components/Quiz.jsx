import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../style/Quiz.css";
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
const Quiz = () => {
  const { courseID } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/course/details/${courseID}`)
      .then((response) => {
        setQuiz(response.data.Quiz);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [courseID]);

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: selectedOption,
    });
  };
  const handleSubmit = () => {
    const newResults = quiz.map((question, index) => {
      const correctAnswer = question.Answer;
      const userAnswer = selectedAnswers[index] || "";
      return {
        question: question.Question,
        correctAnswer,
        userAnswer,
        isCorrect: correctAnswer === userAnswer,
      };
    });
    setResults(newResults);

    // Calculate score
    const correctAnswersCount = newResults.filter(
      (result) => result.isCorrect
    ).length;
    setScore(correctAnswersCount * 5); // 5 marks for each correct answer
  };
  useEffect(() => {
    addScore(score);
  }, [score]);

  const addScore = async (score) => {
    const config = {
      headers: getAuthHeader(),
    };
    try {
      // API call to update quiz score
      const response = await axios.post(
        "http://localhost:4000/api/course/quiz/score",
        {
          CourseID: courseID,
          QuizScore: score,
        },
        config
      );

      if (response.data.success) {
        // console.log(
        //   "Quiz score updated successfully!",
        //   response.data.updatedEnrollment
        // );
        // You can show a success message or update UI accordingly
      } else {
        console.error("Failed to update quiz score.");
      }
    } catch (error) {
      console.error("Error submitting quiz score:", error);
    }
  };
  if (loading) return <p className="text-center">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  
  return (
    <div className="container">
      <h1>Test Window</h1>
      {!results ? (
        <div>
          {quiz?.length > 0 ? (
            <div>
              {quiz.map((question, index) => (
                <div key={index} className="question-box">
                  <h2>
                    {index + 1}. {question.Question}
                  </h2>
                  <div className="flex flex-col space-y-2">
                    {question.Options.map((option, idx) => (
                      <label
                        key={idx}
                        className={`option-label ${
                          selectedAnswers[index] === option ? "bg-blue-200" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          onChange={() => handleAnswerSelect(index, option)}
                          checked={selectedAnswers[index] === option}
                        />
                        <span className="radio-button"></span>
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={handleSubmit} className="submit-button">
                Submit Test
              </button>
            </div>
          ) : (
            <p>No questions found for this test.</p>
          )}
        </div>
      ) : (
        <div>
          <button onClick={() => navigate(`/course/${courseID}`)}>Close</button>
          <h2>Results:</h2>
          <div className="score-box">
            Your Total Score: {score} / {quiz.length * 5}
          </div>
          {results.map((result, index) => (
            <div key={index} className="result-box">
              <h3>
                {index + 1}. {result.question}
              </h3>
              <p>
                <strong>Your Answer:</strong>{" "}
                {result.userAnswer || "No answer selected"}
              </p>
              <p>
                <strong>Correct Answer:</strong> {result.correctAnswer}
              </p>
              <p className={result.isCorrect ? "correct" : "incorrect"}>
                {result.isCorrect ? "Correct" : "Incorrect"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quiz;
