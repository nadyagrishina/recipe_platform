import { useNavigate } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import { useRef } from "react";
import { ArrowIcon } from "../components/ui/icons";

type Props = {
  lang: Language;
};

export default function HeroPage({ lang }: Props) {
  const t = TEXTS[lang];
  const navigate = useNavigate();
  const navigatedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 10 && !navigatedRef.current) {
      navigatedRef.current = true;
      timeoutRef.current = window.setTimeout(() => {
        navigate("/categories");
      }, 250);
    }
  };

  return (
    <section className="hero__wrapper" onWheel={handleWheel}>
      <div className="hero__text--wrapper">
        <h1 className="hero__title">
          {t.hero.title}
          <span className="hero__title--span">{t.hero.titleAccent}</span>
        </h1>
        <p className="hero__subtitle">{t.hero.titleSubtext}</p>
      </div>

      <div className="hero__button--wrapper">
        <button
          type="button"
          className="hero__scroll"
          onClick={() => navigate("/categories")}
          aria-label="Go to categories"
        >
          <ArrowIcon className="icon-lg" />
        </button>
      </div>
    </section>
  );
}
