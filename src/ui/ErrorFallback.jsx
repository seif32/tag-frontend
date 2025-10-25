function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>Oops! Something went wrong</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#21808d",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Reload App
      </button>
    </div>
  );
}

export default ErrorFallback;
