import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useTheme from "../hooks/useTheme"; // 🆕 ربط الـ Hook بتاعك هنا

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useTheme(); // 🆕 سحبنا اللغة الحالية عشان الـ RTL والترجمة

  // لقط الخطة المختارة من الـ Landing Page
  const selectedPlan = location.state?.plan || { 
    name: lang === 'ar' ? 'الخطة المتقدمة' : 'Pro Plan', 
    price: '$49' 
  };
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({ name: '', email: '', cardNumber: '', expiry: '', cvv: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // إظهار الرش الترحيبي المناسب حسب اللغة ثم التوجيه
    alert(lang === 'ar' ? 'تمت عملية الدفع بنجاح! جاري تحويلك للوحة التحكم...' : 'Payment successful! Redirecting to dashboard...');
    navigate('/dashboard'); 
  };

  return (
    // 🆕 الـ dir هيتغير تلقائياً حسب اللغة لضمان الـ RTL المثالي في التصميم العربي
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#0b0c10] text-white flex items-center justify-center p-6 font-sans select-none">
      
      {/* الخلفية المضيئة المعتادة */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full filter blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-600 rounded-full filter blur-[120px] opacity-20 pointer-events-none"></div>

      {/* الحاوية الزجاجية - Glassmorphic Container */}
      <div className="relative w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        
        {/* الجزء الأول: فورم الدفع */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              {lang === 'ar' ? 'إتمام عملية الشراء' : 'Complete Your Purchase'}
            </h2>
            
            {/* تبديل طريقة الدفع */}
            <div className="flex gap-4 mb-6">
              <button 
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 rounded-xl border transition-all text-sm font-medium ${paymentMethod === 'card' ? 'bg-purple-600 border-purple-500 shadow-lg shadow-purple-600/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                💳 {lang === 'ar' ? 'بطاقة ائتمان' : 'Card'}
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`flex-1 py-3 rounded-xl border transition-all text-sm font-medium ${paymentMethod === 'paypal' ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                🅿️ PayPal
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                <input type="text" name="name" required onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-600" placeholder={lang === 'ar' ? 'محمد أحمد' : 'John Doe'} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input type="email" name="email" required onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-600" placeholder="john@example.com" />
              </div>

              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === 'ar' ? 'رقم البطاقة' : 'Card Number'}</label>
                    <input type="text" name="cardNumber" required onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-600" placeholder="•••• •••• •••• ••••" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                      <input type="text" name="expiry" required onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-600" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">CVV</label>
                      <input type="password" name="cvv" required onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-600" placeholder="•••" />
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3.5 rounded-xl mt-6 transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98] text-sm">
                {lang === 'ar' ? `ادفع ${selectedPlan.price} الآن` : `Pay ${selectedPlan.price} Now`}
              </button>
            </form>
          </div>
        </div>

        {/* الجزء الثاني: ملخص الطلب (Order Summary) */}
        <div className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col justify-between text-start">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-200">{lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h3>
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <div>
                <p className="font-bold text-white text-base tracking-wide">{selectedPlan.name}</p>
                <p className="text-xs text-gray-400 mt-1">{lang === 'ar' ? 'وصول مدى الحياة والدعم الفني' : 'Lifetime Access & Support'}</p>
              </div>
              <p className="text-xl font-black text-purple-400">{selectedPlan.price}</p>
            </div>
            
            {/* المميزات السريعة لتأكيد القيمة للمشتري */}
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span>🟢</span>
                <span>{lang === 'ar' ? 'عملاء ومشاريع غير محدودة' : 'Unlimited Projects & Dashboard Assets'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🟢</span>
                <span>{lang === 'ar' ? 'صفحة تحليلات ورسوم بيانية متقدمة' : 'Advanced Interactive Analytics'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🟢</span>
                <span>{lang === 'ar' ? 'دعم كامل للغة العربية والمظهر الداكن' : 'Full RTL & Dark Mode Premium Layout'}</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center">
            <span className="text-gray-400 text-sm font-medium">{lang === 'ar' ? 'المبلغ الإجمالي:' : 'Total Due:'}</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              {selectedPlan.price}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;