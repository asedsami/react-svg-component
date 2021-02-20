import "./styles.css";
import SVG from "./components/SVG";

export default function App() {
  return (
    <div className="App">
      <SVG width={1000} height={1000} viewBox="0 0 400 400">
        <circle cx="10" cy="10" r="5" />
        <circle cx="30" cy="35" r="15" />
      </SVG>
    </div>
  );
}

