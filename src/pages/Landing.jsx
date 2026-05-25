import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 🆕 ضفنا useNavigate هنا
import useTheme from "../hooks/useTheme";
import { 
  Check, ArrowRight, Zap,  Star, 
  Layout, BarChart2, Users, Layers, Mail, MessageSquare, Send 
} from "lucide-react";
import { motion } from "framer-motion";

function Landing() {
const { lang, darkMode, toggleDarkMode, toggleLanguage } = useTheme();
  const navigate = useNavigate(); // 🆕 تعريف الـ navigate
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navLinks = [
  { en: "Features", ar: "المميزات" },
  { en: "Pricing", ar: "الأسعار" },
  { en: "Testimonials", ar: "آراء العملاء" },
  { en: "Contact", ar: "اتصل بنا" }
];

  // 1. بيانات المميزات (Features)
  const features = [
    {
      icon: <Layout className="text-indigo-500" size={24} />,
      title: lang === "ar" ? "لوحة تحكم Premium" : "Premium Dashboard",
      desc: lang === "ar" ? "تصميم عصري يدعم التبديل بين المظهر الداكن والمضيء بسلاسة." : "Modern design with flawless light/dark mode transitions."
    },
    {
      icon: <BarChart2 className="text-indigo-500" size={24} />,
      title: lang === "ar" ? "تحليلات متقدمة" : "Advanced Analytics",
      desc: lang === "ar" ? "رسوم بيانية تفاعلية لمتابعة نمو مبيعاتك وأداء مشروعك لحظة بلحظة." : "Interactive charts to monitor sales growth and project metrics in real-time."
    },
    {
      icon: <Users className="text-indigo-500" size={24} />,
      title: lang === "ar" ? "إدارة المستخدمين" : "User Management",
      desc: lang === "ar" ? "نظام متكامل للتحكم في الصلاحيات وأعضاء الفريق بكفاءة عالية." : "Complete system to manage team members and permissions efficiently."
    },
    {
      icon: <Layers className="text-indigo-500" size={24} />,
      title: lang === "ar" ? "بنية برمجية نظيفة" : "Clean Architecture",
      desc: lang === "ar" ? "كود منظم ومكتبوب بأحدث التقنيات لضمان أسرع أداء لتطبيقك." : "Organized code built with modern tools to ensure maximum performance."
    }
  ];

  // 2. بيانات الخطط والأسعار (Pricing)
  const plans = [
    {
      name: lang === "ar" ? "الخطة الأساسية" : "Starter Plan",
      price: "$19",
      desc: lang === "ar" ? "مثالية للأفراد والشركات الناشئة" : "Best for individuals and startups",
      features: lang === "ar" 
        ? ["3 مشاريع نشطة", "تحليلات أساسية", "دعم عبر البريد 24/7"] 
        : ["3 Active Projects", "Basic Analytics", "24/7 Email Support"],
    },
    {
      name: lang === "ar" ? "الخطة المتقدمة" : "Pro Plan",
      price: "$49",
      desc: lang === "ar" ? "الخيار الأفضل للشركات المتنامية" : "Best for growing companies",
      features: lang === "ar"
        ? ["مشاريع غير محدودة", "تحليلات متقدمة لحظية", "نطاق مخصص (Custom Domain)", "دعم فني ذو أولوية"]
        : ["Unlimited Projects", "Advanced Live Analytics", "Custom Domain", "Priority Support"],
      popular: true,
    }
  ];

  // 3. آراء الناس (Testimonials)
  const reviews = [
    {
      name: lang === "ar" ? "عبد الله القحطاني" : "Abdullah Al-Qahtani",
      role: "SaaS Founder",
      comment: lang === "ar" 
        ? "هذا السكريبت وفر عليّ أسابيع من العمل. التصميم مرن جداً والـ Dark Mode فيه خيالي!" 
        : "This script saved me weeks of work. The design is fluid and the dark mode is just stunning!",
      stars: 5
    },
    {
      name: lang === "ar" ? "سارة جونز" : "Sarah Jones",
      role: "Product Manager",
      comment: lang === "ar" 
        ? "نظام الـ Layout المتجاوب مريح جداً على الموبايل، والعملاء أعجبوا بنظافة الواجهة." 
        : "The responsive layout works flawlessly on mobile, and our clients love the clean interface.",
      stars: 5
    }
  ];

  // 🆕 دالة انتقال مرنة تمنع الـ Conflict مع الـ Router وتمرر الـ state
  const handleCheckoutNavigation = (planName, planPrice) => {
    navigate("/checkout", { state: { plan: { name: planName, price: planPrice } } });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(lang === "ar" ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!");
    setEmail("");
    setMessage("");
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 text-slate-900 dark:text-white selection:bg-indigo-500 selection:text-white">
// داخل الـ Navbar
<nav className="w-full h-20 border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#0b0c10]/80 backdrop-blur-xl fixed top-0 z-50 px-8 flex items-center justify-between">
  
  {/* اللوجو */}
  <div className="flex items-center gap-2 text-slate-900 dark:text-white">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold">S</div>
    <span className="font-bold text-lg">SaaS-Core</span>
  </div>

  {/* اللينكات (تم تصحيحها) */}
  <div className="hidden md:flex flex-1 justify-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
    {navLinks.map((link) => (
      <a 
        key={link.en} 
        href={`#${link.en.toLowerCase()}`} 
        className="hover:text-indigo-600 dark:hover:text-white transition-colors"
      >
        {lang === "ar" ? link.ar : link.en}
      </a>
    ))}
  </div>

  {/* الأزرار */}

  <div className="flex items-center gap-3">

    
{/* زر الدارك مود */}
  <button 
    onClick={toggleDarkMode} 
    className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/5 transition-all"
  >
    {darkMode ? "☀️" : "🌙"}
  </button>
{/* زر تبديل اللغة */}
  <button 
    onClick={toggleLanguage} 
    className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/5 transition-all"
  >
    {lang === "ar" ? "EN" : "العربية"}
  </button>
{/* زر Login / Logout الديناميكي */}
  {isLoggedIn ? (
    <button 
      onClick={handleLogout} // دالة تسجيل الخروج الخاصة بك
      className="px-5 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm font-medium transition-all"
    >
      {lang === "ar" ? "تسجيل خروج" : "Logout"}
    </button>
  ) : (
    <Link 
      to="/auth" 
      className="px-5 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/5 text-sm font-medium transition-all"
    >
      {lang === "ar" ? "دخول" : "Login"}
    </Link>
  )}
  </div>
</nav>

{/* 🚀 Hero Section - Adjusted for better visual hierarchy */}
<header className="w-full pt-32 pb-20 px-6 flex flex-col items-center text-center">
  
  {/* Badge */}
  <motion.div 
    initial={{ opacity: 0, y: -20 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 mb-8 border border-indigo-500/20"
  >
    <Zap size={14} fill="currentColor" />
    <span>{lang === "ar" ? "جاهز للانطلاق في 2026" : "Ready for 2026 Launch"}</span>
  </motion.div>
  
  {/* القيمة المقترحة (أكثر وضوحاً) */}
  <motion.h1 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: 0.1 }} 
    className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl leading-[1.1] mb-6"
  >
    {lang === "ar" 
      ? "ابنِ تطبيق SaaS الخاص بك في أيام، لا أشهر" 
      : "Build Your SaaS Application in Days, Not Months"}
  </motion.h1>
  
  {/* توضيح ما يفعله المشروع */}
  <motion.p 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: 0.2 }} 
    className="text-slate-400 max-w-2xl text-lg md:text-xl mb-12 leading-relaxed"
  >
    {lang === "ar" 
      ? "نوفر لك بنية برمجية متكاملة (SaaS-Core) تتضمن لوحة تحكم، نظام اشتراكات، إدارة مستخدمين، وتحليلات فورية. كل ما تحتاجه لتبدأ مشروعك وتجني الأرباح." 
      : "SaaS-Core provides a complete production-ready boilerplate: Dashboard, Auth, Subscription, and Analytics. Everything you need to scale your SaaS business faster."}
  </motion.p>

  {/* الأزرار */}
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: 0.3 }} 
    className="flex flex-wrap items-center justify-center gap-4"
  >
    <Link to="/dashboard" className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/20">
      <span>{lang === "ar" ? "جرب لوحة التحكم" : "Try Dashboard"}</span>
      <ArrowRight size={18} className={lang === "ar" ? "rotate-180" : ""} />
    </Link>
    <a href="#features" className="h-14 px-8 rounded-2xl border border-white/10 hover:bg-white/5 font-medium flex items-center justify-center transition-all">
      {lang === "ar" ? "كيف يعمل؟" : "How it works"}
    </a>
  </motion.div>
</header>

      {/* ✨ 3. قسم المميزات (Features Section) */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold">{lang === "ar" ? "كل ما تحتاجه في مكان واحد" : "Everything You Need in One Place"}</h2>
          <p className="text-sm text-slate-400 mt-2">{lang === "ar" ? "تم تصميم وتطوير المكونات بدقة متناهية لتوفير أفضل تجربة مستخدم (UI/UX)." : "Every layout item is carefully crafted to deliver the ultimate UI/UX experience."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all flex flex-col items-start text-start">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 mb-4">{item.icon}</div>
              <h3 className="font-bold text-base dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 💰 4. قسم الأسعار (Pricing Section) */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-slate-900 bg-slate-100/50 dark:bg-slate-950/20 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold">{lang === "ar" ? "خطط أسعار مرنة تلائم نموك" : "Flexible Plans for Any Scale"}</h2>
          <p className="text-sm text-slate-400 mt-2">{lang === "ar" ? "اختر الخطة المناسبة لك الآن، ويمكنك الترقية أو الإلغاء في أي وقت." : "Choose the plan that fits your current requirements. Cancel or upgrade anytime."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`p-8 rounded-2xl border bg-white dark:bg-slate-900 flex flex-col relative ${
                plan.popular ? "border-indigo-600 dark:border-indigo-500 shadow-xl ring-1 ring-indigo-600/20 scale-105 z-10" : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {plan.popular && (
                <span className={`absolute top-4 bg-indigo-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full tracking-wider flex items-center gap-1 ${lang === "ar" ? "left-4" : "right-4"}`}>
                  <Star size={10} fill="currentColor" /> {lang === "ar" ? "الأكثر طلباً" : "Popular"}
                </span>
              )}
              
              <h3 className="font-extrabold text-xl">{plan.name}</h3>
              <p className="text-xs text-slate-400 mt-1.5">{plan.desc}</p>
              
              <div className="my-6 flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                <span className="text-xs text-slate-400">/{lang === "ar" ? "شهرياً" : "mo"}</span>
              </div>

              <ul className="space-y-3.5 flex-1 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Check size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-start">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* 🆕 تم التحديث إلى زرار تكتيكي يستدعي دالة التوجيه الصريحة بدلاً من الـ Link المباشر */}
              <button 
                onClick={() => handleCheckoutNavigation(plan.name, plan.price)}
                className={`w-full h-12 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20" : "border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{lang === "ar" ? "ابدأ الآن" : "Get Started Now"}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ 5. قسم آراء الناس (Testimonials Section) */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-slate-900">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold">{lang === "ar" ? "ماذا يقول عملاؤنا؟" : "Trusted by Builders Worldwide"}</h2>
          <p className="text-sm text-slate-400 mt-2">{lang === "ar" ? "آراء حقيقية من مطورين ورواد أعمال أطلقوا تطبيقاتهم باستخدام قوالبنا." : "Real feedback from developers and business owners who launched using our systems."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reviews.map((rev, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between text-start shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(rev.stars)].map((_, i) => (
                  <Star key={i} size={16} className="text-amber-500" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">"{rev.comment}"</p>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{rev.name}</span>
                <span className="text-xs text-slate-400 mt-0.5">{rev.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📬 6. قسم تواصل معنا (Contact Section) */}
      <section className="max-w-xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-slate-900 text-center">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold">{lang === "ar" ? "هل لديك أي استفسار؟" : "Have Questions? Get in Touch"}</h2>
          <p className="text-sm text-slate-400 mt-2">{lang === "ar" ? "راسلنا مباشرة وسيقوم فريق الدعم بالرد عليك في أقرب وقت ممكن." : "Drop us a message and our support staff will reach back shortly."}</p>
        </div>

        <form onSubmit={handleContactSubmit} className="space-y-4 text-start bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{lang === "ar" ? "البريد الإلكتروني" : "Email Address"}</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-transparent outline-none text-sm w-full text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{lang === "ar" ? "رسالتك" : "Your Message"}</label>
            <div className="flex gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 items-start">
              <MessageSquare size={16} className="text-slate-400 shrink-0 mt-1" />
              <textarea 
                rows="4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={lang === "ar" ? "اكتب استفسارك هنا..." : "Type your query here..."}
                className="bg-transparent outline-none text-sm w-full text-slate-800 dark:text-white resize-none"
              ></textarea>
            </div>
          </div>

          <button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/15">
            <span>{lang === "ar" ? "إرسال الرسالة" : "Send Message"}</span>
            <Send size={14} />
          </button>
        </form>
      </section>

      {/* 📋 الفوتر السفلي */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-400">
        <p>© 2026 SaaS-Core Template. Built by Nexora.</p>
      </footer>

    </div>
  );
}

export default Landing;