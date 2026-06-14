import  { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical, 
  Search,
  Menu
} from "lucide-react";
import useTheme from "../hooks/useTheme";

// بيانات تجريبية للمحادثة
const initialMessages = [
  { id: 1, text: "مرحباً! هل قمت بمراجعة تقرير المهام؟", sender: "other", time: "10:30 AM" },
  { id: 2, text: "أهلاً! نعم، قمت بالمراجعة وهو جاهز للرفع.", sender: "me", time: "10:32 AM" },
  { id: 3, text: "ممتاز، هل نحتاج لاجتماع سريع؟", sender: "other", time: "10:35 AM" },
];

const contacts = [
  { id: 1, name: "أحمد علي", status: "online", lastMsg: "سأرسل الملف فوراً", avatar: "A" },
  { id: 2, name: "سارة محمود", status: "offline", lastMsg: "شكراً لك!", avatar: "S" },
  { id: 3, name: "فريق التطوير", status: "online", lastMsg: "تم حل المشكلة", avatar: "D" },
];

function Chat() {
  const { lang } = useTheme();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMessage = {
      id: Date.now(),
      text: input,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="h-[calc(100vh-100px)] flex bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl"
    >
      {/* Sidebar - Contacts */}
      <div className="w-80 border-r border-slate-200 dark:border-white/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-white/10">
          <h2 className="font-bold text-xl mb-4">{lang === "ar" ? "المحادثات" : "Chats"}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search..." className="w-full bg-slate-100 dark:bg-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map(c => (
            <div key={c.id} className="p-4 hover:bg-indigo-500/10 cursor-pointer transition-colors flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">{c.avatar}</div>
              <div>
                <h4 className="font-bold">{c.name}</h4>
                <p className="text-xs text-slate-400">{c.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden"><Menu /></button>
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">A</div>
            <div>
              <h3 className="font-bold">أحمد علي</h3>
              <span className="text-[10px] text-emerald-500 flex items-center gap-1">● {lang === "ar" ? "متصل الآن" : "Online"}</span>
            </div>
          </div>
          <div className="flex gap-4 text-slate-400">
            <Phone size={20} className="cursor-pointer hover:text-indigo-500" />
            <Video size={20} className="cursor-pointer hover:text-indigo-500" />
            <MoreVertical size={20} className="cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] p-4 rounded-2xl ${
                  m.sender === "me" 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-100 rounded-tl-none"
                }`}>
                  <p className="text-sm">{m.text}</p>
                  <span className="text-[10px] opacity-70 block mt-1 text-right">{m.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center gap-3 bg-white/5">
          <Paperclip size={22} className="text-slate-400 cursor-pointer" />
          <Smile size={22} className="text-slate-400 cursor-pointer" />
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={lang === "ar" ? "اكتب رسالة..." : "Type a message..."}
            className="flex-1 bg-transparent focus:outline-none"
          />
          <button 
            onClick={handleSend}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Chat;