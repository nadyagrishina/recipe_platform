import { TEXTS, type Language } from "../constants/texts";

type Props = { lang: Language };

export default function Profile({ lang }: Props) {
  const t = TEXTS[lang];

  return (
    <section className="profile">
      <h2>Profile</h2>
    </section>
  );
}
