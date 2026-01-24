import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import { register, login } from "../api/auth";
import { getUserByUsername } from "../api/users";

type Props = { lang: Language };

export default function RegisterPage({ lang }: Props) {
  const t = TEXTS[lang];
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({ username, password });

      const { token } = await login({ username, password });
      localStorage.setItem("token", token);

      const user = await getUserByUsername(username);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(t.auth.register.errorGeneric);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth auth--register">
      <div className="auth__container">
        <div className="auth__card">
          <h2 className="auth__title">{t.auth.register.title}</h2>

          <form className="auth__form" onSubmit={handleRegister}>
            <div className="auth__field">
              <label htmlFor="username" className="auth__label">
                {t.auth.register.usernameLabel}
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth__input"
                placeholder={t.auth.register.usernamePlaceholder}
                required
                autoComplete="username"
              />
            </div>

            <div className="auth__field">
              <label htmlFor="password" className="auth__label">
                {t.auth.register.passwordLabel}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth__input"
                placeholder={t.auth.register.passwordPlaceholder}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="auth__submit"
              disabled={!username || !password || loading}
            >
              {loading ? t.auth.register.loading : t.auth.register.submit}
            </button>
          </form>

          {error && <div className="auth__error">{error}</div>}

          <div className="auth__footer">
            <span>{t.auth.register.haveAccount}</span>{" "}
            <Link to="/login" className="auth__link">
              {t.auth.register.goLogin}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
