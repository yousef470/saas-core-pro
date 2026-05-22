import { useState } from "react";
import useTheme from "../hooks/useTheme";

function Settings() {
  const { lang } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");

  // حالات فورم الملف الشخصي
  const [profile, setProfile] = useState({
    name: "Yousef Ahmed",
    email: "yousef@nexora.com",
  });

  return (
    <div className="space-y-7 animate-fade-in pb-10">
      
      {/* 1️⃣ الهيدر العلوي */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          {lang === "ar" ? "إعدادات النظام" : "System Settings"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {lang === "ar" ? "تخصيص تفاصيل حسابك، خيارات المنصة، وتفضيلات الأمان." : "Configure account parameters, platform preferences, and security access."}
        </p>
      </div>

      {/* 2️⃣ أزرار التنقل بين الأقسام (Tabs) بتصميم ناعم */}
      <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
        {[
          { id: "profile", labelAr: "الحساب الشخصي", labelEn: "Profile" },
          { id: "system", labelAr: "النظام", labelEn: "Platform" },
          { id: "security", labelAr: "الأمان", labelEn: "Security" }
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
        className="p-6 rounded-2xl border max-w-2xl shadow-sm"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        {/* قسم الملف الشخصي */}
        {activeTab === "profile" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">
              {lang === "ar" ? "معلومات الحساب" : "Profile Specifications"}
            </h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">{lang === "ar" ? "الاسم الكامل" : "Full Name"}</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="h-11 px-4 rounded-xl border text-sm bg-transparent focus:outline-none focus:border-indigo-500 transition-all"
                style={{ color: "var(--text-main)", borderColor: "var(--border)" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">{lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="h-11 px-4 rounded-xl border text-sm bg-transparent focus:outline-none focus:border-indigo-500 transition-all"
                style={{ color: "var(--text-main)", borderColor: "var(--border)" }}
              />
            </div>
          </div>
        )}

        {/* قسم إعدادات المنصة */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">
              {lang === "ar" ? "تفضيلات النظام الافتراضية" : "Platform Settings"}
            </h3>

            {/* سويتش اختياري شيك جداً */}
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{lang === "ar" ? "وضع الصيانة" : "Maintenance Mode"}</p>
                <p className="text-xs text-slate-400 mt-0.5">{lang === "ar" ? "غلق الواجهة الأمامية مؤقتاً للزوار" : "Temporarily disable client-facing app access"}</p>
              </div>
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full p-0.5 cursor-pointer flex items-center justify-start">
                <div className="w-5 h-5 bg-white dark:bg-slate-400 rounded-full shadow-md" />
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-t" style={{ borderColor: "var(--border)" }}>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{lang === "ar" ? "إشعارات البريد" : "Email Notifications"}</p>
                <p className="text-xs text-slate-400 mt-0.5">{lang === "ar" ? "إرسال تقارير المبيعات اليومية تلقائياً" : "Receive automated daily fiscal performance data"}</p>
              </div>
              <div className="w-11 h-6 bg-indigo-600 rounded-full p-0.5 cursor-pointer flex items-center justify-end">
                <div className="w-5 h-5 bg-white rounded-full shadow-md" />
              </div>
            </div>
          </div>
        )}

        {/* قسم الأمان */}
        {activeTab === "security" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">
              {lang === "ar" ? "تحديث كلمات المرور" : "Security Configuration"}
            </h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">{lang === "ar" ? "كلمة المرور الحالية" : "Current Password"}</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="h-11 px-4 rounded-xl border text-sm bg-transparent focus:outline-none focus:border-indigo-500 transition-all"
                style={{ color: "var(--text-main)", borderColor: "var(--border)" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">{lang === "ar" ? "كلمة المرور الجديدة" : "New Password"}</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="h-11 px-4 rounded-xl border text-sm bg-transparent focus:outline-none focus:border-indigo-500 transition-all"
                style={{ color: "var(--text-main)", borderColor: "var(--border)" }}
              />
            </div>
          </div>
        )}

        {/* 4️⃣ زر الحفظ الموحد أسفل الكارت */}
        <div className="mt-8 pt-4 border-t flex justify-end" style={{ borderColor: "var(--border)" }}>
          <button className="h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:opacity-95 transition-all">
            {lang === "ar" ? "حفظ التغييرات" : "Save Configurations"}
          </button>
        </div>

      </div>

    </div>
  );
}

export default Settings;