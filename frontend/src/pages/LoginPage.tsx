import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

type Props = { lang: Language };

export default function LoginPage({ lang }: Props) {
  const t = TEXTS[lang].auth.login;
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginApi({ username, password });
      
      if (data.token) {
        await login(data.token);
        navigate("/profile");
      }
    } catch (err: any) {
      setError(t.errorInvalid);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth auth--login">
      <div className="auth__container">
        <div className="auth__card">
          <h2 className="auth__title">{t.title}</h2>

          <form className="auth__form" onSubmit={handleLogin}>
            <div className="auth__field">
              <label htmlFor="username" className="auth__label">
                {t.usernameLabel}
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth__input"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth__input"
                placeholder={t.passwordPlaceholder}
                required
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
            <span>{t.noAccount}</span>{" "}
            <Link to="/register" className="auth__link">
              {t.goRegister}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}