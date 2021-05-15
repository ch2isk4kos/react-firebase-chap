import React, { useRef, useState } from "react";
import "./App.css";
// firebase
import firebase from "firebase/app"; // sdk
import "firebase/firestore"; // database
import "firebase/auth"; // authentication
import "firebase/analytics"; // analytics
// react-firebase-hooks
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({});

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
        <button className="sign-out" onClick={() => auth.signOut()}>
          Sign Out
        </button>
      )
    );
  }

  // Chatroom
  function ChatRoom() {
    const messagesPool = firestore.collection("messages"); // reference to a point in the firestore database
    const query = messagesPool.orderBy("createdAt").limit(25); // query for a subset of documents
    const dummy = useRef();

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
      dummy.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
      <>
        <main>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
          <span ref={dummy}></span>
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

  function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

    return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL || "https://adorable.io/avatars/image.png"} />
        <p>{text}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Web Chat Application</h2>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
};

export default App;

// https://www.youtube.com/watch?v=zQyrwxMPm88
// left off 4:20
