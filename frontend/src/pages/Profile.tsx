import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";

type Props = {
  lang: Language;
};

type User = {
  id: number;
  username: string;
  name?: string;
  surname?: string;
  email: string;
  createdAt: string;
};

type Recipe = {
  id: number;
  name: string;
  description: string;
  preparationTimeMinutes: number;
  servings: number;
  createdAt: string;
};

export default function Profile({ lang }: Props) {
  const t = TEXTS[lang];
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

        const [userResponse, recipesResponse] = await Promise.all([
          fetch("http://localhost:8080/api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:8080/api/recipes/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (userResponse.status === 401 || userResponse.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!userResponse.ok) {
          throw new Error("Failed to load user");
        }

        if (!recipesResponse.ok) {
          throw new Error("Failed to load recipes");
        }

        const userData: User = await userResponse.json();
        const recipesData: Recipe[] = await recipesResponse.json();

        setUser(userData);
        setMyRecipes(recipesData);
      } catch (err) {
        setError(t.profile.loadError);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [navigate, t.profile.loadError]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (isLoading) {
    return (
      <section className="profile">
        <h2>{t.profile.title}</h2>
        <p>{t.profile.loading}</p>
      </section>
    );
  }

  if (error || !user) {
    return (
      <section className="profile">
        <h2>{t.profile.title}</h2>
        <p className="auth__error">{error || t.profile.loadError}</p>
      </section>
    );
  }

  const fullName =
    [user.name, user.surname].filter(Boolean).join(" ") || user.username;

  return (
    <section className="profile">
      <h2>{t.profile.title}</h2>

      <div className="profile__wrapper">
        <div className="profile__main">
          <div className="profile__card">
            <div className="profile__avatar">
              <span>👩🏻‍🍳</span>
            </div>

            <div className="profile__info">
              <h3 className="profile__name">{fullName}</h3>
              <p className="profile__email">{user.email}</p>
              <p className="profile__email">@{user.username}</p>
            </div>
          </div>

          <div className="profile__section">
            <h3 className="profile__section--title">{t.profile.aboutTitle}</h3>
            <p className="profile__text">
              {user.name || user.surname
                ? `${fullName} · ${user.email}`
                : t.profile.aboutText}
            </p>
          </div>

          <div className="profile__section">
            <h3 className="profile__section--title">{t.profile.statsTitle}</h3>

            <div className="profile__stats">
              <div className="profile__stat">
                <span className="profile__stat--value">{myRecipes.length}</span>
                <span className="profile__stat--label">
                  {t.profile.myRecipes}
                </span>
              </div>

              <div className="profile__stat">
                <span className="profile__stat--value">0</span>
                <span className="profile__stat--label">
                  {t.profile.favoriteRecipes}
                </span>
              </div>

              <div className="profile__stat">
                <span className="profile__stat--value">0</span>
                <span className="profile__stat--label">
                  {t.profile.savedRecipes}
                </span>
              </div>
            </div>
          </div>

          <div className="profile__section">
            <h3 className="profile__section--title">{t.profile.myRecipes}</h3>

            {myRecipes.length === 0 ? (
              <p className="profile__text">{t.profile.noRecipes}</p>
            ) : (
              <div className="profile__recipes">
                {myRecipes.slice(0, 3).map((recipe) => (
                  <div key={recipe.id} className="profile__recipe">
                    <h4 className="profile__recipe--title">{recipe.name}</h4>
                    <p className="profile__recipe--text">
                      {recipe.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="profile__actions">
          <h3 className="profile__actions--title">{t.profile.actions}</h3>

          <Link to="/profile/edit" className="profile__btn">
            {t.profile.editProfile}
          </Link>

          <Link to="/my-recipes" className="profile__btn">
            {t.profile.myRecipes}
          </Link>

          <Link to="/favorites" className="profile__btn">
            {t.profile.favoriteRecipes}
          </Link>

          <Link to="/settings" className="profile__btn">
            {t.profile.settings}
          </Link>

          <button
            type="button"
            className="profile__btn profile__btn--logout"
            onClick={handleLogout}
          >
            {t.profile.logout}
          </button>
        </aside>
      </div>
    </section>
  );
}
