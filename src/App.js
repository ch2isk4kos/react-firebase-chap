import "./App.css";
// firebase
import firebase from "firebase/app"; // sdk
import "firebase/firestore"; // database
import "firebase/auth"; // authentication
// react-firebase-hooks
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: `${process.env.REACT_APP_API_KEY}`,
  authDomain: `${process.env.REACT_APP_AUTH_DOMAIN}`,
  projectId: `${process.env.REACT_APP_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_MESSAGING_SENDER_ID}`,
  appId: `${process.env.REACT_APP_APP_ID}`,
  measurementId: `${process.env.REACT_APP_MEASUREMENT_ID}`,
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const App = () => {
  const [user] = useAuthState(auth);

  // user sign in
  function SignIn() {
    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    };
    return <button onClick={signInWithGoogle}>Sign in with Google</button>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Welcome</h2>
      </header>
    </div>
  );
};

export default App;
