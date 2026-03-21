import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TEXTS, type Language } from "../constants/texts";
import { updateUserSettings, getUserSettings } from "../api/users";
import { UserSettingsDto, MeasurementUnit } from "../types/api"
import { ArrowBackIcon } from "../components/ui/icons";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

type Props = { lang: Language };

const API_URL = "http://localhost:8080";

export default function Settings({ lang }: Props) {
    const t = TEXTS[lang];
    const s = t.settings;
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [settingsData, setSettingsData] = useState<UserSettingsDto>({
        name: "",
        surname: "",
        description: "",
        imageUrl: "",
        measurementUnitSystem: "METRIC"
    });

    useEffect(() => {
        async function loadData() {
            try {
                const settings = await getUserSettings();
                if (settings) {
                    setSettingsData({
                        name: settings.name || "",
                        surname: settings.surname || "",
                        description: settings.description || "",
                        imageUrl: settings.imageUrl || "",
                        measurementUnitSystem: settings.measurementUnitSystem || "METRIC"
                    });
                }
            } catch (err: any) {
                if (err.response?.status !== 404) console.error(err);
            }
        }
        loadData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserSettings(settingsData);
            await refreshUser();
        } catch (err) {
            alert(t.settings.error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const response = await api.post("/api/users/me/settings/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setSettingsData({ ...settingsData, imageUrl: response.data.imageUrl });
        } catch (err) {
            alert("Chyba při nahrávání");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAvatar = () => {
        setSettingsData({ ...settingsData, imageUrl: "" });
    };

    const fullImageUrl = settingsData.imageUrl
        ? (settingsData.imageUrl.startsWith("http") ? settingsData.imageUrl : `${API_URL}${settingsData.imageUrl}`)
        : null;

    return (
        <section className="settings">
            <header className="settings__header">
                <button onClick={() => navigate(-1)} className="settings__back">
                    <ArrowBackIcon className="icon-sm" /> {t.recipeDetail.actions.back}
                </button>
                <h2 className="settings__title">{s.title}</h2>
            </header>

            <form className="settings__form" onSubmit={handleSave}>
                <div className="settings__section settings__section--info">
                    <div className="settings__section--inner">
                        <h3>{s.profileSection}</h3>

                        <div className="settings__field">
                            <label>{s.avatarUrl}</label>
                            <div className="settings__avatar-upload">
                                {fullImageUrl ? (
                                    <div className="settings__avatar-container">
                                        <img src={fullImageUrl} className="settings__preview" />
                                        <button type="button" className="settings__delete-avatar" onClick={handleDeleteAvatar}>✕</button>
                                    </div>
                                ) : (
                                    <>
                                        <input type="file" id="avatar-input" accept="image/*" onChange={handleFileChange} hidden />
                                        <label htmlFor="avatar-input" className="settings__file-label">
                                            {s.uploadPhoto}
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="settings__field">
                            <label>{s.name}</label>
                            <input type="text" value={settingsData.name} onChange={(e) => setSettingsData({ ...settingsData, name: e.target.value })} />
                        </div>

                        <div className="settings__field">
                            <label>{s.surname}</label>
                            <input type="text" value={settingsData.surname} onChange={(e) => setSettingsData({ ...settingsData, surname: e.target.value })} />
                        </div>
                    </div>

                    <div className="settings__field settings__field--textarea">
                        <label>{s.description}</label>
                        <textarea
                            value={settingsData.description}
                            onChange={(e) => setSettingsData({ ...settingsData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="settings__section">
                    <h3>{s.preferencesSection}</h3>
                    <div className="settings__field">
                        <label>{s.unitLabel}</label>
                        <select value={settingsData.measurementUnitSystem}
                            onChange={(e) => setSettingsData({
                                ...settingsData,
                                measurementUnitSystem: e.target.value as MeasurementUnit
                            })}>
                            <option value="METRIC">{s.unitMetric}</option>
                            <option value="IMPERIAL">{s.unitImperial}</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="settings__save-btn" disabled={loading}>
                    {loading ? "..." : s.saveBtn}
                </button>
            </form>
        </section>
    );
}