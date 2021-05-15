import React, { userRef, useState } from "react";
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
const analytics = firebase.analytics();

const App = () => {
  const [user] = useAuthState(auth);

  // user sign in
  function SignIn() {
    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    };
    return (
      <>
        <button className="sign-in" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
        <p>Please respect the community guidelines</p>
      </>
    );
  }

  // user sign out
  function SignOut() {
    return (
      auth.currentUser && (
        <button className="sign-out" onClick={() => auth.SignOut()}>
          Sign Out
        </button>
      )
    );
  }

  // Chatroom
  function Chatroom() {
    const messagesPool = firestore.collection("messages"); // reference to a point in the firestore database
    const query = messagesPool.orderBy("createdAt").limit(25); // query for a subset of documents
    const scroll = useRef();

    // listen for updates to data in realtime with useCollectionData hook:
    const [messages] = useCollectionData(query, { idField: "id" }); // returns an array of objects -> each object is a chat message in the database
    const [formValue, setFormValue] = useState("");

    const sendMessage = async (e) => {
      e.preventDefault();

      const { uid, photoURL } = auth.currentUser;

      await messagesPool.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
      });
      setFormValue("");
      scroll.current.scrollIntoView({ behavior: "smooth" });
    };
    return (
      <>
        <main>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
          <span ref={scroll}></span>
        </main>
        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="write message"
          />
          <button type="submit" disabled={!formValue}>
            Send
          </button>
        </form>
      </>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Welcome</h2>
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
};

export default App;

// https://www.youtube.com/watch?v=zQyrwxMPm88
// left off 4:20
