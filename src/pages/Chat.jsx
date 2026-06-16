
import { useState } from "react";
import { motion } from "framer-motion";
import {  useEffect } from "react";

import {
  Search,
  Users,
  Crown,
  User,
  Target,

} from "lucide-react";

import useTheme from "../hooks/useTheme";

const chatData = {
  team: [
    {
      id: 1,
      name: "Ahmed Ali",
      online: true,
      unread: 3,
      lastMessage: "Dashboard finished",
      time: "10:22 PM",
      messages: 24,
    },
  ],

  premium: [
    {
      id: 2,
      name: "Sara Mohamed",
      online: true,
      unread: 1,
      lastMessage: "Need support",
      time: "09:15 PM",
    },
  ],

  free: [
    {
      id: 3,
      name: "John Smith",
      online: false,
      unread: 0,
      lastMessage: "Thank you",
      time: "Yesterday",
    },
  ],
};
function Chat() {
  const { lang } = useTheme();

  const [contactMessages, setContactMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("contactMessages")) || [];
  });

  useEffect(() => {
    const handleStorage = () => {
      const updated = JSON.parse(localStorage.getItem("contactMessages")) || [];

      setContactMessages(updated);
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const syncMessages = () => {
      const updated = JSON.parse(localStorage.getItem("contactMessages")) || [];

      setContactMessages(updated);
    };

    window.addEventListener("contact-update", syncMessages);

    return () => {
      window.removeEventListener("contact-update", syncMessages);
    };
  }, []);

const leadsChats = [...contactMessages]
  .sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  )
  .map((msg) => ({
    id: msg.id,
    name: msg.name,
    email: msg.email,
    message: msg.message,
    createdAt: msg.createdAt,
    unread: msg.unread ?? 1,
      status: msg.status || "New Lead",
  }));

  const [activeCategory, setActiveCategory] = useState("team");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedChat, setSelectedChat] = useState(chatData.team[0]);










  const categories = [
    {
      id: "team",
      label: "Team",
      icon: Users,
    },
    {
      id: "premium",
      label: "Premium",
      icon: Crown,
    },
    {
      id: "free",
      label: "Free",
      icon: User,
    },
    {
      id: "leads",
      label: `Leads (${leadsChats.length})`,
      icon: Target,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 p-8 bg-gradient-to-br from-indigo-500/15 via-transparent to-cyan-500/10 backdrop-blur-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black">
              {lang === "ar" ? "مركز المحادثات" : "Chat Center"}
            </h1>

            <p className="text-slate-500 mt-2">
              {lang === "ar"
                ? "إدارة المحادثات والعملاء والفريق"
                : "Manage team and customer conversations"}
            </p>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-slate-400
            "
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="
            pl-10
            pr-4
            py-2
            w-72

            rounded-xl

            bg-white
            dark:bg-slate-900

            border
            border-slate-200
            dark:border-white/10
            "
            />
          </div>
        </div>
      </div>

      {/* Main Layout */}

      <div className="grid grid-cols-12 gap-6 h-[700px]">
        {/* Sidebar */}

        <div
          className="
  col-span-12
  lg:col-span-4
xl:col-span-3

  rounded-3xl
  border

  border-slate-200
  dark:border-white/10

  bg-white
  dark:bg-slate-900

  p-4

  flex
  flex-col
  gap-4
  "
        >
          {/* Categories */}

          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
          h-12

          rounded-xl

          flex
          flex-col
          items-center
          justify-center

          transition-all

          ${
            activeCategory === cat.id
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-white/5"
          }
          `}
                >
                  <Icon size={16} />

                  <span className="text-[10px]">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conversations */}

          <div
            className="
    flex-1
    overflow-y-auto
    space-y-2
    "
          >
            {(activeCategory === "leads"
  ? leadsChats.filter((lead) =>
      lead.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      lead.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
              : chatData[activeCategory]?.filter((chat) =>
                  chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
            )?.map((chat) => (
              <button
                key={chat.id}
onClick={() => {
  setSelectedChat(chat);

  if (activeCategory === "leads") {
    const updated =
      contactMessages.map((lead) =>
        lead.id === chat.id
          ? {
              ...lead,
              unread: 0,
            }
          : lead
      );

    setContactMessages(updated);

    localStorage.setItem(
      "contactMessages",
      JSON.stringify(updated)
    );
  }
}}
                className={`
          w-full

          p-4

          rounded-2xl

          text-left

          transition-all

          ${
            selectedChat?.id === chat.id
              ? "bg-indigo-600 text-white"
              : "hover:bg-slate-100 dark:hover:bg-white/5"
          }
          `}
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${chat.name}`}
                        alt={chat.name}
                        className="
      w-10
      h-10
      rounded-full
      "
                      />

                      {chat.online && (
                        <span
                          className="
        absolute
        bottom-0
        right-0

        w-3
        h-3

        bg-emerald-500
        rounded-full

        border-2
        border-white
        "
                        />
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold">{chat.name}</h4>

                      <p className="text-[11px] opacity-60">
  {chat.status}
</p>

<p className="text-xs opacity-70">
  {chat.message || chat.lastMessage}
</p>
                    </div>
                  </div>
                  <div className="text-[11px] opacity-50">
                    Lead
                  </div>

                  {(chat.unread ?? 0) > 0 && (
                    <span
                      className="
                min-w-[22px]
                h-[22px]

                flex
                items-center
                justify-center

                rounded-full

                bg-red-500
                text-white

                text-xs
                font-bold
                "
                    >
                      {chat.unread}
                    </span>
                  )}
                </div>
<p className="text-xs opacity-70 mt-1">
  {chat.message || chat.lastMessage}
</p>

                <p className="text-[11px] opacity-50 mt-2">{chat.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}

        <div
          className="
       col-span-12
lg:col-span-8
xl:col-span-9

        rounded-3xl
        border

        border-slate-200
        dark:border-white/10

        bg-white
        dark:bg-slate-900

        p-4
        "
        >
          <div className="flex flex-col h-full">
            {/* Header */}

            <div
              className="
      pb-4
      border-b
      border-slate-200
      dark:border-white/10
    "
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${selectedChat?.name}`}
                  alt=""
                  className="
    w-12
    h-12
    rounded-full
    "
                />

                <div>
                  <h2 className="font-bold text-lg">{selectedChat?.name}</h2>

                  <p
                    className={
                      selectedChat?.online
                        ? "text-sm text-emerald-500"
                        : "text-sm text-slate-500"
                    }
                  >
                    {activeCategory === "leads"
  ? "Lead"
  : selectedChat?.online
  ? "Online"
  : "Offline"}
                  </p>
                </div>
              </div>
            </div>


{/* Content */}

<div className="flex-1 overflow-y-auto py-6 px-2">

  {activeCategory === "leads" ? (

    

    <div className="max-w-3xl mx-auto">

      <div className="rounded-3xl border border-slate-200 dark:border-white/10 p-8 bg-slate-50 dark:bg-white/5">

        <h2 className="text-2xl font-bold mb-6">
          Lead Information
        </h2>

        <div className="space-y-4">

          <div>
            <span className="font-semibold">Name:</span>{" "}
            {selectedChat?.name}
          </div>

          <div>
            <span className="font-semibold">Email:</span>{" "}
            {selectedChat?.email}
          </div>

          <div>
  <span className="font-semibold">
    Status:
  </span>{" "}
  {selectedChat.status}
</div>

<select
  value={selectedChat.status}
  onChange={(e) => {
    const updated =
      contactMessages.map((lead) =>
        lead.id === selectedChat.id
          ? {
              ...lead,
              status: e.target.value,
            }
          : lead
      );

    setContactMessages(updated);

    localStorage.setItem(
      "contactMessages",
      JSON.stringify(updated)
    );

    setSelectedChat({
      ...selectedChat,
      status: e.target.value,
    });
  }}
  className="
  mt-3
  px-4
  py-2
  rounded-xl
  border
  border-slate-200
  dark:border-white/10
  bg-white
  dark:bg-slate-900
  "
>
  <option>New Lead</option>
  <option>Contacted</option>
  <option>Interested</option>
  <option>Customer</option>
  <option>Rejected</option>
</select>

          <div>
            <span className="font-semibold">Date:</span>{" "}
            {selectedChat?.createdAt
              ? new Date(selectedChat.createdAt).toLocaleString()
              : "-"}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10">
            <span className="font-semibold">
              Message:
            </span>

            <div className="mt-3 p-4 rounded-2xl bg-white dark:bg-slate-900">
              {selectedChat?.message}
            </div>

            <button
  onClick={() => {
    const updated = contactMessages.filter(
      (lead) => lead.id !== selectedChat.id
    );

    setContactMessages(updated);

    localStorage.setItem(
      "contactMessages",
      JSON.stringify(updated)
    );

    setSelectedChat(
  activeCategory === "leads"
    ? updated[0] || {}
    : chatData.team[0]
);
  }}
  className="
  mt-6
  px-5
  py-3
  rounded-xl
  bg-red-600
  text-white
  hover:bg-red-700
  "
>
Delete Lead
</button>
          </div>

        </div>

      </div>

    </div>

  ) : (

    <div className="flex items-center justify-center h-full text-slate-400">

      Chat Window Coming Soon

    </div>

  )}

</div>

</div> 


          </div>
        </div>
     
    </motion.div>
  );
}

export default Chat;
