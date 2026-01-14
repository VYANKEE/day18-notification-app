import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="paper-card fade-in" style={{ width: '400px', textAlign: 'center' }}>
        <h2>Access Archives</h2>
        <p style={{fontStyle: 'italic', marginBottom: '20px'}}>Verify your identity.</p>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn-vintage" style={{width: '100%'}}>Enter</button>
        </form>
        <p style={{marginTop: '15px'}}>
          New here? <Link to="/register" style={{color: '#8a3324'}}>Register</Link>
        </p>
      </div>
    </div>
  );
}