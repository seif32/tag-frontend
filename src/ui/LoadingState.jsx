export default function LoadingState({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-transparent border-gray-500 ${sizes[size]} ${className}`}
    />
  );
}
