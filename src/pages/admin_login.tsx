import { SigInAPI } from "@/API/AuthAPI";
import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"success" | "error" | "">("");
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent) => {
   try {
     e.preventDefault();
 
     if (userId && password) {
       const resp = await SigInAPI({
         userID:userId,
         password
       });
       await localStorage.setItem("adminToken",resp.data.token);
       setMessage("Login successful! Redirecting...");
       setStatus("success");
       setTimeout(() => {
         navigate("/")
       }, 1500);
     } else {
       setMessage("Please fill in all fields");
       setStatus("error");
     }
   } catch (error) {
    setMessage(error.message);
   }
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginContainer}>
        <div style={styles.loginHeader}>
          <h1 style={styles.title}>Admin Panel</h1>
          <p style={styles.subtitle}>Please enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.loginBtn}>Login</button>

          {message && (
            <div
              style={{
                ...styles.message,
                ...(status === "success"
                  ? styles.success
                  : styles.error),
              }}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    background: "linear-gradient(135deg, #FF9933 0%, #FFB84D 100%)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  loginContainer: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "400px",
  },
  loginHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    color: "#333",
    fontSize: "28px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    color: "#333",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #FF9933 0%, #FFB84D 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "10px",
  },
  message: {
    marginTop: "20px",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
  },
  success: {
    background: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
  },
  error: {
    background: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
  },
};

export default AdminLogin;
