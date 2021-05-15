import "./App.css";
// firebase
import firebase from "firebase/app"; // sdk
import "firebase/firestore"; // database
import "firebase/auth"; // authentication
// react-firebase-hooks
import { useAuthState } from "reacct-firebase-hooks/auth";
import { useCollectionData } from "reacct-firebase-hooks/firestore";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;
