import Navbar from "./components/navbar";
import Feed from "./features/feed/feed";

function App() {
  return (
    <>
      <div className="bg-foreground text-background">
        <Navbar />
        <Feed />
      </div>
    </>
  );
}

export default App;
