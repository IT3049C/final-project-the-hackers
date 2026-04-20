
export const possibleWords = ["apple", "world", "words", "return"];

export const randomIndex = Math.floor(Math.random() * possibleWords.length);

export default function Wordle() {
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const res = checkGuess(guess);

    if (!res) {
      alert("Invalid word");
      return;
    }

    setResult(res);
  };

  return (
    <div>
      <h1>Wordle</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          maxLength={5}
        />
        <button type="submit">Guess</button>
      </form>

      <div>
        {result.map((r, index) => (
          <span key={index} style={{ margin: "5px" }}>
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}