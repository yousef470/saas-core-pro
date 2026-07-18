import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  Crown,
  User,
  Target,
  Mail,
  Calendar,
  Trash2,
  Send,
} from "lucide-react";
import useTheme from "../hooks/useTheme";

const initialChatData = {
  team: [
    {
      id: 1,
      name: "Ahmed Ali",
      online: true,
      unread: 3,
      time: "10:22 PM",
      messages: [
        {
          id: 101,
          text: "Hello team! Status on the new updates?",
          sender: "them",
          time: "10:20 PM",
        },
        {
          id: 102,
          text: "Dashboard finished",
          sender: "them",
          time: "10:22 PM",
        },
      ],
    },
  ],
  premium: [
    {
      id: 2,
      name: "Sara Mohamed",
      online: true,
      unread: 1,
      time: "09:15 PM",
      messages: [
        {
          id: 201,
          text: "I am having trouble with premium API integration.",
          sender: "them",
          time: "09:10 PM",
        },
        {
          id: 202,
          text: "Need support ASAP please.",
          sender: "them",
          time: "09:15 PM",
        },
      ],
    },
  ],
  free: [
    {
      id: 3,
      name: "John Smith",
      online: false,
      unread: 0,
      time: "Yesterday",
      messages: [
        {
          id: 301,
          text: "Is the core package completely free?",
          sender: "them",
          time: "Yesterday",
        },
        { id: 302, text: "Thank you", sender: "them", time: "Yesterday" },
      ],
    },
  ],
};

const getStatusStyles = (status) => {
  switch (status) {
    case "New Lead":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "Contacted":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "Interested":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "Customer":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "Rejected":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    default:
      return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  }
};

function Chat() {
  const { lang, t } = useTheme();
  const [activeCategory, setActiveCategory] = useState("team");
  const [searchTerm, setSearchTerm] = useState("");
  const [leadFilter, setLeadFilter] = useState("All");
  const messagesEndRef = useRef(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");

  // 1. إدارة بيانات الشات العادي مع الحفظ في الـ LocalStorage
  const [dynamicChatData, setDynamicChatData] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("interactiveChats")) || initialChatData
    );
  });

  // 2. إدارة بيانات الـ Leads
  const [contactMessages, setContactMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("contactMessages")) || [];
  });

  // تجميع الـ Leads
  const leadsChats = useMemo(() => {
    return [...contactMessages]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((msg) => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        message: msg.message,
        createdAt: msg.createdAt,
        unread: msg.unread ?? 1,
        status: msg.status || "New Lead",
      }));
  }, [contactMessages]);

  // تصفية المحادثات بناءً على القسم النشط والبحث
  const filteredChats = useMemo(() => {
    return activeCategory === "leads"
      ? leadsChats.filter((lead) => {
          const matchesSearch =
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesStatus =
            leadFilter === "All" || lead.status === leadFilter;

          return matchesSearch && matchesStatus;
        })
      : dynamicChatData[activeCategory]?.filter((chat) =>
          chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ) || [];
  }, [activeCategory, leadsChats, dynamicChatData, searchTerm, leadFilter]);

  // تحديد المحادثة النشطة بدقة
  const selectedChat = useMemo(() => {
    return (
      filteredChats.find((chat) => chat.id === selectedChatId) ||
      filteredChats[0] ||
      null
    );
  }, [filteredChats, selectedChatId]);

  // الاستماع للتحديثات الخارجية
  useEffect(() => {
    const handleStorage = () => {
      const updatedLeads =
        JSON.parse(localStorage.getItem("contactMessages")) || [];
      const updatedChats =
        JSON.parse(localStorage.getItem("interactiveChats")) || initialChatData;
      setContactMessages(updatedLeads);
      setDynamicChatData(updatedChats);
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("contact-update", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("contact-update", handleStorage);
    };
  }, []);

  // سكرول تلقائي لآخر الرسائل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages, isTyping]);

  // فانكشن إرسال رسالة جديدة مع الحفظ الفوري
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedChat) return;

    const newMsg = {
      id: Date.now(),
      text: typedMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedData = { ...dynamicChatData };
    updatedData[activeCategory] = updatedData[activeCategory].map((chat) => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          time: newMsg.time,
          messages: [...(chat.messages || []), newMsg],
        };
      }
      return chat;
    });

    setDynamicChatData(updatedData);
    localStorage.setItem("interactiveChats", JSON.stringify(updatedData));
    setTypedMessage("");

    // محاكاة كتابة الطرف الآخر لمظهر تفاعلي
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const categories = [
    {
      id: "team",
      label: t.chatPage.categories.team,
      icon: Users,
    },
    {
      id: "premium",
      label: t.chatPage.categories.premium,
      icon: Crown,
    },
    {
      id: "free",
      label: t.chatPage.categories.free,
      icon: User,
    },
    {
      id: "leads",
      label: `${t.chatPage.categories.leads} (${leadsChats.length})`,
      icon: Target,
    },
  ];

  const isRtl = lang === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-slate-900 dark:text-white p-2"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 p-6 bg-white/50 dark:bg-[#12141c]/50 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-4xl font-black tracking-normal bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {t.chatPage.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {t.chatPage.subtitle}
            </p>
          </div>

          <div className="relative">
            <Search
              size={16}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? "right-4" : "left-4"}`}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.chatPage.searchPlaceholder}
              className={`w-full md:w-80 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 focus:outline-none focus:border-indigo-500 text-sm  ${isRtl ? "pr-11 pl-4" : "pl-11 pr-4"}`}
            />
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6 min-h-[600px] h-[650px]">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-xl p-4 flex flex-col gap-4 shadow-sm overflow-hidden">
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl shrink-0">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSelectedChatId(null);
                  }}
                  className={`h-11 rounded-xl flex flex-col items-center justify-center transition-all relative ${isActive ? "text-white font-bold" : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5"}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-10"
                    />
                  )}
                  <Icon size={15} />
                  <span className="text-[10px] mt-0.5 tracking-normal">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {activeCategory === "leads" && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="shrink-0"
            >
              <select
                value={leadFilter}
                onChange={(e) => setLeadFilter(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 outline-none cursor-pointer focus:border-indigo-500 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              >
                <option value="All">{t.chatPage.filters.all}</option>
                <option value="New Lead">{t.chatPage.filters.newLead}</option>
                <option value="Contacted">
                  {t.chatPage.filters.contacted}
                </option>
                <option value="Interested">
                  {t.chatPage.filters.interested}
                </option>
                <option value="Customer">{t.chatPage.filters.customer}</option>
                <option value="Rejected">{t.chatPage.filters.rejected}</option>
              </select>
            </motion.div>
          )}

          {/* Conversations Feed */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredChats.length === 0 ? (
                <div className="text-center py-16 space-y-2 text-slate-400">
                  <Target size={20} className="mx-auto" />
                  <h3 className="font-bold text-sm">{t.chatPage.noResults}</h3>
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const isSelected = selectedChat?.id === chat.id;
                  const latestMsg = chat.messages
                    ? chat.messages[chat.messages.length - 1]?.text
                    : chat.message || chat.lastMessage;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChatId(chat.id)}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all ${isRtl ? "text-right" : "text-left"} ${isSelected ? "bg-gradient-to-r from-indigo-600 to-indigo-700 border-indigo-600 text-white shadow-md shadow-indigo-600/10" : "bg-white dark:bg-white/2 hover:bg-slate-50 dark:hover:bg-white/5 border-slate-100 dark:border-white/5"}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=random&color=fff`}
                            alt={chat.name}
                            className="w-9 h-9 rounded-full border border-white/10"
                          />
                          {chat.online && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-bold text-xs truncate">
                            {chat.name}
                          </h4>
                          <p
                            className={`text-[11px] truncate mt-0.5 ${isSelected ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"}`}
                          >
                            {latestMsg}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span
                          className={`text-[10px] ${isSelected ? "text-indigo-200" : "text-slate-400"}`}
                        >
                          {chat.time ||
                            (chat.createdAt
                              ? new Date(chat.createdAt).toLocaleDateString(
                                  [],
                                  { month: "short", day: "numeric" },
                                )
                              : "")}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat / Info Window */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12141c] p-4 shadow-sm flex flex-col justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedChat ? (
              <div
                className="flex flex-col h-full justify-between overflow-hidden"
                key={selectedChat.id}
              >
                {/* Header */}
                <div className="flex items-center pb-3 border-b border-slate-100 dark:border-white/5 shrink-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChat.name)}&background=random&color=fff`}
                      alt={selectedChat.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h2 className="font-bold text-md leading-tight">
                        {selectedChat.name}
                      </h2>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span className="relative flex items-center justify-center">
                          <span
                            className={`block w-2 h-2 rounded-full ${
                              selectedChat.online
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {selectedChat.online && (
                            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                          )}
                        </span>

                        {activeCategory === "leads"
                          ? t.chatPage.leadRecord
                          : t.chatPage.liveChat}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Space / Lead Info Body */}
                <div className="flex-1 my-3 overflow-y-auto pr-1 custom-scrollbar">
                  {activeCategory === "leads" ? (
                    <div className="max-w-xl mx-auto space-y-4 py-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5">
                          <span className="text-[10px] text-slate-400 block">
                            <Mail size={12} className="inline mr-1" />{" "}
                            {t.chatPage.email}
                          </span>
                          <span className="text-xs font-medium block truncate mt-0.5">
                            {selectedChat.email}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5">
                          <span className="text-[10px] text-slate-400 block">
                            <Calendar size={12} className="inline mr-1" />{" "}
                            {t.chatPage.createdAt}
                          </span>
                          <span className="text-xs font-medium block mt-0.5">
                            {selectedChat.createdAt
                              ? new Date(
                                  selectedChat.createdAt,
                                ).toLocaleString()
                              : "-"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/2 flex items-center justify-between">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-0.5">
                            {t.chatPage.dealStage}
                          </label>
                          <span
                            className={`inline-block text-[11px] px-2 py-0.5 rounded font-semibold border ${getStatusStyles(selectedChat.status)}`}
                          >
                            {selectedChat.status}
                          </span>
                        </div>
                        <select
                          value={selectedChat.status || ""}
                          onChange={(e) => {
                            const updated = contactMessages.map((lead) =>
                              lead.id === selectedChat.id
                                ? { ...lead, status: e.target.value }
                                : lead,
                            );
                            setContactMessages(updated);
                            localStorage.setItem(
                              "contactMessages",
                              JSON.stringify(updated),
                            );
                          }}
                          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 dark:text-white"
                        >
                          <option value="New Lead">
                            {t.chatPage.filters.newLead}
                          </option>
                          <option value="Contacted">
                            {t.chatPage.filters.contacted}
                          </option>
                          <option value="Interested">
                            {t.chatPage.filters.interested}
                          </option>
                          <option value="Customer">
                            {t.chatPage.filters.customer}
                          </option>
                          <option value="Rejected">
                            {t.chatPage.filters.rejected}
                          </option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">
                          {t.chatPage.messageBody}
                        </label>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-xs leading-relaxed">
                          {selectedChat.message}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            if (confirm(t.chatPage.confirmDelete)) {
                              const updated = contactMessages.filter(
                                (lead) => lead.id !== selectedChat.id,
                              );
                              setContactMessages(updated);
                              localStorage.setItem(
                                "contactMessages",
                                JSON.stringify(updated),
                              );
                              setSelectedChatId(null);
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-600/20 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Trash2 size={13} />
                          <span>{t.chatPage.deleteLead}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 min-h-full justify-end py-2 px-1">
                      {selectedChat.messages?.map((msg) => {
                        const isMe = msg.sender === "me";
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`max-w-[60%] md:max-w-[50%] px-4 py-3 rounded-3xl text-sm shadow-lg ${isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-bl-none"}`}
                            >
                              {msg.text}
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-1 px-1">
                              <span>{msg.time}</span>
                              {isMe && <span className="slate">✓✓</span>}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Footer Inputs */}
                <div className="shrink-0">
                  {isTyping && activeCategory !== "leads" && (
                    <div className="px-2 pb-2">
                      <div className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <span>{t.chatPage.typing}</span>
                        <div className="flex gap-1">
                          <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                          <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-100" />
                          <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeCategory !== "leads" && (
                    <form
                      onSubmit={handleSendMessage}
                      className="pt-3 border-t border-slate-100 dark:border-white/5 flex gap-2"
                    >
                      <input
                        type="text"
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                        placeholder={t.chatPage.messagePlaceholder}
                        className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                      />
                      <button
                        type="submit"
                        className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md shadow-indigo-600/10 shrink-0"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2 w-full">
                <Target size={32} className="text-slate-300 animate-pulse" />
                <h3 className="font-bold text-xs">{t.chatPage.noActiveChat}</h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default Chat;
