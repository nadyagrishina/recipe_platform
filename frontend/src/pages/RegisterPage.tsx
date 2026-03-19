import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";

type Props = { lang: Language };

export default function RegisterPage({ lang }: Props) {
  const t = TEXTS[lang].auth.register;
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const data = await register({ email, username, password });
    
    if (data && data.token) {
      await login(data.token);
      navigate("/profile");
    }
  } catch (err: any) {
    console.error("Full error object:", err);

    if (err.response.status === 409) setError("Email already exists");
    
    if (err.response) {
      setError(err.response.status === 403 
        ? "Server forbidden (403)" 
        : t.errorGeneric);
    } else {
      setError("Network error: Server is unreachable");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="auth auth--register">
      <div className="auth__container">
        <div className="auth__card">
          <h2 className="auth__title">{t.title}</h2>

          <form className="auth__form" onSubmit={handleRegister}>
            <div className="auth__field">
              <label htmlFor="email" className="auth__label">
                {t.emailLabel}
              </label>
              <input
                type="email"
                id="email"
                className="auth__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
              />
            </div>

            <div className="auth__field">
              <label htmlFor="username" className="auth__label">
                {t.usernameLabel}
              </label>
              <input
                type="text"
                id="username"
                className="auth__input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.usernamePlaceholder}
                required
              />
            </div>

            <div className="auth__field">
              <label htmlFor="password" className="auth__label">
                {t.passwordLabel}
              </label>
              <input
                type="password"
                id="password"
                className="auth__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              className="auth__submit"
              disabled={loading}
            >
              {loading ? t.loading : t.submit}
            </button>
          </form>

          {error && <div className="auth__error">{error}</div>}

          <div className="auth__footer">
            <span>{t.haveAccount}</span>{" "}
            <Link to="/login" className="auth__link">
              {t.goLogin}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}