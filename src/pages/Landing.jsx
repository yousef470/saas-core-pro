import { useState } from "react";
import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { 
  Check, ArrowRight, Zap,  Star, 
  Layout, BarChart2, Users, Layers, Mail, MessageSquare, Send 
} from "lucide-react";
import { motion } from "framer-motion";

function Landing() {
  const { lang, darkMode, toggleDarkMode, toggleLanguage } = useTheme();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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
      desc: lang === "ar" ? "كود منظم ومكتوب بأحدث التقنيات لضمان أسرع أداء لتطبيقك." : "Organized code built with modern tools to ensure maximum performance."
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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // هنا تقدر تربطها بـ API أو تظهر رسالة نجاح
    alert(lang === "ar" ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 text-slate-900 dark:text-white selection:bg-indigo-500 selection:text-white">
      
      {/* 🌐 1. النافبار (Navbar) */}
      <nav className="h-20 border-b border-slate-200 dark:border-slate-800 max-w-7xl mx-auto px-6 flex items-center justify-between sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold">S</div>
          <span className="font-bold text-lg tracking-tight">SaaS-Core</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={toggleLanguage} className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
            {lang === "ar" ? "EN" : "العربية"}
          </button>
          <button onClick={toggleDarkMode} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
            {darkMode ? "☀️" : "🌙"}
          </button>
          <Link to="/dashboard" className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/15">
            {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
          </Link>
        </div>
      </nav>

      {/* 🚀 2. الواجهة الرئيسية (Hero Section) */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-6">
          <Zap size={12} fill="currentColor" />
          <span>{lang === "ar" ? "النسخة المطورّة 2026 وصلت" : "The 2026 Premium Version is Live"}</span>
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black tracking-tight max-w-3xl leading-tight">
          {lang === "ar" ? "أطلق تطبيق الـ SaaS الخاص بك بأسلوب محترف" : "Launch Your SaaS Application with Premium Style"}
        </motion.h1>
        
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-500 dark:text-slate-400 max-w-2xl mt-6 text-base md:text-lg">
          {lang === "ar" ? "لوحة تحكم متميزة ومجهزة بكافة الأدوات، الجداول والصفحات المتجاوبة التي تحتاجها لبناء وتطوير وإدارة تطبيقك بنجاح." : "A premium admin template built with all responsive tools, charts, and layout components you need to scale your business."}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/dashboard" className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20">
            <span>{lang === "ar" ? "اكتشف لوحة التحكم" : "Explore Dashboard"}</span>
            <ArrowRight size={16} />
          </Link>
          <a href="#features" className="h-12 px-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium text-sm flex items-center justify-center transition-all">
            {lang === "ar" ? "عرض المميزات" : "View Features"}
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
                <span className="absolute top-4 right-4 bg-indigo-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full tracking-wider flex items-center gap-1">
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

              <Link to="/register" className={`w-full h-12 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20" : "border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}>
                <span>{lang === "ar" ? "ابدأ الآن" : "Get Started Now"}</span>
              </Link>
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