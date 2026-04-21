import "./App.css";
import WordleGame from "./wordle/wordleGame.jsx"; // Fixed import path to match where you saved it!

function App() {
  return (
    <div className="app-container">
      <h1>GameHub</h1>
      <h2>Team: The Hackers</h2>
      <p>Welcome to GameHub</p>

      {/* Display the Wordle Game here */}
      <WordleGame />
    </div>
  );
}

export default App;
