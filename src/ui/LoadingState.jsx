export default function LoadingState({
  type = "spinner",
  size = "md",
  rows = 2,
  columns = 4,
  className = "",
}) {
  // 📏 Size configurations for different loading types
  const sizes = {
    sm: {
      spinner: "h-4 w-4",
      skeleton: "h-3",
      card: "h-32",
      row: "h-4",
    },
    md: {
      spinner: "h-6 w-6",
      skeleton: "h-4",
      card: "h-40",
      row: "h-6",
    },
    lg: {
      spinner: "h-8 w-8",
      skeleton: "h-6",
      card: "h-48",
      row: "h-8",
    },
  };

  // 🎭 Loading type configurations
  const loadingModes = {
    // Basic spinner (your existing one)
    spinner: () => (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div
          className={`animate-spin rounded-full border-4 border-t-transparent border-gray-500 ${sizes[size].spinner}`}
        />
      </div>
    ),

    // 📊 Table loading state
    table: () => (
      <div className={`space-y-4 ${className}`}>
        {/* Table header skeleton */}
        <div className="flex p-4 space-x-4 rounded-t-lg bg-gray-50">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className={`animate-pulse bg-gray-300 rounded ${sizes[size].skeleton} flex-1`}
            />
          ))}
        </div>

        {/* Table rows skeleton */}
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex p-4 space-x-4 border-b border-gray-100"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={`animate-pulse bg-gray-200 rounded ${sizes[size].row} flex-1`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),

    // 📝 Form loading state
    form: () => (
      <div className={`space-y-6 ${className}`}>
        {/* Form header */}
        <div className="space-y-2">
          <div
            className={`animate-pulse bg-gray-300 rounded ${sizes[size].skeleton} w-1/3`}
          />
          <div
            className={`animate-pulse bg-gray-200 rounded ${sizes[size].skeleton} w-2/3`}
          />
        </div>

        {/* Form fields */}
        {Array.from({ length: rows || 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div
              className={`animate-pulse bg-gray-300 rounded ${sizes[size].skeleton} w-1/4`}
            />
            <div
              className={`animate-pulse bg-gray-200 rounded-md h-10 w-full`}
            />
          </div>
        ))}

        {/* Form buttons */}
        {/* <div className="flex pt-4 space-x-3">
          <div className="w-24 h-10 bg-blue-200 rounded-md animate-pulse" />
          <div className="w-20 h-10 bg-gray-200 rounded-md animate-pulse" />
        </div> */}
      </div>
    ),

    // 🎯 Header loading state
    header: () => (
      <div
        className={`flex justify-between items-center p-6 border-b ${className}`}
      >
        <div className="space-y-2">
          <div
            className={`animate-pulse bg-gray-300 rounded ${sizes[size].skeleton} w-48`}
          />
          <div
            className={`animate-pulse bg-gray-200 rounded ${sizes[size].skeleton} w-32`}
          />
        </div>
        <div className="flex space-x-3">
          <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse" />
          <div className="w-32 h-10 bg-accent/20 rounded-md animate-pulse" />
        </div>
      </div>
    ),

    // 📦 Product card loading state
    card: () => (
      <div className={`border rounded-lg p-4 space-y-4 ${className}`}>
        <div
          className={`animate-pulse bg-gray-200 rounded-md ${sizes[size].card} w-full`}
        />
        <div className="space-y-2">
          <div
            className={`animate-pulse bg-gray-300 rounded ${sizes[size].skeleton} w-3/4`}
          />
          <div
            className={`animate-pulse bg-gray-200 rounded ${sizes[size].skeleton} w-1/2`}
          />
          <div
            className={`animate-pulse bg-gray-200 rounded ${sizes[size].skeleton} w-1/4`}
          />
        </div>
      </div>
    ),

    // 📊 Stats cards loading state
    stats: () => (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-6 bg-white border rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div
                  className={`animate-pulse bg-gray-200 rounded ${sizes[size].skeleton} w-2/3`}
                />
                <div className="w-1/2 h-8 text-2xl font-bold bg-gray-300 rounded animate-pulse" />
              </div>
              <div
                className={`animate-pulse bg-gray-200 rounded-full ${sizes[size].spinner}`}
              />
            </div>
          </div>
        ))}
      </div>
    ),

    // 📋 List loading state
    list: () => (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: rows || 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center p-3 space-x-4 border rounded-lg"
          >
            <div
              className={`animate-pulse bg-gray-200 rounded-full ${sizes[size].spinner}`}
            />
            <div className="flex-1 space-y-2">
              <div
                className={`animate-pulse bg-gray-300 rounded ${sizes[size].skeleton} w-3/4`}
              />
              <div
                className={`animate-pulse bg-gray-200 rounded ${sizes[size].skeleton} w-1/2`}
              />
            </div>
          </div>
        ))}
      </div>
    ),

    // 📈 Chart loading state
    chart: () => (
      <div className={`border rounded-lg p-6 ${className}`}>
        <div className="space-y-4">
          <div
            className={`animate-pulse bg-gray-300 rounded ${sizes[size].skeleton} w-1/3`}
          />
          <div className="flex items-end justify-center h-64 p-4 space-x-2 bg-gray-100 rounded animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-300 rounded-t animate-pulse"
                style={{
                  height: `${Math.random() * 80 + 20}%`,
                  width: "12%",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),

    // 🗂️ Sidebar loading state
    sidebar: () => (
      <div className={`w-64 h-screen bg-gray-50 p-4 space-y-4 ${className}`}>
        <div
          className={`animate-pulse bg-gray-300 rounded ${sizes[size].skeleton} w-3/4 h-8`}
        />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center p-2 space-x-3">
              <div
                className={`animate-pulse bg-gray-200 rounded ${sizes[size].skeleton} w-5 h-5`}
              />
              <div
                className={`animate-pulse bg-gray-200 rounded ${sizes[size].skeleton} flex-1`}
              />
            </div>
          ))}
        </div>
      </div>
    ),

    // 🔍 Search results loading
    search: () => (
      <div className={`space-y-4 ${className}`}>
        <div className={`animate-pulse bg-gray-200 rounded-full h-10 w-full`} />
        <div className="space-y-3">
          {Array.from({ length: rows || 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start p-4 space-x-4 border rounded-lg"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse" />
              <div className="flex-1 space-y-2">
                <div
                  className={`animate-pulse bg-gray-300 rounded ${sizes[size].skeleton} w-2/3`}
                />
                <div
                  className={`animate-pulse bg-gray-200 rounded ${sizes[size].skeleton} w-full`}
                />
                <div
                  className={`animate-pulse bg-gray-200 rounded ${sizes[size].skeleton} w-1/3`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    // 📱 Mobile responsive loading
    mobile: () => (
      <div className={`space-y-4 p-4 ${className}`}>
        {Array.from({ length: rows || 4 }).map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-3 space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div
                  className={`animate-pulse bg-gray-300 rounded ${sizes[size].skeleton} w-2/3`}
                />
                <div
                  className={`animate-pulse bg-gray-200 rounded ${sizes[size].skeleton} w-1/3`}
                />
              </div>
            </div>
            <div
              className={`animate-pulse bg-gray-200 rounded-md h-20 w-full`}
            />
          </div>
        ))}
      </div>
    ),
  };

  // 🎯 Return the requested loading type
  const LoadingComponent = loadingModes[type];

  if (!LoadingComponent) {
    console.warn(
      `LoadingState: Unknown type "${type}". Falling back to spinner.`
    );
    return loadingModes.spinner();
  }

  return <LoadingComponent />;
}
