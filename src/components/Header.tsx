

export default function Header() {
  return (
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "540px",
      }}
    >
      <div
        style={{
          fontFamily: "indie-flower",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            margin: 0,
            paddingRight: 10,
            fontSize: "1.7rem",
            fontWeight: "bold",
          }}
        >
          Sudoku
        </span>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=sngguojie&repo=sudoku&type=star"
          frameBorder="0"
          scrolling="0"
          width="50"
          height="20"
          title="GitHub"
        />
      </div>
    </div>
  );
}
