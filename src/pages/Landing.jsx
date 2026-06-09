import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import useTheme from "../hooks/useTheme";
import { 
  ArrowRight, Zap,  Star,  Layout, BarChart2, Users, Layers,  Send ,MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Landing() {
const { lang, darkMode, toggleDarkMode, toggleLanguage } = useTheme();
  const navigate = useNavigate(); // 🆕 تعريف الـ navigate

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  
const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const checkLogin = () => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  };

  checkLogin();

  window.addEventListener("storage", checkLogin);

  return () => {
    window.removeEventListener("storage", checkLogin);
  };
}, []);

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

const plans = [
  { 
    name: lang === "ar" ? "الخطة الأساسية" : "Starter Plan", 
    price: "$19", 
    desc: lang === "ar" ? "مثالية للأفراد والشركات الناشئة" : "Best for individuals and startups",
    features: lang === "ar" 
      ? ["3 مشاريع نشطة", "تحليلات أساسية", "دعم عبر البريد 24/7"] 
      : ["3 Active Projects", "Basic Analytics", "24/7 Email Support"],
    popular: false 
  },
  { 
    name: lang === "ar" ? "الخطة المتقدمة" : "Pro Plan", 
    price: "$49", 
    desc: lang === "ar" ? "الخيار الأفضل للشركات المتنامية" : "Best for growing companies",
    features: lang === "ar" 
      ? ["مشاريع غير محدودة", "تحليلات متقدمة لحظية", "نطاق مخصص", "دعم فني ذو أولوية"] 
      : ["Unlimited Projects", "Advanced Live Analytics", "Custom Domain", "Priority Support"],
    popular: true 
  },
  { 
    name: lang === "ar" ? "خطة الشركات" : "Enterprise Plan", 
    price: lang === "ar" ? "تواصل معنا" : "Custom", 
    desc: lang === "ar" ? "للمؤسسات الكبرى واحتياجات التوسع" : "For large-scale operations and scaling",
    features: lang === "ar" 
      ? ["كل مميزات Pro", "ميزات مخصصة (Custom)", "دعم مخصص 24/7", "مدير حساب خاص"] 
      : ["Everything in Pro", "Custom Features & Integrations", "24/7 Dedicated Support", "Dedicated Account Manager"],
    popular: false 
  }
];

  // 3. آراء الناس (Testimonials)
 
  const reviews = [
    {
      name: lang === "ar" ? "عبد الله القحطاني" : "Abdullah Al-Qahtani",
      role: "SaaS Founder",
      image: "https://i.pravatar.cc/150?u=abdullah",
      comment: lang === "ar" 
        ? "هذا السكريبت وفر عليّ أسابيع من العمل. التصميم مرن جداً والـ Dark Mode فيه خيالي!" 
        : "This script saved me weeks of work. The design is fluid and the dark mode is just stunning!",
      stars: 5
    },
    {
      name: lang === "ar" ? "سارة جونز" : "Sarah Jones",
      role: "Product Manager",
      image: "https://i.pravatar.cc/150?u=sarah",
      comment: lang === "ar" 
        ? "نظام الـ Layout المتجاوب مريح جداً على الموبايل، والعملاء أعجبوا بنظافة الواجهة." 
        : "The responsive layout works flawlessly on mobile, and our clients love the clean interface.",
      stars: 5
    },

  
    {
    name: lang === "ar" ? "مايكل براون" : "Michael Brown",
    role: "Lead Developer",
    image: "https://i.pravatar.cc/150?u=michael",
    comment: lang === "ar" ? "الكود مرتب جداً وسهل التعديل، أنصح به بشدة." : "The code is well-structured and easy to customize, highly recommended.",
    stars: 5
   }
  ];



  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  }, 10000);
  return () => clearInterval(timer);
}, [reviews.length]);


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
const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");

  navigate("/login");

  window.location.reload();
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
    <button onClick={toggleDarkMode} className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/5 transition-all">
       {darkMode ? "☀️" : "🌙"}
    </button>
  <button 
  onClick={toggleLanguage} 
  className="text-xs font-bold px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
>
  {lang === "ar" ? "EN" : "العربية"}
</button>
{isLoggedIn ? (
  <button
    onClick={handleLogout}
    className="
      h-10
      px-5
      rounded-xl
      bg-red-500
      hover:bg-red-600
      text-white
      text-sm
      font-semibold
      transition-all
    "
  >
    {lang === "ar" ? "تسجيل الخروج" : "Logout"}
  </button>
) : (
  <Link
    to="/login"
    className="
      h-10
      px-5
      rounded-xl
      bg-indigo-600
      hover:bg-indigo-700
      text-white
      text-sm
      font-semibold
      transition-all
      flex
      items-center
      justify-center
    "
  >
    {lang === "ar" ? "تسجيل الدخول" : "Login"}
  </Link>
  
)}
  </div>
</nav>

{/* 🚀 Hero Section - Adjusted for better visual hierarchy */}
<header className="w-full min-h-[85vh] flex flex-col items-center justify-center px-6 pt-20 text-center">
  
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

{/* ✨ Premium Features Section */}
<section
  id="features"
  className="max-w-7xl mx-auto px-6 py-24"
>
  {/* Heading */}
  <div className="text-center mb-16">
    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-5">
      {lang === "ar" ? "المميزات" : "FEATURES"}
    </span>

    <h2 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
      {lang === "ar"
        ? "كل الأدوات التي تحتاجها للنمو"
        : "Everything You Need To Scale"}
    </h2>

    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
      {lang === "ar"
        ? "واجهة احترافية، تحليلات قوية، وتجربة استخدام مصممة للشركات الحديثة."
        : "Professional UI, powerful analytics, and a modern experience built for SaaS startups."}
    </p>
  </div>

  {/* Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
    {features.map((feature, index) => (
      <motion.div
        key={index}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.25 }}
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          dark:border-slate-800
          bg-white
          dark:bg-[#0f1117]
          p-7
          transition-all
          hover:border-indigo-500/40
          hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]
        "
      >
        {/* Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        {/* Icon */}
        <div
          className="
            relative z-10
            w-14 h-14
            rounded-2xl
            bg-indigo-500/10
            flex items-center justify-center
            mb-6
            text-indigo-500
            group-hover:scale-110
            transition-transform
          "
        >
          {feature.icon}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-3">
            {feature.title}
          </h3>

          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {feature.desc}
          </p>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-indigo-500 to-violet-500 group-hover:w-full transition-all duration-500" />
      </motion.div>
    ))}
  </div>
</section>
{/* Pricing Section */}
<section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
  <div className="text-center mb-16">
    <h2 className="text-4xl font-bold">Simple & Flexible Pricing</h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {plans.map((plan, idx) => (
      <div 
        key={idx} 
        className={`p-8 rounded-3xl border ${plan.popular ? "border-indigo-500 shadow-xl scale-105" : "border-slate-200 dark:border-slate-800"} bg-white dark:bg-slate-900 flex flex-col relative`}
      >
        {/* شريط Most Popular */}
        {plan.popular && (
          <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
            <div className="absolute top-6 -right-8 w-full bg-indigo-500 text-white text-[10px] font-bold text-center rotate-45 py-1 shadow-md">
              MOST POPULAR
            </div>
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-center mb-4">{plan.name}</h3>
        <div className="text-3xl font-bold text-center mb-6">{plan.price}</div>
        
        <ul className="space-y-4 flex-1 mb-8 text-sm text-center text-slate-500 dark:text-slate-400">
          {plan.features.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
        
        {/* استخدام دالة handleCheckoutNavigation هنا */}
        <button 
          onClick={() => handleCheckoutNavigation(plan.name, plan.price)}
          className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 transition-all"
        >
          {plan.name === "Enterprise" || plan.name === "خطة الشركات" ? "Contact Sales" : plan.popular ? "Upgrade to Pro" : "Get Started"}
        </button>
      </div>
    ))}
  </div>
</section>
<section
  id="testimonials"
  className="max-w-6xl mx-auto px-6 py-28"
>
  <div className="text-center mb-20">
    <span className="text-indigo-500 font-semibold uppercase tracking-[0.2em] text-sm">
      Testimonials
    </span>

    <h2 className="text-5xl font-black mt-4">
      {lang === "ar"
        ? "ماذا يقول عملاؤنا؟"
        : "Loved by Developers"}
    </h2>
  </div>

  <div className="relative overflow-hidden">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        transition={{ duration: 0.5 }}
        className="rounded-[40px] border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl p-8 md:p-14"
      >
        <div className="flex flex-col md:flex-row items-center gap-10">

          {/* Avatar */}
          <div className="flex flex-col items-center text-center min-w-[220px]">
            <img
              src={reviews[currentIndex].image}
              alt={reviews[currentIndex].name}
              className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl"
            />

            <h4 className="mt-6 text-2xl font-bold">
              {reviews[currentIndex].name}
            </h4>

            <p className="text-indigo-500 mt-2">
              {reviews[currentIndex].role}
            </p>

            <div className="flex gap-1 mt-5 text-yellow-400">
              {[...Array(reviews[currentIndex].stars)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-2xl md:text-3xl leading-relaxed font-light text-slate-700 dark:text-slate-200">
              “{reviews[currentIndex].comment}”
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>

    {/* Dots */}
    <div className="flex justify-center gap-3 mt-10">
      {reviews.map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentIndex(i)}
          className={`transition-all duration-300 rounded-full ${
            i === currentIndex
              ? "w-12 h-3 bg-indigo-600"
              : "w-3 h-3 bg-slate-300 dark:bg-slate-700"
          }`}
        />
      ))}
    </div>
  </div>
</section>  


{/* 📬 قسم تواصل معنا (محدث بتصميم عصري) */}
<section id="contact" className="max-w-6xl mx-auto px-6 py-28 border-t border-slate-200 dark:border-slate-800">
  <div className="grid md:grid-cols-2 gap-16 items-center">
    
    {/* الجانب النصي */}
    <div>
      <h2 className="text-5xl font-black mb-6">
        {lang === "ar" ? "هل لديك أي استفسار؟" : "Let's Build Something Great"}
      </h2>
      <p className="text-slate-500 text-lg mb-8 leading-relaxed">
        {lang === "ar" 
          ? "نحن هنا لمساعدتك في أي وقت. أرسل رسالتك وسنرد عليك في غضون دقائق." 
          : "Have a project in mind or need technical support? Drop us a line, and let's get started."}
      </p>
      
  <div className="space-y-6">
        {/* الهاتف */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <span className="text-xl">📞</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lang === "ar" ? "اتصل بنا" : "Phone"}</p>
            <p className="font-semibold text-lg">+20 12 8709 4035</p>
          </div>
        </div>

        {/* العنوان */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <span className="text-xl">📍</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lang === "ar" ? "العنوان" : "Office Address"}</p>
            <p className="font-semibold text-lg"> Cairo, Egypt</p>
          </div>
        </div>

        {/* الخريطة (صورة ثابتة كتمثيل للخريطة) */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 h-40">
           <img 
             src="https://maps.googleapis.com/maps/api/staticmap?center=Cairo,Egypt&zoom=13&size=600x300&maptype=roadmap&key=YOUR_API_KEY" 
             alt="Location Map" 
             className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
           />
        </div>
      </div>
    </div>

    {/* كارد النموذج (Contact Form) */}
    <form onSubmit={handleContactSubmit} className="bg-white dark:bg-slate-950 p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
      <div className="space-y-8">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            {lang === "ar" ? "البريد الإلكتروني" : "Email Address"}
          </label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            {lang === "ar" ? "رسالتك" : "Your Message"}
          </label>
          <textarea 
            rows="4"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={lang === "ar" ? "اكتب تفاصيل استفسارك هنا..." : "Tell us about your project..."}
            className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-500 transition-all resize-none text-slate-800 dark:text-white"
          ></textarea>
        </div>

        <button type="submit" className="w-full h-16 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
          <span>{lang === "ar" ? "إرسال الرسالة" : "Send Message"}</span>
          <Send size={18} />
        </button>
      </div>
    </form>
  </div>
</section>

      {/* 📋 الفوتر السفلي */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-400">
        <p>© 2026 SaaS-Core Template. Built by Saas core.</p>
      </footer>
{/* 📱 زر الواتساب العائم */}
<a
  href="https://wa.me/201287094035" // ضع رقم هاتفك هنا مع كود الدولة بدون +
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-[999] flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white shadow-2xl shadow-green-500/30 hover:scale-110 transition-all duration-300 animate-bounce"
>
  <MessageCircle size={32} />
</a>
    </div>
  );
}

export default Landing;