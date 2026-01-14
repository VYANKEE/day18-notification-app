import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; // Import auth and db
import { doc, setDoc } from "firebase/firestore"; // To save user data
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save User to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
      });

      navigate("/"); // Redirect to dashboard
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="paper-card fade-in" style={{ width: '400px', textAlign: 'center' }}>
        <h2>Membership Registry</h2>
        <p style={{fontStyle: 'italic', marginBottom: '20px'}}>Join the society.</p>
        <form onSubmit={handleRegister}>
          <input 
            type="email" 
            placeholder="Email Address" 
            className="input-vintage"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-vintage"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-vintage" style={{width: '100%'}}>Sign Inked</button>
        </form>
        <p style={{marginTop: '15px'}}>
          Already a member? <Link to="/login" style={{color: '#8a3324'}}>Login here</Link>
        </p>
      </div>
    </div>
  );
}