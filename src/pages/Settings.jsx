import { useState } from "react";
import useTheme from "../hooks/useTheme";

import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

function Settings() {
  const {
  lang,
  darkMode,
  toggleDarkMode,
  toggleLanguage,
} = useTheme();
  const { user, updateProfile, updatePassword, addNotification } =
    useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");

  // حالات فورم الملف الشخصي
const [profile, setProfile] =
useState({
  name: user?.name || "",
  email: user?.email || "",
  phone: user?.phone || "",
});

const [confirmPassword, setConfirmPassword] = useState("");

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] =
useState(user?.emailNotifications || false);
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [saved, setSaved] = useState(false);
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      updateProfile({
        avatar: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const securityScore = () => {
   

let score = 40;

if (user?.avatar) score += 20;
if (user?.phone) score += 20;
if (user?.twoFactor) score += 20;

    if (user?.password?.match(/[A-Z]/)) score += 10;

    if (user?.password?.match(/[0-9]/)) score += 10;

 

    return score;
  };

  const getPasswordStrength = () => {
 let score = 0;

 if(newPassword.length >= 8) score += 25;
 if(/[A-Z]/.test(newPassword)) score += 25;
 if(/[0-9]/.test(newPassword)) score += 25;
 if(/[^A-Za-z0-9]/.test(newPassword)) score += 25;

return Math.min(score, 100);
}

  const handleSave = () => {

        if (
  newPassword &&
  confirmPassword &&
  newPassword !== confirmPassword
) {
  addNotification(
    "Error",
    "Passwords do not match"
  );
  return;
}
     {
updateProfile({
  name: profile.name,
  email: profile.email,
  phone: profile.phone,
  twoFactor: twoFA,
  emailNotifications,
});

      addNotification(
        "Profile Updated",
        "Your profile information was updated.",
      );
    }
    if (currentPassword && newPassword) {
      const result = updatePassword(currentPassword, newPassword);

      if (result.success) {
        addNotification(
          "Password Updated",
          "Your password was changed successfully.",
        );
      }
    }
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);

  };

const [twoFA, setTwoFA] =
  useState(user?.twoFactor || false);

  return (
    <div className="space-y-7 animate-fade-in pb-10">
      {/* 1️⃣ الهيدر العلوي */}
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
        <div
          className="p-5 rounded-3xl border"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <p className="text-sm text-slate-500">Account Status</p>
          <h3 className="text-2xl font-black text-emerald-500 mt-2">
            {user?.status}
          </h3>
        </div>

        <div
          className="p-5 rounded-3xl border"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <p className="text-sm text-slate-500">Security Score</p>
          <h3 className="text-2xl font-black text-indigo-500 mt-2">
            {securityScore()}%
          </h3>
                  <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
            style={{
              width: `${securityScore()}%`,
            }}
          />
        </div>
        </div>


        <div
          className="p-5 rounded-3xl border"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <p className="text-sm text-slate-500">Notifications</p>
          <h3 className="text-2xl font-black text-violet-500 mt-2">
            {emailNotifications ? "Enabled" : "Disabled"}
          </h3>
        </div>
      </div>

      {/* 2️⃣ أزرار التنقل بين الأقسام (Tabs) بتصميم ناعم */}
      <div
        className="flex gap-2 p-2 rounded-2xl"
        style={{
          background: "var(--bg-card)",
          border: `1px solid var(--border)`,
        }}
      >
        {[
          { id: "profile", labelAr: "الحساب الشخصي", labelEn: "Profile" },
          { id: "system", labelAr: "النظام", labelEn: "Platform" },
          { id: "security", labelAr: "الأمان", labelEn: "Security" },
        ].map((tab) => (
          <button
            key={tab.id}
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

      {/* 3️⃣ محتوى الأقسام الديناميكي */}
      <div
        className="p-8 rounded-3xl border shadow-sm"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        {/* قسم الملف الشخصي */}
      {activeTab === "profile" && (
  <div className="grid lg:grid-cols-3 gap-8">
          <div
  className="
  lg:col-span-1
  rounded-3xl
  border
  p-6
  h-fit
  "
  style={{
    borderColor: "var(--border)",
    background: "var(--bg-card)",
  }}
>
  <div className="flex flex-col items-center text-center">

    <div className="relative">
      <img
        src={user?.avatar}
        alt="avatar"
        className="
        w-36 h-36
        rounded-3xl
        object-cover
        border
        shadow-xl
        ring-4
        ring-indigo-500/20
        "
      />

      <label
        htmlFor="avatarUpload"
        className="
        absolute
        bottom-0
        right-0
        w-8
        h-8
        rounded-full
        bg-indigo-600
        text-white
        flex
        items-center
        justify-center
        cursor-pointer
        "
      >
        ✎
      </label>

      <input
        id="avatarUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />
    </div>

    <h2 className="text-xl font-bold mt-5">
      {profile.name}
    </h2>

    <p className="text-sm text-slate-500">
      {user?.email}
    </p>

    <div className="flex gap-3 mt-5">
      <div className="px-4 py-2 rounded-xl bg-indigo-500/10">
        <p className="text-xs text-slate-500">
          Plan
        </p>

        <p className="font-semibold">
          {user?.plan}
        </p>
      </div>

      <div className="px-4 py-2 rounded-xl bg-emerald-500/10">
        <p className="text-xs text-slate-500">
          Status
        </p>

        <p className="font-semibold">
          {user?.status}
        </p>
      </div>
    </div>

  </div>
</div>

<div className="lg:col-span-2">

  <h3 className="text-lg font-bold mb-6">
    {lang === "ar"
      ? "معلومات الحساب"
      : "Account Information"}
  </h3>

  <div className="space-y-5">

    {/* Name */}
    <div>
      <label className="text-xs text-slate-500">
        Full Name
      </label>

      <input
        type="text"
        value={profile.name}
        onChange={(e) =>
          setProfile({
            ...profile,
            name: e.target.value,
          })
        }
        className="
        w-full
        mt-2
        h-12
        px-4
        rounded-xl
        border
        bg-transparent
        outline-none
        "
      />
    </div>

    {/* Email */}
    <div>
      <label className="text-xs text-slate-500">
        Email Address
      </label>

      <input
        type="email"
        value={profile.email}
        onChange={(e) =>
          setProfile({
            ...profile,
            email: e.target.value,
          })
        }
        className="
        w-full
        mt-2
        h-12
        px-4
        rounded-xl
        border
        bg-transparent
        outline-none
        "
      />
    </div>

    {/* Phone */}
    <div>
      <label className="text-xs text-slate-500">
        Phone Number
      </label>

      <input
        type="tel"
        value={profile.phone}
        onChange={(e) =>
          setProfile({
            ...profile,
            phone: e.target.value,
          })
        }
        className="
        w-full
        mt-2
        h-12
        px-4
        rounded-xl
        border
        bg-transparent
        outline-none
        "
      />
    </div>

  </div>

</div>
      </div>
)}    

   
   
   
   {activeTab === "system" && (
  <div className="space-y-8">

    <div>
      <h2 className="text-xl font-bold">
        {lang === "ar"
  ? "إعدادات المنصة"
  : "Platform Settings"}
      </h2>

      <p className="text-sm text-slate-500 mt-1">
       {lang === "ar"
 ? "إدارة تفضيلات المنصة"
 : "Manage your platform preferences."
}
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-5">

      {/* Theme */}
      <div
        className="rounded-3xl border p-6"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
        }}
      >
<div className="flex items-start justify-between gap-5">

          <div>
            <h3 className="font-semibold">
              {lang === "ar"
  ? "الوضع الليلي"
  : "Dark Mode"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Switch application appearance.
            </p>
          </div>

<button
  onClick={toggleDarkMode}
  className={`
    relative
    w-14
    h-8
    rounded-full
    transition-all
    duration-300
    ${
      darkMode
        ? "bg-gradient-to-r from-indigo-600 to-violet-600"
        : "bg-slate-300 dark:bg-slate-700"
    }
  `}
>
  <div
    className={`
      absolute
      top-1
      w-6
      h-6
      rounded-full
      bg-white
      shadow-md
      transition-all
      duration-300
      ${
        darkMode
          ? lang === "ar"
            ? "right-1"
            : "left-7"
          : lang === "ar"
          ? "right-7"
          : "left-1"
      }
    `}
  />
</button>

        </div>
      </div>

      {/* Language */}
      <div
        className="rounded-3xl border p-6"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
        }}
      >
<div className="flex items-start justify-between gap-5">

          <div>
            <h3 className="font-semibold">
              {lang === "ar"
  ? "اللغة"
  : "Language"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Change interface language.
            </p>
          </div>

          <button
            onClick={toggleLanguage}
            className="
            px-4
            py-2
            rounded-xl
            bg-indigo-600
            text-white
            text-sm
            "
          >
            {lang === "en"
              ? "العربية"
              : "English"}
          </button>

        </div>
      </div>

      {/* Email Notifications */}
      <div
        className="rounded-3xl border p-6"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
        }}
      >
<div className="flex items-start justify-between gap-5">

          <div>
            <h3 className="font-semibold">
              {lang === "ar"
 ? "إشعارات البريد"
 : "Email Notifications"
}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {lang === "ar"
 ? "استقبال التحديثات عبر البريد"
 : "Receive email updates."
}
            </p>
          </div>

      <button
                  onClick={() =>

              setEmailNotifications(

                !emailNotifications

              )

            }
  className={`
    relative
    w-14
    h-8
    rounded-full
    transition-all
    duration-300
    ${
      emailNotifications
        ? "bg-gradient-to-r from-indigo-600 to-violet-600"
        : "bg-slate-300 dark:bg-slate-700"
    }
  `}
>
  <div
    className={`
      absolute
      top-1
      w-6
      h-6
      rounded-full
      bg-white
      shadow-md
      transition-all
      duration-300
      ${
        emailNotifications
          ? lang === "ar"
            ? "right-1"
            : "left-7"
          : lang === "ar"
          ? "right-7"
          : "left-1"
      }
    `}
  />
</button>
        </div>
      </div>

      {/* Maintenance */}
      <div
        className="rounded-3xl border p-6"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-card)",
        }}
      >
<div className="flex items-start justify-between gap-5">

          <div>
            <h3 className="font-semibold">
              {lang === "ar"
 ? "وضع الصيانة"
 : "Maintenance Mode"
}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {lang === "ar"
 ? "تعطيل الوصول مؤقتاً للتطبيق"
 : "Temporarily disable app access."
}
            </p>
          </div>

        <button
  onClick={() =>
    setMaintenanceMode(!maintenanceMode)
  }
  className={`
    relative
    w-14
    h-8
    rounded-full
    transition-all
    duration-300
    ${
      maintenanceMode
        ? "bg-gradient-to-r from-indigo-600 to-violet-600"
        : "bg-slate-300 dark:bg-slate-700"
    }
  `}
>
  <div
    className={`
      absolute
      top-1
      w-6
      h-6
      rounded-full
      bg-white
      shadow-md
      transition-all
      duration-300
      ${
        maintenanceMode
          ? lang === "ar"
            ? "right-1"
            : "left-7"
          : lang === "ar"
          ? "right-7"
          : "left-1"
      }
    `}
  />
</button>
        </div>
      </div>

    </div>

  </div>
)}


{/* قسم الأمان */}
{activeTab === "security" && (
  <div className="max-w-5xl space-y-8">

    <div>
      <h3 className="text-xl font-bold">
        {lang === "ar"
          ? "إعدادات الأمان"
          : "Security Settings"}
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        {lang === "ar"
          ? "إدارة كلمة المرور والحماية الإضافية للحساب"
          : "Manage your password and account protection"}
      </p>
    </div>

    <div
      className="rounded-3xl border p-6"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-card)",
      }}
    >
      <h4 className="font-semibold mb-5">
        {lang === "ar"
          ? "تغيير كلمة المرور"
          : "Change Password"}
      </h4>

      <div className="space-y-4">

        {/* Current Password */}
        <div>
          <label className="text-xs text-slate-500">
            {lang === "ar"
              ? "كلمة المرور الحالية"
              : "Current Password"}
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            className="
            w-full
            mt-2
            h-10
            px-4
            rounded-xl
            border
            bg-transparent
            outline-none
            text-sm
            "
            style={{
              borderColor: "var(--border)",
            }}
          />
        </div>

        {/* New Password */}
        <div>
          <label className="text-xs text-slate-500">
            {lang === "ar"
              ? "كلمة المرور الجديدة"
              : "New Password"}
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="
            w-full
            mt-2
            h-10
            px-4
            rounded-xl
            border
            bg-transparent
            outline-none
            text-sm
            "
            style={{
              borderColor: "var(--border)",
            }}
          />
        </div>

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

  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
    <div
      className="
      h-full
      bg-gradient-to-r
      from-red-500
      via-yellow-500
      to-emerald-500
      transition-all
      "
      style={{
        width: `${getPasswordStrength()}%`,
      }}
    />
  </div>
</div>

        {/* Confirm Password */}
        <div>
          <label className="text-xs text-slate-500">
            {lang === "ar"
              ? "تأكيد كلمة المرور"
              : "Confirm Password"}
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className={`
            w-full
            mt-2
            h-10
            px-4
            rounded-xl
            border
            bg-transparent
            outline-none
            text-sm
            ${
              confirmPassword &&
              confirmPassword !== newPassword
                ? "border-red-500"
                : ""
            }
            `}
          />
        </div>

        {confirmPassword &&
          confirmPassword !== newPassword && (
            <p className="text-sm text-red-500">
              {lang === "ar"
                ? "كلمتا المرور غير متطابقتين"
                : "Passwords do not match"}
            </p>
          )}

      </div>
    </div>

    {/* Two Factor */}
    <div
      className="rounded-3xl border p-6"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-card)",
      }}
      
    >
      
      <div className="flex items-start justify-between gap-5">

        <div>
          <h4 className="font-semibold">
            {lang === "ar"
              ? "التحقق بخطوتين"
              : "Two-Factor Authentication"}
          </h4>

          <p className="text-sm text-slate-500 mt-1">
            {lang === "ar"
              ? "إضافة طبقة حماية إضافية للحساب"
              : "Add an extra layer of account security"}
          </p>
        </div>

        <button
          onClick={() => setTwoFA(!twoFA)}
          className={`
          relative
          w-14
          h-8
          rounded-full
          transition-all
          duration-300
          ${
            twoFA
              ? "bg-gradient-to-r from-emerald-500 to-green-500"
              : "bg-slate-300 dark:bg-slate-700"
          }
          `}
        >
          <div
            className={`
            absolute
            top-1
            w-6
            h-6
            rounded-full
            bg-white
            shadow-md
            transition-all
            duration-300
            ${
              twoFA
                ? lang === "ar"
                  ? "right-1"
                  : "left-7"
                : lang === "ar"
                ? "right-7"
                : "left-1"
            }
            `}
          />
        </button>

      </div>
    </div>

  </div>
)}       {/* 4️⃣ زر الحفظ الموحد أسفل الكارت */}
      <div
  className="mt-8 pt-4 border-t flex justify-end"
  style={{
    borderColor: "var(--border)",
  }}
>
  <button
    onClick={handleSave}
    disabled={saved}
    className={`
    h-12
    px-10
    rounded-2xl
    bg-gradient-to-r
    from-indigo-600
    to-violet-600
    text-white
    font-semibold
    shadow-lg
    transition-all
    hover:scale-[1.02]
    ${
      saved
        ? "opacity-70 cursor-not-allowed"
        : ""
    }
    `}
  >
    {
      saved
        ? lang === "ar"
          ? "✓ تم الحفظ"
          : "✓ Saved Successfully"
        : lang === "ar"
        ? "حفظ التغييرات"
        : "Save Changes"
    }
  </button>
</div>
      </div>
    </div>
  );
}

export default Settings;
