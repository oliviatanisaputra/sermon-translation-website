import "./Login.css";
import { useState } from 'react';

function Login({ onLogin, onGuest }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        // console.log(data);
        onLogin(data);
    };


    return (
        <div>
            {/* <h2 class="header">Sermon Translation Platform</h2> */}

            <div class="login-page">
                <div class="login-card">
                    <h2>Login</h2>
                    <input
                        type="text"
                        id="username"
                        placeholder="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <br />

                    <input
                        type="password"
                        id="password"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <br />

                    <button class="btn-login" onClick={handleSubmit}>
                        Login
                    </button>
                </div>

                <hr />

                <div class="guest-access">
                    <h3>Guest Access</h3>
                    <p>View sermon translations (read-only)</p>
                    <button class="btn-guest" onClick={onGuest}>
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;