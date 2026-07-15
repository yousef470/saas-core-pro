import { useState, useContext } from "react"; 
import useTheme from "../hooks/useTheme";
import { AuthContext } from "../context/auth-context";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye, EyeOff,

} from "lucide-react";
import Avatar from "../components/ui/Avatar";

import countries from "../data/countries";
import timezones from "../data/timezones";
import jobTitles from "../data/jobTitles";

function Settings() {
  const { lang, t,darkMode, toggleDarkMode, toggleLanguage } = useTheme();
  const { user, updateProfile, updatePassword, addNotification } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getInitialData = () => {
    const savedUsers = localStorage.getItem("saas_users");
    if (savedUsers && user) {
      try {
        const parsed = JSON.parse(savedUsers);
        const current = parsed.find(u => u.id === user.id);
        if (current) return current;
      } catch(e) { console.error(e); }
    }
    return user || { name: "", email: "", phone: "", twoFactor: false, emailNotifications: false };
  };

  const initialUser = getInitialData();

  const [name, setName] = useState(initialUser.name || "");
  const [email, setEmail] = useState(initialUser.email || "");
  const [phone, setPhone] = useState(initialUser.phone || "");

  const [twoFA, setTwoFA] = useState(!!initialUser.twoFactor);
  const [emailNotifications, setEmailNotifications] = useState(!!initialUser.emailNotifications);
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const [jobTitle, setJobTitle] = useState(initialUser.jobTitle || "");
  const [company, setCompany] = useState(initialUser.company || "");
  const [country, setCountry] = useState(initialUser.country || "Egypt");
  const [timezone, setTimezone] = useState(
    initialUser.timezone || (timezones[initialUser.country || "Egypt"]?.[0] || "")
  );
  const [bio, setBio] = useState(initialUser.bio || "");
  

  const [maintenanceMode, setMaintenanceMode] = useState(
    JSON.parse(localStorage.getItem("maintenanceMode")) || false
  );
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);

const [profileModal, setProfileModal] = useState(false);
const [securityModal, setSecurityModal] = useState(false);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfile({ avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const securityScore = () => {
    let score = 0;
    if (user?.avatar) score += 20;
    if (phone) score += 20;
    if (twoFA) score += 20;
    if (email) score += 20;
    if (currentPassword || user?.password) score += 20;
    return Math.min(score, 100);
  };

  const profileCompletion = () => {
    let score = 0;
    if (user?.avatar) score += 12.5;
    if (name) score += 12.5;
    if (email) score += 12.5;
    if (phone) score += 12.5;
    if (jobTitle) score += 12.5;
    if (company) score += 12.5;
    if (country) score += 12.5;
    if (bio) score += 12.5;
    return Math.round(score);
  };

  const profileTasks = [
    { label: "Profile Photo", done: !!user?.avatar },
    { label: "Full Name", done: !!name },
    { label: "Email", done: !!email },
    { label: "Phone", done: !!phone },
    { label: "Company", done: !!company },
    { label: "Job Title", done: !!jobTitle },
    { label: "Country", done: !!country },
    { label: "Timezone", done: !!timezone },
    { label: "Bio", done: !!bio },
  ];

  const securityTasks = [
    { label: "Profile Photo", done: !!user?.avatar },
    { label: "Verified Email", done: !!email },
    { label: "Phone Number", done: !!phone },
    { label: "Strong Password", done: !!user?.password },
    { label: "Two-Factor Authentication", done: twoFA },
  ];

  const completedProfileTasks = profileTasks.filter(t => t.done).length;
  const missingProfileTasks = profileTasks.filter(t => !t.done).length;
  const completedSecurityTasks = securityTasks.filter(t => t.done).length;
  const missingSecurityTasks = securityTasks.length - completedSecurityTasks;

  const getPasswordStrength = () => {
    let score = 0;
    if (newPassword.length >= 8) score += 25;
    if (/[A-Z]/.test(newPassword)) score += 25;
    if (/[0-9]/.test(newPassword)) score += 25;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 25;
    return Math.min(score, 100);
  };
  
  const passwordRules = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const passwordsMatch = confirmPassword && newPassword === confirmPassword;

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      addNotification("Error", "Passwords do not match");
      return;
    }

    if (newPassword && getPasswordStrength() < 100) {
      addNotification("Error", "Password does not meet security requirements");
      return;
    }

    const profileData = {
      name,
      email,
      phone,
      company,
      jobTitle,
      country,
      timezone,
      bio,
      twoFactor: twoFA,
      emailNotifications,
    };

    updateProfile(profileData);
    
    const savedSession = localStorage.getItem("saas_session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        localStorage.setItem("saas_session", JSON.stringify({ ...session, userId: user?.id }));
      } catch (error) {
        console.error("Session update error:", error);
      }
    }

    if (currentPassword && newPassword) {
      const result = updatePassword(currentPassword, newPassword);
      if (result?.success) {
        addNotification("Password Updated", "Your password was changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);

    localStorage.setItem("maintenanceMode", JSON.stringify(maintenanceMode));
    addNotification("Profile Updated", "Your profile information was updated.");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    localStorage.removeItem("saas_session");
    const users = JSON.parse(localStorage.getItem("saas_users") || "[]");
    const filteredUsers = users.filter(u => u.id !== user?.id);
    localStorage.setItem("saas_users", JSON.stringify(filteredUsers));
    window.location.href = "/login";
  };

  const handleLogoutAllSessions = () => {
    localStorage.removeItem("saas_session");
    addNotification("Success", "All sessions have been logged out");
    window.location.href = "/login";
  };

  return (
    <div className="space-y-7 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-normal bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
           {t.settingsPage.title}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
           {t.settingsPage.subtitle}
        </p>
      </div>

      {/* Top Cards Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
<div
  className="p-5 rounded-3xl border"
  style={{
    background: "var(--bg-card)",
    borderColor: "var(--border)",
  }}
>
  <p className="text-sm text-slate-500">
   {t.settingsPage.quickActions}
  </p>

  <div className="mt-4 space-y-3">
    {!user?.avatar && (
      <button
        onClick={() => document.getElementById("avatarUpload")?.click()}
        className="w-full flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 px-4 py-3 hover:border-indigo-500 hover:bg-indigo-500/5 transition"
      >
        <span className="text-sm font-medium">
          {t.settingsPage.uploadPhoto}
        </span>

        <span className="text-red-500 font-bold">+20%</span>
      </button>
    )}

    {!phone && (
      <button
        onClick={() => setActiveTab("profile")}
        className="w-full flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 px-4 py-3 hover:border-indigo-500 hover:bg-indigo-500/5 transition"
      >
        <span className="text-sm font-medium">
         {t.settingsPage.addPhone}
        </span>

        <span className="text-red-500 font-bold">+20%</span>
      </button>
    )}

    {!twoFA && (
      <button
        onClick={() => setActiveTab("security")}
        className="w-full flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 px-4 py-3 hover:border-indigo-500 hover:bg-indigo-500/5 transition"
      >
        <span className="text-sm font-medium">
         {t.settingsPage.enable2FA}
        </span>

        <span className="text-red-500 font-bold">+20%</span>
      </button>
    )}

    {!company && (
      <button
        onClick={() => setActiveTab("profile")}
        className="w-full flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 px-4 py-3 hover:border-indigo-500 hover:bg-indigo-500/5 transition"
      >
        <span className="text-sm font-medium">
         {t.settingsPage.addCompany}
        </span>

        <span className="text-amber-500 font-bold">
          {t.settingsPage.recommended}
        </span>
      </button>
    )}

    {user?.avatar && phone && twoFA && company && (
      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
        <p className="text-emerald-500 font-bold">
          🎉{t.settingsPage.everythingLooksGreat}
        </p>

        <p className="text-xs text-slate-500 mt-1">
          {t.settingsPage.accountConfigured}
        </p>
      </div>
    )}
  </div>
</div>

        <div className="p-5 rounded-3xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="text-sm text-slate-500">{t.settingsPage.profileCompletion}</p>
          
          <h3 className="text-2xl font-black text-slate-700 dark:text-slate-200 mt-2">{profileCompletion()}%</h3>
          <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${profileCompletion()}%` }} />
          </div>
          

<div className="mt-5 flex items-center justify-between">
    <div>
        <p className="font-semibold text-sm">
            {completedProfileTasks} / {profileTasks.length} {t.settingsPage.fieldsCompleted}
        </p>

        <p className="text-xs text-amber-500 mt-1">
            {missingProfileTasks} {t.settingsPage.remaining}
        </p>

        {profileTasks
            .filter(t => !t.done)
            .slice(0, 2)
            .map(task => (
                <div
                    key={task.label}
                    className="text-xs text-slate-500 mt-1"
                >
                    • {task.label}
                </div>
            ))}
    </div>

    <button
        onClick={() => setProfileModal(true)}
        className="text-indigo-500 font-semibold text-sm hover:underline"
    >
       {t.settingsPage.view}
    </button>
</div>

        </div>

        <div className="p-5 rounded-3xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="text-sm text-slate-500">{t.settingsPage.securityScore}</p>
          <h3 className="text-2xl font-black text-emerald-500 mt-2">{securityScore()}%</h3>
          <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500" style={{ width: `${securityScore()}%` }} />
          </div>
          
        

<div className="mt-5 flex items-center justify-between">
    <div>
        <p className="font-semibold text-sm">
            {completedSecurityTasks} / {securityTasks.length} {t.settingsPage.checks}
        </p>

        <p className="text-xs text-amber-500 mt-1">
            {missingSecurityTasks} {t.settingsPage.recommendation}
        </p>

        {securityTasks
            .filter(t => !t.done)
            .slice(0, 2)
            .map(task => (
                <div
                    key={task.label}
                    className="text-xs text-slate-500 mt-1"
                >
                    • {task.label}
                </div>
            ))}
    </div>

    <button
        onClick={() => setSecurityModal(true)}
        className="text-emerald-500 font-semibold text-sm hover:underline"
    >
       {t.settingsPage.view}
    </button>
</div>
       


          <p className={`mt-2 text-sm font-semibold ${
            securityScore() >= 100 ? "text-emerald-500" : securityScore() >= 80 ? "text-indigo-500" : securityScore() >= 60 ? "text-yellow-500" : "text-red-500"
          }`}>
            {securityScore() >= 100 ? t.settingsPage.securityExcellent : securityScore() >= 80 ? t.settingsPage.securityGood : securityScore() >= 60 ? t.settingsPage.securityNeedsImprovement : t.settingsPage.WeakSecurity}
          </p>
        </div>
      </div>

      

      {/* Tabs Switcher */}
      <div className="flex gap-2 p-2 rounded-2xl" style={{ background: "var(--bg-card)", border: `1px solid var(--border)` }}>
 {[
  { id: "profile", label: t.settingsPage.profileTab },
  { id: "system", label: t.settingsPage.platformTab },
  { id: "security", label: t.settingsPage.securityTab },
].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all -mb-[2px] ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600 dark:text-white dark:border-white"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="p-8 rounded-3xl border shadow-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 rounded-3xl border p-6 h-fit" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar
                    src={user?.avatar}
                    name={user?.name}
                    size={144}
                    className="w-36 h-36 rounded-3xl object-cover border shadow-xl ring-4 ring-indigo-500/20"
                  />
                  <label htmlFor="avatarUpload" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-indigo-700 transition">✎</label>
                  <input id="avatarUpload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
                <div className="mt-6 space-y-2 text-center">
                  <h2 className="text-2xl font-bold tracking-tight">{name || user?.name}</h2>
                  <p className="text-sm text-slate-500">{email || user?.email}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {jobTitle && <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium">{jobTitle}</span>}
                    {company && <span className="px-3 py-1 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-300 text-xs font-medium">{company}</span>}
                    {country && <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">🌍 {country}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-7 w-full">
                  <div className="rounded-2xl p-4 border text-center" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
                    <p className="text-xs text-slate-500">{t.settingsPage.plan}</p>
                    <p className="font-semibold mt-1 text-sm">{user?.plan || t.settingsPage.starter}</p>
                  </div>
                  <div className="rounded-2xl p-4 border text-center" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
                    <p className="text-xs text-slate-500">{t.settingsPage.status}</p>
                    <p className="font-semibold text-emerald-500 mt-1 text-sm">{user?.status || t.settingsPage.active}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold mb-6">{t.settingsPage.accountInformation}</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs text-slate-500">{t.settingsPage.fullName}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-2 h-12 px-4 rounded-xl border bg-transparent outline-none text-slate-900 dark:text-white"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t.settingsPage.emailAddress}</label>
                  <input
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-2 h-12 px-4 rounded-xl border bg-transparent outline-none text-slate-900 dark:text-white"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t.settingsPage.phoneNumber}</label>
                  <input
                    type="tel"
                    autoComplete="off"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-2 h-12 px-4 rounded-xl border bg-transparent outline-none text-slate-900 dark:text-white"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t.settingsPage.company}</label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full mt-2 h-12 px-4 rounded-xl border bg-transparent outline-none"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t.settingsPage.jobTitle}</label>
                  <select
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full mt-2 h-12 px-4 rounded-xl border bg-transparent outline-none bg-white dark:bg-slate-900"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value="">{t.settingsPage.selectJobTitle}</option>
                    {jobTitles.map((job) => <option key={job} value={job}>{job}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t.settingsPage.country}</label>
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setTimezone(timezones[e.target.value]?.[0] || "");
                    }}
                    className="w-full mt-2 h-12 px-4 rounded-xl border bg-transparent outline-none bg-white dark:bg-slate-900"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {countries.map((countryName) => <option key={countryName} value={countryName}>{countryName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t.settingsPage.timezone}</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full mt-2 h-12 px-4 rounded-xl border bg-transparent outline-none bg-white dark:bg-slate-900"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {(timezones[country] || []).map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500">{t.settingsPage.bio}</label>
                  <textarea
                    rows={4}
                    maxLength={200}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full mt-2 p-4 rounded-xl border bg-transparent resize-none outline-none"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-slate-500">{bio.length}/200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Tab */}
        {activeTab === "system" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold">
{t.settingsPage.platformSettingsTitle}
</h2>
              <p className="text-sm text-slate-500 mt-1">
{t.settingsPage.platformSettingsDescription}
</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <h3 className="font-semibold">{t.settingsPage.appearance}</h3>
                <p className="text-sm text-slate-500 mt-1">{t.settingsPage.appearanceDescription}</p>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <button onClick={() => toggleDarkMode(false)} className={`rounded-2xl border p-4 transition ${!darkMode ? "border-indigo-500 bg-indigo-500/10" : ""}`} style={{ borderColor: "var(--border)" }}>
                    ☀️ <div className="mt-2 text-sm">{t.settingsPage.light}</div>
                  </button>
                  <button onClick={() => toggleDarkMode(true)} className={`rounded-2xl border p-4 transition ${darkMode ? "border-indigo-500 bg-indigo-500/10" : ""}`} style={{ borderColor: "var(--border)" }}>
                    🌙 <div className="mt-2 text-sm">{t.settingsPage.dark}</div>
                  </button>
                  <button className="rounded-2xl border p-4" style={{ borderColor: "var(--border)" }}>
                    💻 <div className="mt-2 text-sm">{t.settingsPage.system}</div>
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <h3 className="font-semibold">{t.settingsPage.language}</h3>
                <p className="text-sm text-slate-500 mt-1">{t.settingsPage.languageDesc}</p>
                <select
                  value={lang}
                  onChange={() => toggleLanguage()}
                  className="mt-4 w-full h-11 rounded-xl border px-3 bg-transparent outline-none bg-white dark:bg-slate-900"
                  style={{ borderColor: "var(--border)" }}
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div className="rounded-3xl border p-6 md:col-span-2" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <h3 className="font-semibold">{t.settingsPage.notifications}</h3>
                <p className="text-sm text-slate-500 mt-1">{t.settingsPage.notificationsDesc}</p>
                <div className="space-y-5 mt-6">
                  {[
                    { title:t.settingsPage.emailNotifications, state: emailNotifications, action: setEmailNotifications },
                    { title:t.settingsPage.browserNotifications, state: browserNotifications, action: setBrowserNotifications },
                    { title:t.settingsPage.securityAlerts, state: securityAlerts, action: setSecurityAlerts },
                    { title:t.settingsPage.productUpdates, state: productUpdates, action: setProductUpdates },
                    { title:t.settingsPage.marketingEmails, state: marketingEmails, action: setMarketingEmails },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between">
                      <span>{item.title}</span>
                      <button
                        type="button"
                        onClick={() => item.action(!item.state)}
                        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${item.state ? "bg-gradient-to-r from-indigo-600 to-violet-600" : "bg-slate-300 dark:bg-slate-700"}`}
                      >
                        <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 transform ${item.state ? "translate-x-6" : "translate-x-0"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border p-6 md:col-span-2" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="font-semibold">{t.settingsPage.maintenanceMode}</h3>
                    <p className="text-sm text-slate-500 mt-1">{t.settingsPage.maintenanceModeDesc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`relative w-14 h-8 rounded-full transition-all duration-300 ${maintenanceMode ? "bg-gradient-to-r from-indigo-600 to-violet-600" : "bg-slate-300 dark:bg-slate-700"}`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 transform ${maintenanceMode ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-semibold text-lg">{t.settingsPage.changePassword}</h4>
                  <p className="text-sm text-slate-500 mt-1">{t.settingsPage.changePasswordDesc}</p>
                </div>
                <div className="text-indigo-500 text-3xl">🔒</div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500">{t.settingsPage.currentPassword}</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full mt-2 h-11 px-4 rounded-xl border bg-transparent outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 mt-1 text-slate-500`}>
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500">{t.settingsPage.newPassword}</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full mt-2 h-11 px-4 rounded-xl border bg-transparent outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 mt-1 text-slate-500`}>
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {newPassword && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-2">
                      <span>{t.settingsPage.passwordStrength}</span>
                      <span>{getPasswordStrength() < 50 ? t.settingsPage.passwordWeak : getPasswordStrength() < 100 ? t.settingsPage.passwordMedium : t.settingsPage.passwordStrong}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-4">
                      <div className="h-full transition-all" style={{ width: `${getPasswordStrength()}%`, background: getPasswordStrength() < 50 ? "#ef4444" : getPasswordStrength() < 100 ? "#f59e0b" : "#22c55e" }} />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className={passwordRules.length ? "text-emerald-500" : "text-slate-500"}> ✓ {t.settingsPage.passwordRuleLength}</div>
                      <div className={passwordRules.uppercase ? "text-emerald-500" : "text-slate-500"}>✓ {t.settingsPage.passwordRuleUppercase}</div>
                      <div className={passwordRules.number ? "text-emerald-500" : "text-slate-500"}>✓ {t.settingsPage.passwordRuleNumber}</div>
                      <div className={passwordRules.special ? "text-emerald-500" : "text-slate-500"}>✓ {t.settingsPage.passwordRuleSpecial}</div>
                      {confirmPassword && (
                        <p className={`mt-2 text-sm ${passwordsMatch ? "text-emerald-500" : "text-red-500"}`}>
                          {passwordsMatch ? t.settingsPage.passwordsMatch : t.settingsPage.passwordsNotMatch}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-500">{t.settingsPage.confirmPassword}</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full mt-2 h-11 px-4 rounded-xl border bg-transparent outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute ${lang === "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 mt-1 text-slate-500`}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Factor authentication details */}
            <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h4 className="font-semibold">{t.settingsPage.twoFactorAuthentication}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFA(!twoFA)}
                  className={`relative w-14 h-8 rounded-full transition-all duration-300 ${twoFA ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-slate-300 dark:bg-slate-700"}`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 transform ${twoFA ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>{t.settingsPage.status}</span>
                  <span className={twoFA ? "text-emerald-500 font-medium" : "text-slate-500"}>{twoFA ? t.settingsPage.enabled : t.settingsPage.disabled}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.settingsPage.method}</span>
                  <span>{t.settingsPage.authenticatorApp}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                  <span>{t.settingsPage.recoveryCodes}</span>
                  <button type="button" className="text-indigo-500 font-medium hover:underline">{t.settingsPage.view}</button>
                </div>
              </div>
            </div>

            {/* Security Score Widget Box */}
            <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">{t.settingsPage.securityScoreDetailed}</h4>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold">{securityScore()}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all" style={{ width: `${securityScore()}%` }} />
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between"><span>{t.settingsPage.profilePhoto}</span><span>{user?.avatar ? "✅" : "❌"}</span></div>
                <div className="flex justify-between"><span>{t.settingsPage.emailVerified}</span><span>{email ? "✅" : "❌"}</span></div>
                <div className="flex justify-between"><span>{t.settingsPage.phoneNumber}</span><span>{phone ? "✅" : "❌"}</span></div>
                <div className="flex justify-between"><span>{t.settingsPage.phoneNumber}</span><span>{user?.password ? "✅" : "❌"}</span></div>
                <div className="flex justify-between"><span>{t.settingsPage.twoFactor}</span><span>{twoFA ? "✅" : "❌"}</span></div>
              </div>
            </div>

            {/* Sessions management */}
            <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <h3 className="font-semibold">{t.settingsPage.currentSession}</h3>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between"><span>{t.settingsPage.browser}</span><span>Chrome</span></div>
                <div className="flex justify-between"><span>{t.settingsPage.device}</span><span>Windows 11</span></div>
                <div className="flex justify-between"><span>{t.settingsPage.ipAddress}</span><span>192.168.1.12</span></div>
                <div className="flex justify-between"><span>{t.settingsPage.location}</span><span>Alexandria, Egypt</span></div>
                <div className="flex justify-between"><span>{t.settingsPage.lastLogin}</span><span>2 Minutes Ago</span></div>
                <div className="flex justify-between pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                  <span>Status</span>
                  <span className="text-emerald-500 font-medium">{t.settingsPage.currentDevice}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <h3 className="font-semibold">{t.settingsPage.connectedDevices}</h3>
              <div className="space-y-5 mt-5 text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Chrome</p>
                    <p className="text-xs text-slate-500">Windows 11</p>
                  </div>
                  <button type="button" className="text-red-500 hover:underline">{t.settingsPage.connectedDevices}{t.settingsPage.disconnect}</button>
                </div>
                <hr style={{ borderColor: "var(--border)" }} />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Safari</p>
                    <p className="text-xs text-slate-500">iPhone</p>
                  </div>
                  <button type="button" className="text-red-500 hover:underline">Disconnect</button>
                </div>
              </div>
            </div>

           <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <h3 className="font-semibold">{t.settingsPage.recentActivity}</h3>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between"><span>{t.settingsPage.passwordChanged}</span><span className="text-slate-500">{t.settingsPage.today}</span></div>
                <div className="flex justify-between"><span>{t.settingsPage.profileUpdatedActivity}</span><span className="text-slate-500">{t.settingsPage.yesterday}</span></div>
                <div className="flex justify-between"><span>{t.settingsPage.twoFactorEnabled}</span><span className="text-slate-500">{t.settingsPage.twoDaysAgo}</span></div>
              </div>
            </div>

            <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <h3 className="font-semibold">{t.settingsPage.securityTips}</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li>✅ {t.settingsPage.tipEnable2FA}</li>
                <li>✅ {t.settingsPage.tipStrongPassword}</li>
                <li>✅ {t.settingsPage.tipChangePassword}</li>
                <li>✅ {t.settingsPage.tipRecoveryCodes}</li>
              </ul>
            </div>

            {/* Danger Zone */}
            <div className="rounded-3xl border border-red-500/20 p-6 mt-6 bg-red-500/5">
              <h4 className="font-semibold text-red-500">{t.settingsPage.dangerZone}</h4>
              <p className="text-sm text-slate-500 mt-2">{t.settingsPage.dangerZoneDesc}</p>
              <div className="flex gap-3 mt-5 flex-wrap">
                <button
                  type="button"
                  onClick={handleLogoutAllSessions}
                  className="px-4 py-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition text-sm font-medium"
                >
                  {t.settingsPage.logoutAllSessions}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium shadow-md"
                >
                  {t.settingsPage.deleteAccount}
                </button>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>

{/* Profile Completion Modal */}

{profileModal && (

<div
className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
onClick={() => setProfileModal(false)}
>

<motion.div
initial={{opacity:0,scale:.95}}
animate={{opacity:1,scale:1}}
exit={{opacity:0,scale:.95}}
onClick={(e)=>e.stopPropagation()}
className="w-full max-w-md rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 space-y-5 shadow-2xl"
>

<h2 className="text-xl font-black">
{t.settingsPage.profileCompletionTitle}
</h2>

<div className="space-y-3">

{profileTasks.map(task=>(
<div
key={task.label}
className="flex justify-between items-center"
>

<span>{task.label}</span>

{task.done ?

<span className="text-emerald-500">✔</span>

:

<span className="text-red-500">✖</span>

}

</div>
))}

</div>

<button
onClick={()=>setProfileModal(false)}
className="w-full h-11 rounded-xl bg-indigo-600 text-white font-bold"
>

{t.settingsPage.close}

</button>

</motion.div>

</div>

)}

{/* Security Modal */}

{securityModal && (

<div
className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
onClick={()=>setSecurityModal(false)}
>

<motion.div
initial={{opacity:0,scale:.95}}
animate={{opacity:1,scale:1}}
exit={{opacity:0,scale:.95}}
onClick={(e)=>e.stopPropagation()}
className="w-full max-w-md rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 space-y-5 shadow-2xl"
>

<h2 className="text-xl font-black">

{t.settingsPage.securityChecklist}

</h2>

<div className="space-y-3">

{securityTasks.map(task=>(
<div
key={task.label}
className="flex justify-between items-center"
>

<span>{task.label}</span>

{task.done ?

<span className="text-emerald-500">✔</span>

:

<span className="text-red-500">✖</span>

}

</div>
))}

</div>

<button
onClick={()=>setSecurityModal(false)}
className="w-full h-11 rounded-xl bg-emerald-600 text-white font-bold"
>

{t.settingsPage.close}

</button>

</motion.div>

</div>

)}

</AnimatePresence>

        {/* Global Save Changes Trigger */}
        <div className="mt-8 pt-4 border-t flex justify-end" style={{ borderColor: "var(--border)" }}>
          <button
            type="button"
            onClick={handleSave}
            className="h-12 px-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {saved ? `✓ ${t.settingsPage.savedSuccessfully}` : t.settingsPage.saveChanges}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Settings;