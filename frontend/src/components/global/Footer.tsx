import { TEXTS, type Language } from "../../constants/texts";

type Props = {
  lang: Language;
};

export default function Footer({ lang }: Props) {
  const t = TEXTS[lang];

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__logo">
          <strong>COOK&SHARE</strong>
          <span>{t.header.logoSubtext}</span>
        </div>
        <div className="footer__copy">
          &copy; {new Date().getFullYear()} — Bakalářská práce
        </div>
      </div>
    </footer>
  );
}