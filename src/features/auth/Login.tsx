import { useState } from "react";
import { signIn } from "@/lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function handleLogin() {
    const { error } = await signIn(email);
    setStatus(error ? error.message : "Check your email");
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="email@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>{status}</p>
    </main>
  );
}
