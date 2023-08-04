import logo from "./logo.svg";
import "./App.css";
import WalletConnect from "./components/loadWallets";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WalletConnect />
      </header>
    </div>
  );
}

export default App;
