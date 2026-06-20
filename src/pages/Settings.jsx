import { useState, useContext } from "react"; 
import useTheme from "../hooks/useTheme";
import { AuthContext } from "../context/auth-context";
import { Eye, EyeOff } from "lucide-react";

function Settings() {
  const { lang, darkMode, toggleDarkMode, toggleLanguage } = useTheme();
  const { user, updateProfile, updatePassword, addNotification } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // الأمان الأول: قراءة البيانات الابتدائية من الـ LocalStorage مباشرة أو الـ user كملاذ أخير
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

  // فصل الـ States تماماً عن الـ Context لمنع التحديث اللحظي أثناء الكتابة
  const [name, setName] = useState(initialUser.name || "");
  const [email, setEmail] = useState(initialUser.email || "");
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [twoFA, setTwoFA] = useState(!!initialUser.twoFactor);
  const [emailNotifications, setEmailNotifications] = useState(!!initialUser.emailNotifications);
  
  // حل مشكلة الخطأ الأول والثاني: استخدام وضع الصيانة في الواجهة
  const [maintenanceMode, setMaintenanceMode] = useState(
  JSON.parse(localStorage.getItem("maintenanceMode")) || false
);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);

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

  if (user?.avatar) score += 25;
  if (phone) score += 25;
  if (twoFA) score += 25;
  if (email) score += 25;

  return score;
};

  const profileCompletion = () => {
    let score = 0;
    if (name) score += 25;
    if (email) score += 25;
    if (phone) score += 25;
    if (user?.avatar) score += 25;
    return score;
  };

  // حل مشكلة الخطأ الثالث: تم ربط الدالة الآن بشريط الأمان بالأسفل
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

const passwordsMatch =
  confirmPassword &&
  newPassword === confirmPassword;

  // دالة الحفظ الصارمة
  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      addNotification("Error", "Passwords do not match");
      return;
    }

    const profileData = {
      name: name,
      email: email,
      phone: phone,
      twoFactor: twoFA,
      emailNotifications: emailNotifications,
    };

    // إرسال البيانات للـ Context والـ LocalStorage معاً
    updateProfile(profileData);
    
    // تحديث الجلسة يدوياً للتأكيد القصوى
    const savedSession = localStorage.getItem("saas_session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        localStorage.setItem("saas_session", JSON.stringify({ ...session, userId: user.id }));
      } catch (error) {
        // حل مشكلة الخطأ الرابع والخامس: التعامل مع الخطأ وعدم ترك البلوك فارغاً
        console.error("Session update error:", error);
      }
    }

    addNotification("Profile Updated", "Your profile information was updated.");
    if (
  newPassword &&
  getPasswordStrength() < 100
) {
  addNotification(
    "Error",
    "Password does not meet security requirements"
  );
  return;
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
    setTimeout(() => {
      setSaved(false);
    }, 2500);

    localStorage.setItem(
  "maintenanceMode",
  JSON.stringify(maintenanceMode)
);
  };


  const handleDeleteAccount = () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account?"
  );

  if (!confirmDelete) return;

  localStorage.removeItem("saas_session");

  const users = JSON.parse(
    localStorage.getItem("saas_users") || "[]"
  );

  const filteredUsers = users.filter(
    u => u.id !== user.id
  );

  localStorage.setItem(
    "saas_users",
    JSON.stringify(filteredUsers)
  );

  window.location.href = "/login";
};

const handleLogoutAllSessions = () => {
  localStorage.removeItem("saas_session");

  addNotification(
    "Success",
    "All sessions have been logged out"
  );

  window.location.href = "/login";
};
  

  return (
    <div className="space-y-7 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          {lang === "ar" ? "إعدادات النظام" : "System Settings"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {lang === "ar"
            ? "تخصيص تفاصيل حسابك، خيارات المنصة، وتفضيلات الأمان."
            : "Configure account parameters, platform preferences, and security access."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="text-sm text-slate-500">Account Status</p>
          <h3 className="text-2xl font-black text-emerald-500 mt-2">{user?.status || "Active"}</h3>
        </div>

        <div className="p-5 rounded-3xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="text-sm text-slate-500">Profile Completion</p>
          <h3 className="text-2xl font-black text-indigo-500 mt-2">{profileCompletion()}%</h3>
          <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${profileCompletion()}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-3xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="text-sm text-slate-500">Security Score</p>
          <h3 className="text-2xl font-black text-emerald-500 mt-2">{securityScore()}%</h3>
          <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500" style={{ width: `${securityScore()}%` }} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-2 rounded-2xl" style={{ background: "var(--bg-card)", border: `1px solid var(--border)` }}>
        {[
          { id: "profile", labelAr: "الحساب الشخصي", labelEn: "Profile" },
          { id: "system", labelAr: "النظام", labelEn: "Platform" },
          { id: "security", labelAr: "الأمان", labelEn: "Security" },
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
            {lang === "ar" ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      <div className="p-8 rounded-3xl border shadow-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        
        {activeTab === "profile" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 rounded-3xl border p-6 h-fit" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={user?.avatar || "https://i.pravatar.cc/150"}
                    alt="avatar"
                    className="w-36 h-36 rounded-3xl object-cover border shadow-xl ring-4 ring-indigo-500/20"
                  />
                  <label htmlFor="avatarUpload" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer">✎</label>
                  <input id="avatarUpload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
                <h2 className="text-xl font-bold mt-5">{name || user?.name}</h2>
                <p className="text-sm text-slate-500">{email || user?.email}</p>
                <div className="flex gap-3 mt-5">
                  <div className="px-4 py-2 rounded-xl bg-indigo-500/10">
                    <p className="text-xs text-slate-500">Plan</p>
                    <p className="font-semibold">{user?.plan || "Starter"}</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/10">
                    <p className="text-xs text-slate-500">Status</p>
                    <p className="font-semibold">{user?.status || "Active"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold mb-6">{lang === "ar" ? "معلومات الحساب" : "Account Information"}</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs text-slate-500">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-2 h-12 px-4 rounded-xl border bg-transparent outline-none text-slate-900 dark:text-white"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Email Address</label>
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
                  <label className="text-xs text-slate-500">Phone Number</label>
                  <input
                    type="tel"
                    autoComplete="off"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-2 h-12 px-4 rounded-xl border bg-transparent outline-none text-slate-900 dark:text-white"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold">{lang === "ar" ? "إعدادات المنصة" : "Platform Settings"}</h2>
              <p className="text-sm text-slate-500 mt-1">{lang === "ar" ? "إدارة تفضيلات المنصة" : "Manage your platform preferences."}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="font-semibold">{lang === "ar" ? "الوضع الليلي" : "Dark Mode"}</h3>
                    <p className="text-sm text-slate-500 mt-1">Switch application appearance.</p>
                  </div>
                  <button type="button" onClick={toggleDarkMode} className={`relative w-14 h-8 rounded-full transition-all duration-300 ${darkMode ? "bg-gradient-to-r from-indigo-600 to-violet-600" : "bg-slate-300 dark:bg-slate-700"}`}>
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${darkMode ? (lang === "ar" ? "right-1" : "left-7") : (lang === "ar" ? "right-7" : "left-1")}`} />
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="font-semibold">{lang === "ar" ? "اللغة" : "Language"}</h3>
                    <p className="text-sm text-slate-500 mt-1">Change interface language.</p>
                  </div>
                  <button type="button" onClick={toggleLanguage} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">
                    {lang === "en" ? "العربية" : "English"}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="font-semibold">{lang === "ar" ? "إشعارات البريد" : "Email Notifications"}</h3>
                    <p className="text-sm text-slate-500 mt-1">{lang === "ar" ? "استقبل التحديثات عبر البريد" : "Receive email updates."}</p>
                  </div>
                  <button type="button" onClick={() => setEmailNotifications(!emailNotifications)} className={`relative w-14 h-8 rounded-full transition-all duration-300 ${emailNotifications ? "bg-gradient-to-r from-indigo-600 to-violet-600" : "bg-slate-300 dark:bg-slate-700"}`}>
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${emailNotifications ? (lang === "ar" ? "right-1" : "left-7") : (lang === "ar" ? "right-7" : "left-1")}`} />
                  </button>
                </div>
              </div>

              
              <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h3 className="font-semibold">{lang === "ar" ? "وضع الصيانة" : "Maintenance Mode"}</h3>
                    <p className="text-sm text-slate-500 mt-1">Temporarily lock platform access.</p>
                  </div>
                  <button type="button" onClick={() => setMaintenanceMode(!maintenanceMode)} className={`relative w-14 h-8 rounded-full transition-all duration-300 ${maintenanceMode ? "bg-gradient-to-r from-indigo-600 to-violet-600" : "bg-slate-300 dark:bg-slate-700"}`}>
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${maintenanceMode ? (lang === "ar" ? "right-1" : "left-7") : (lang === "ar" ? "right-7" : "left-1")}`} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <h4 className="font-semibold mb-5">{lang === "ar" ? "تغيير كلمة المرور" : "Change Password"}</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500">{lang === "ar" ? "كلمة المرور الحالية" : "Current Password"}</label>
<div className="relative">
  <input
    type={showCurrentPassword ? "text" : "password"}
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    className="w-full mt-2 h-11 px-4 pr-12 rounded-xl border bg-transparent outline-none"
    style={{ borderColor: "var(--border)" }}
  />

  <button
    type="button"
    onClick={() =>
      setShowCurrentPassword(!showCurrentPassword)
    }
className={`
absolute
${lang === "ar" ? "left-3" : "right-3"}
top-1/2
-transform-y-1/2
text-slate-500
`}
  >
    {showCurrentPassword ? (
      <EyeOff size={18} />
    ) : (
      <Eye size={18} />
    )}
  </button>
</div>
                </div>
                <div>
                  <label className="text-xs text-slate-500">{lang === "ar" ? "كلمة المرور الجديدة" : "New Password"}</label>
<div className="relative">
  <input
    type={showNewPassword ? "text" : "password"}
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full mt-2 h-11 px-4 pr-12 rounded-xl border bg-transparent outline-none"
    style={{ borderColor: "var(--border)" }}
  />

  <button
    type="button"
    onClick={() => setShowNewPassword(!showNewPassword)}
className={`
absolute
${lang === "ar" ? "left-3" : "right-3"}
top-1/2
-transform-y-1/2
text-slate-500
`}
  >
    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
                </div>

               
{newPassword && (
  <div className="mt-3">

    <div className="flex justify-between text-xs mb-2">
      <span>Password Strength</span>
      <span>
        {getPasswordStrength() < 50
          ? "Weak"
          : getPasswordStrength() < 100
          ? "Medium"
          : "Strong"}
      </span>
    </div>

    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-4">
      <div
        className="h-full bg-indigo-600 transition-all"
        style={{
          width: `${getPasswordStrength()}%`,
        }}
      />
    </div>

    <div className="space-y-2 text-sm">

      <div className={passwordRules.length
        ? "text-emerald-500"
        : "text-slate-500"}>
        ✓ At least 8 characters
      </div>

      <div className={passwordRules.uppercase
        ? "text-emerald-500"
        : "text-slate-500"}>
        ✓ One uppercase letter
      </div>

      <div className={passwordRules.number
        ? "text-emerald-500"
        : "text-slate-500"}>
        ✓ One number
      </div>

      <div className={passwordRules.special
        ? "text-emerald-500"
        : "text-slate-500"}>
        ✓ One special character
      </div>
{confirmPassword && (
  <p
    className={`mt-2 text-sm ${
      passwordsMatch
        ? "text-emerald-500"
        : "text-red-500"
    }`}
  >
    {passwordsMatch
      ? "Passwords match"
      : "Passwords do not match"}
  </p>
)}
    </div>

  </div>
)}

                <div>
                  <label className="text-xs text-slate-500">{lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}</label>
<div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full mt-2 h-11 px-4 pr-12 rounded-xl border bg-transparent outline-none"
    style={{ borderColor: "var(--border)" }}
  />

  <button
    type="button"
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
className={`
absolute
${lang === "ar" ? "left-3" : "right-3"}
top-1/2
-transform-y-1/2
text-slate-500
`}
  >
    {showConfirmPassword ? (
      <EyeOff size={18} />
    ) : (
      <Eye size={18} />
    )}
  </button>
</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h4 className="font-semibold">{lang === "ar" ? "التحقق بخطوتين" : "Two-Factor Authentication"}</h4>
                </div>
                <button type="button" onClick={() => setTwoFA(!twoFA)} className={`relative w-14 h-8 rounded-full transition-all duration-300 ${twoFA ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${twoFA ? (lang === "ar" ? "right-1" : "left-7") : (lang === "ar" ? "right-7" : "left-1")}`} />
                </button>
              </div>
              <div
  className="rounded-3xl border p-6 mt-6"
  style={{
    borderColor: "var(--border)",
    background: "var(--bg-card)",
  }}
>
  <div className="flex justify-between items-center mb-4">
    <h4 className="font-semibold">
      Security Score
    </h4>

    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-sm">
      {securityScore()}%
    </span>
  </div>

  <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
    <div
      className="h-full bg-indigo-600 transition-all"
      style={{
        width: `${securityScore()}%`,
      }}
    />
  </div>

  <p className="text-sm text-slate-500 mt-4">
    Improve your score by enabling two-factor authentication and completing your profile.
  </p>
</div>
            </div>
            <div
  className="rounded-3xl border border-red-500/20 p-6 mt-6"
>
  <h4 className="font-semibold text-red-500">
    Danger Zone
  </h4>

  <div className="flex gap-3 mt-5 flex-wrap">

    <button
    onClick={handleLogoutAllSessions}
      className="
      px-4
      py-2
      rounded-xl
      border
      border-red-500/20
      text-red-500
      "
    >
      Logout All Sessions
    </button>

    <button
    onClick={handleDeleteAccount}
      className="
      px-4
      py-2
      rounded-xl
      bg-red-600
      text-white
      "
    >
      Delete Account
    </button>

  </div>
</div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t flex justify-end" style={{ borderColor: "var(--border)" }}>
          <button
            type="button"
            onClick={handleSave}
            className="h-12 px-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg transition-all hover:scale-[1.02]"
          >
            {saved ? (lang === "ar" ? "✓ تم الحفظ" : "✓ Saved Successfully") : (lang === "ar" ? "حفظ التغييرات" : "Save Changes")}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Settings;