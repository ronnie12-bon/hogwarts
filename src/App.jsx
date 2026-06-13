function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>⚡ Hogwarts Study Simulator ⚡</h1>

      <h2>Welcome to Hogwarts</h2>

      <p>Your magical study journey begins here.</p>

      <button
        style={{
          padding: "12px 24px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Receive Acceptance Letter
      </button>
    </div>
  );
}

export default App;

npm run dev
