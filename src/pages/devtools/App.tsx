export default function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <button onClick={() => chrome.runtime.reload()}>1</button>
      <div className="w-1/3 p-4 border-r border-gray-200">
        <h2 className="text-lg font-semibold mb-4">拦截规则1</h2>
      </div>
    </div>
  );
}
