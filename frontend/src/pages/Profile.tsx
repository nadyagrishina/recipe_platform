import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import { getCurrentUser } from "../api/users";
import { getFavoriteRecipes, getMyRecipes } from "../api/recipes";
import { useAuth } from "../context/AuthContext";
import { getUserSettings } from "../api/users";


type Props = {
  lang: Language;
};

export default function Profile({ lang }: Props) {
  const t = TEXTS[lang];
  const navigate = useNavigate();
  const { logout } = useAuth();
  const API_URL = "http://localhost:8080";

  const [user, setUser] = useState<any>(null);
  const [myRecipes, setMyRecipes] = useState<any[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");

        const [userRes, myRecipesRes, favoriteRecipesRes, settingsRes] = await Promise.all([
          getCurrentUser(),
          getMyRecipes(0, 50),
          getFavoriteRecipes(),
          getUserSettings()
        ]);

        const combinedUser = {
          ...userRes,
          name: settingsRes.name,
          surname: settingsRes.surname,
          imageUrl: settingsRes.imageUrl,
          description: settingsRes.description,
          measurementUnitSystem: settingsRes.measurementUnitSystem
        };

        setUser(combinedUser);

        const myData = myRecipesRes.data?.content || myRecipesRes.data || [];
        setMyRecipes(Array.isArray(myData) ? myData : []);

        const favData = favoriteRecipesRes.data?.content || favoriteRecipesRes.data || [];
        setFavoriteRecipes(Array.isArray(favData) ? favData : []);

      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate("/login");
        } else {
          setError(t.profile.loadError);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [navigate, t.profile.loadError, logout]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const locale = lang === "en" ? "en-US" : "cs-CZ";
    return new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <section className="profile">
        <h2 className="profile__title">{t.profile.title}</h2>
        <p className="profile__loading">{t.profile.loading}</p>
      </section>
    );
  }

  if (error || !user) {
    return (
      <section className="profile">
        <h2 className="profile__title">{t.profile.title}</h2>
        <p className="profile__error">{error || t.profile.loadError}</p>
      </section>
    );
  }

  const fullName = [user.name, user.surname].filter(Boolean).join(" ") || user.username;

  return (
    <section className="profile">
      <h2 className="profile__title">{t.profile.title}</h2>

      <div className="profile__wrapper">
        <div className="profile__main">
          <div className="profile__card">
            <div className="profile__avatar" onClick={() => user.imageUrl && setIsModalOpen(true)}>
              {user.imageUrl ? (
                <img
                  src={user.imageUrl.startsWith("http") ? user.imageUrl : `${API_URL}${user.imageUrl}`}
                />
              ) : (
                <img
                  src="/images/default-avatar.png"
                />
              )}
            </div>

            <div className="profile__info">
              <h3 className="profile__name">{fullName}</h3>
              <p className="profile__email">{user.email}</p>
              <p className="profile__email">@{user.username}</p>
              {user.createdAt && (
                <p className="profile__date">
                  {t.profile.joined}:
                  <span>{formatDate(user.createdAt)}</span>
                </p>
              )}

              {user.updatedAt && (
                <p className="profile__date">
                  {t.profile.updated}:
                  <span>{formatDate(user.updatedAt)}</span>
                </p>
              )}
            </div>
          </div>

          <div className="profile__section">
            <h3 className="profile__section--title">{t.profile.aboutTitle}</h3>
            <div className="profile__about-content">
              {user.description ? (
                <p className="profile__text profile__text--description">
                  {user.description}
                </p>
              ) : (
                <p className="profile__text">
                  {t.profile.aboutText}
                </p>
              )}
              {(user.name || user.surname) && (
                <p className="profile__text--meta">
                  {fullName} • {user.email}
                </p>
              )}
            </div>
          </div>

          <div className="profile__section">
            <h3 className="profile__section--title">{t.profile.statsTitle}</h3>

            <div className="profile__stats">
              <div className="profile__stat">
                <span className="profile__stat--value">{myRecipes.length}</span>
                <span className="profile__stat--label">{t.profile.myRecipes}</span>
              </div>
              <div className="profile__stat">
                <span className="profile__stat--value">{favoriteRecipes.length}</span>
                <span className="profile__stat--label">{t.profile.favoriteRecipes}</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="profile__actions">
          <h3 className="profile__actions--title">{t.profile.actions}</h3>
          <Link to="/my-recipes" className="profile__btn">{t.profile.myRecipes}</Link>
          <Link to="/favorites" className="profile__btn">{t.profile.favoriteRecipes}</Link>
          <Link to="/settings" className="profile__btn profile__btn--settings">
            {t.profile.settings}
          </Link>
          <button type="button" className="profile__btn profile__btn--logout" onClick={handleLogout}>
            {t.profile.logout}
          </button>
        </aside>
      </div>

      {isModalOpen && (
        <div className="profile__modal" onClick={() => setIsModalOpen(false)}>
          <div className="profile__modal-content">
            <img
              src={user.imageUrl.startsWith("http") ? user.imageUrl : `${API_URL}${user.imageUrl}`}
            />
            <button className="profile__modal-close">✕</button>
          </div>
        </div>
      )}
    </section>
  );
}