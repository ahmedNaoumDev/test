"use client";
import { useState } from "react";
import "./Login.css";
import { auth, db } from "../../firebase";
import { GoogleAuthProvider, sendSignInLinkToEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { userAuth } from "../context/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailSend, setEmailSend] = useState(false);
  const provider = new GoogleAuthProvider();
  const { user, googleWithPopUp } = userAuth();

  const signInWithGoogle = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await googleWithPopUp?.(auth, provider);

      console.log(user);

      await setDoc(doc(db, "users", `${user?.uid}`), {
        displayName: user?.displayName,
        email: user?.email,
        photoUrl: user?.photoURL,
      });
      // navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (e: React.MouseEvent) => {
    e.preventDefault();
    await sendSignInLinkToEmail(auth, email, {
      handleCodeInApp: true,
      url: "http://localhost:3000/dashboard",
    })
      .then(() => {
        setEmailSend(true);
        console.log("link sent successfully");
      })
      .catch((error) => {
        console.error("error sending", error);
      });
  };
  return (
    <form onSubmit={signInWithGoogle} className="form">
      <p>
        Welcome,<span>sign in to continue</span>
      </p>
      <button type="submit" className="oauthButton">
        <svg className="icon" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          ></path>
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          ></path>
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          ></path>
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          ></path>
          <path d="M1 1h22v22H1z" fill="none"></path>
        </svg>
        Continue with Google
      </button>
      <div className="separator">
        <div></div>
        <span>OR</span>
        <div></div>
      </div>
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailSend && (
        <p className="emailVer">
          An Email has been sended to your email address, check your inbox to
          get verified.
        </p>
      )}
      <button onClick={login} className="oauthButton" disabled={emailSend}>
        Continue
        <svg
          className="icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 17 5-5-5-5"></path>
          <path d="m13 17 5-5-5-5"></path>
        </svg>
      </button>
    </form>
  );
};

export default Login;
