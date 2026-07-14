import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex h-screen relative">
      <Sidebar />
      <div className="ml-64 w-full h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto"></main>
      </div>
    </div>
  );
}

export default App;
