import { useEffect, useState } from "react";

function App() {
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    fetch("/api/v1/health")
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus("unreachable"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold">Library</h1>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <p className="text-sm text-gray-500">API status: {apiStatus}</p>
      </main>
    </div>
  );
}

export default App;
