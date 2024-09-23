import axios from "axios";
import "./App.css";
import React, { useState } from "react";

function App() {
  const [code, setcode] = useState("");
  const [output, setoutput] = useState("");
  const [error, setError] = useState("");
  const [fontSize, setFontSize] = useState("16px"); // State for font size

  const handleSubmit = async () => {
    const payload = {
      language: "cpp",
      code,
    };

    // Clear previous output and error messages
    setoutput("");
    setError("");

    try {
      const { data } = await axios.post("http://localhost:5000/run", payload);
      setoutput(data.output); // Set new output
    } catch (err) {
      // Set the error message from the server response
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An unknown error occurred.");
      }
      console.log(err.response);
    }
  };

  return (
    <div className="App">
      <h1>Online Code Compiler</h1>
      <div className="editor-container">
        <div className="code-section">
          <div className="font-size-container">
            <label htmlFor="font-size">Choose your font size:</label>
            <select
              id="font-size"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              style={{ marginLeft: "10px" }} // Space between label and dropdown
            >
              <option value="14px">Small (14px)</option>
              <option value="16px">Medium (16px)</option>
              <option value="18px">Large (18px)</option>
            </select>
          </div>
          <textarea
            className="code-input"
            style={{ fontSize }} // Apply selected font size
            value={code}
            onChange={(e) => setcode(e.target.value)}
          ></textarea>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div className="output-section">
          
          <div className="output-container">
            <h2>Output Window :</h2>
            <p>{output}</p>
            {error && <p className="error-message">{error}</p>} {/* Display error if it exists */}
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default App;
