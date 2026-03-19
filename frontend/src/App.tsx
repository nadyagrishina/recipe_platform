import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Language } from "./constants/texts";
import { ROUTES } from "./constants/routes";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import PrivateRoute from "./components/auth/PrivateRoute";

import HeroPage from "./pages/HeroPage";
import RecipesPage from "./pages/RecipesPage";
import CreateRecipePage from "./pages/CreateRecipePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/Profile";
import FavoriteRecipes from "./pages/FavoriteRecipes";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import MyRecipes from "./pages/MyRecipes";
import Settings from "./pages/Settings";

export default function App() {
  const [lang, setLang] = useState<Language>("cz");

  return (
    <Routes>
      <Route element={<MainLayout lang={lang} setLang={setLang} />}>
        <Route path={ROUTES.HOME} element={<HeroPage lang={lang} />} />
        <Route path="/categories" element={<RecipesPage lang={lang} />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage lang={lang} />} />
        
        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.CREATE_RECIPE} element={<CreateRecipePage lang={lang} />} />
          <Route path="/profile" element={<Profile lang={lang} />} />
          <Route path="/favorites" element={<FavoriteRecipes lang={lang} />} />
          <Route path="/my-recipes" element={<MyRecipes lang={lang} />} />
          <Route path="/settings" element={<Settings lang={lang} />} />
        </Route>
      </Route>

      <Route element={<AuthLayout lang={lang} setLang={setLang} />}>
        <Route path="/login" element={<LoginPage lang={lang} />} />
        <Route path="/register" element={<RegisterPage lang={lang} />} />
      </Route>
    </Routes>
  );
}