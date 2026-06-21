import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import useTheme from "../hooks/useTheme";

const defaultEvents = [
  {
    id: 1,
    title: "اجتماع الفريق",
    time: "10:00",
    type: "work",
    date: "2026-06-15",
  },
];

function Calendar() {
  const { lang } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendarEvents");
    return saved ? JSON.parse(saved) : defaultEvents;
  });

  const [editingEvent, setEditingEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [deleteEvent, setDeleteEvent] = useState(null);
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    type: "work",
  });

  const [view, setView] = useState("month");

  // حفظ المواعيد في الـ LocalStorage
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [selectedDate, setSelectedDate] = useState(todayString);

  // دالة لتحديد اليوم الافتراضي عند تغيير الشهر (تُستدعى بداخل الـ Handlers مباشرة)
  const getDefaultSelectedDate = (date) => {
    const now = new Date();
    const isCurrentMonth = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const day = isCurrentMonth ? now.getDate() : 1;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  // تحسين الأداء باستخدام useMemo للحسابات والإحصائيات
  const stats = useMemo(() => {
    return {
      total: events.length,
      today: events.filter((e) => e.date === todayString).length,
      work: events.filter((e) => e.type === "work").length,
      meeting: events.filter((e) => e.type === "meeting").length,
      personal: events.filter((e) => e.type === "personal").length,
    };
  }, [events, todayString]);

  const selectedEvents = useMemo(() => {
    return events.filter((event) => event.date === selectedDate);
  }, [events, selectedDate]);

  const weekDates = useMemo(() => {
    const selected = new Date(selectedDate);
    const day = selected.getDay();
    const start = new Date(selected);
    start.setDate(selected.getDate() - day);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  const handleSaveEdit = () => {
    setEvents(events.map((event) => (event.id === editingEvent.id ? editingEvent : event)));
    setEditingEvent(null);
  };

  const getEventColor = (type) => {
    switch (type) {
      case "work": return "bg-indigo-500";
      case "meeting": return "bg-emerald-500";
      case "personal": return "bg-orange-500";
      case "holiday": return "bg-pink-500";
      default: return "bg-slate-500";
    }
  };

  const getEventLabel = (type) => {
    switch (type) {
      case "work": return "💼 Work";
      case "meeting": return "📅 Meeting";
      case "personal": return "🏠 Personal";
      case "holiday": return "🎉 Holiday";
      default: return type;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-10">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500 rounded-2xl text-white">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black">
                {lang === "ar" ? "التقويم" : "Calendar"}
              </h1>
              <p className="text-sm text-slate-400">
                {currentDate.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-indigo-500 font-semibold">{stats.total} Events</span>
                <span className="text-emerald-500 font-semibold">{stats.today} Today</span>
              </div>
            </div>
          </div>

          {/* أزرار التنقل المعالجة لحل مشكلة الـ Render المتتالي */}
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
            <button
              onClick={() => {
                const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                setCurrentDate(newDate);
                setSelectedDate(getDefaultSelectedDate(newDate)); // تحديث متزامن مباشر في نفس الضغطة
              }}
              className="p-2 hover:bg-white/10 rounded-xl transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold px-4">{lang === "ar" ? "الشهر" : "Month"}</span>
            <button
              onClick={() => {
                const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                setCurrentDate(newDate);
                setSelectedDate(getDefaultSelectedDate(newDate)); // تحديث متزامن مباشر في نفس الضغطة
              }}
              className="p-2 hover:bg-white/10 rounded-xl transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Plus size={20} />
            {lang === "ar" ? "حدث جديد" : "New Event"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm text-slate-400">Total Events</h3>
            <p className="text-2xl font-black">{stats.total}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm text-slate-400">Work</h3>
            <p className="text-2xl font-black">{stats.work}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm text-slate-400">Meetings</h3>
            <p className="text-2xl font-black">{stats.meeting}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm text-slate-400">Personal</h3>
            <p className="text-2xl font-black">{stats.personal}</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 w-fit">
          {[
            { id: "month", label: "Month" },
            { id: "week", label: "Week" },
            { id: "day", label: "Day" },
            { id: "agenda", label: "Agenda" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${view === tab.id ? "bg-indigo-600 text-white" : "hover:bg-white/10"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Views Rendering */}
        {view === "month" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Calendar Grid */}
            <div className="lg:col-span-3 bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 backdrop-blur-xl">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["ح", "ن", "ث", "ر", "خ", "ج", "س"].map((day) => (
                  <div key={day} className="text-center text-xs font-black text-slate-500 py-2 uppercase tracking-widest">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {[...Array(daysInMonth)].map((_, i) => {
                  const dayNumber = i + 1;
                  const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
                  const isSelected = selectedDate === dateString;
                  const dayEvents = events.filter((event) => event.date === dateString);
                  const isToday = dateString === todayString;

                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDate(dateString)}
                      className={`h-24 md:h-32 border border-white/5 rounded-3xl p-3 transition-all hover:bg-indigo-500/5 cursor-pointer group ${isSelected ? "bg-indigo-600 ring-4 ring-indigo-500/20 text-white" : ""} ${isToday ? "ring-2 ring-emerald-500" : ""}`}
                    >
                      <span className="font-bold text-sm">{dayNumber}</span>
                      <div className="mt-2 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div key={event.id} className={`text-[10px] px-1 py-1 rounded-md text-white truncate ${getEventColor(event.type)}`}>
                            {event.title}
                          </div>
                        ))}
                        {/* تم حل تكرار الـ More الحاصل هنا */}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-indigo-500 font-semibold">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Events */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold px-2">
                {lang === "ar" ? `مواعيد ${selectedDate}` : `Events ${selectedDate}`}
              </h3>

              {selectedEvents.length === 0 && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center text-slate-400">
                  {lang === "ar" ? "لا توجد أحداث في هذا اليوم" : "No events for this day"}
                </div>
              )}

              {selectedEvents.map((event) => (
                <div key={event.id} className="group p-5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl hover:border-indigo-500/50 transition-all backdrop-blur-md">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`w-2 h-10 rounded-full ${getEventColor(event.type)}`} />
                    <div className="flex gap-2">
                      <button onClick={() => setEditingEvent(event)}>
                        <Edit size={16} className="text-indigo-500" />
                      </button>
                      <button onClick={() => setDeleteEvent(event)}>
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold mb-1">{event.title}</h4>
                  <div className="flex flex-col gap-1 text-xs text-slate-400">
                    <div className="flex items-center gap-2"><Clock size={12} /> {event.time}</div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] text-white w-fit ${getEventColor(event.type)}`}>
                      {getEventLabel(event.type)}
                    </div>
                    <div>{event.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

{view === "week" && (
  <div className="bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 backdrop-blur-xl space-y-6">
    {/* عنوان القسم */}
    <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-4">
      <h2 className="text-xl font-black tracking-tight">
        {lang === "ar" ? "عرض الأسبوع الحالي" : "Weekly Schedule"}
      </h2>
      <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
        7 Days View
      </span>
    </div>

    {/* شبكة أيام الأسبوع */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {weekDates.map((date) => {
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        const dayEvents = events.filter((event) => event.date === dateString);
        const isSelectedDay = selectedDate === dateString;
        const isCurrentDay = dateString === todayString;

        // الحصول على اسم اليوم باللغة الحالية
        const dayName = date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { weekday: "short" });

        return (
          <div
            key={dateString}
            onClick={() => setSelectedDate(dateString)}
            className={`group relative flex flex-col rounded-3xl p-4 min-h-[280px] transition-all duration-300 cursor-pointer border backdrop-blur-md
              ${isSelectedDay 
                ? "bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500" 
                : "bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:bg-white/10"
              }
              ${isCurrentDay ? "ring-2 ring-emerald-500/50 border-emerald-500" : ""}
            `}
          >
            {/* رأس بطاقة اليوم */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-white/5">
              <div className="flex flex-col">
                <span className={`text-xs font-bold tracking-wider uppercase ${isSelectedDay ? "text-indigo-400" : "text-slate-400"}`}>
                  {dayName}
                </span>
                <span className="text-lg font-black mt-0.5">
                  {date.getDate()}
                </span>
              </div>
              
              {/* شارة عدد الأحداث */}
              {dayEvents.length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isSelectedDay ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-300"}`}>
                  {dayEvents.length}
                </span>
              )}
            </div>

            {/* قائمة أحداث اليوم */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[180px] scrollbar-none">
              {dayEvents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8 opacity-40 group-hover:opacity-60 transition-opacity">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mb-1" />
                  <span className="text-[10px] font-medium tracking-wide">
                    {lang === "ar" ? "فارغ" : "No Events"}
                  </span>
                </div>
              ) : (
                dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-2.5 rounded-2xl text-xs text-white border transition-all duration-200 hover:scale-[1.02] flex flex-col gap-1 shadow-sm
                      ${getEventColor(event.type)} bg-opacity-20 backdrop-blur-sm border-white/10 hover:bg-opacity-30
                    `}
                  >
                    <div className="font-black truncate tracking-tight">{event.title}</div>
                    <div className="flex items-center gap-1 text-[10px] opacity-80 font-medium">
                      <Clock size={10} />
                      {event.time}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* مؤشر توهج سفلي لطيف لليوم الحالي */}
            {isCurrentDay && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-emerald-500 rounded-full shadow-md shadow-emerald-500" />
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

        {view === "agenda" && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-6">Agenda</h2>
            {[...events]
              .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
              .map((event) => (
                <div key={event.id} className="mb-4 p-4 rounded-2xl border border-white/10 bg-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${getEventColor(event.type)}`}>
                      {getEventLabel(event.type)}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">📅 {event.date}</div>
                  <div className="text-sm text-slate-400">⏰ {event.time}</div>
                </div>
              ))}
            {events.length === 0 && (
              <div className="text-center py-16">
                <CalendarIcon size={48} className="mx-auto mb-4 text-slate-400" />
                <h3 className="font-bold text-lg">No Events Yet</h3>
                <p className="text-slate-500 mt-2">Create your first event.</p>
              </div>
            )}
          </div>
        )}

        {view === "day" && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-6">{selectedDate}</h2>
            <div className="space-y-3">
              {selectedEvents.length === 0 && <div className="text-slate-400">No events</div>}
              {selectedEvents.map((event) => (
                <div key={event.id} className="p-4 rounded-2xl border border-white/10 bg-white/5">
                  <div className="font-bold">{event.title}</div>
                  <div className="text-sm text-slate-400">{event.time}</div>
                  <div className={`mt-2 inline-flex px-2 py-1 rounded-full text-xs text-white ${getEventColor(event.type)}`}>
                    {getEventLabel(event.type)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl shadow-black/20 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-5">Edit Event</h2>
            <div className="space-y-4">
              <input
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                value={editingEvent.date}
                onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="time"
                value={editingEvent.time}
                onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={editingEvent.type}
                onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="work">💼 Work</option>
                <option value="meeting">📅 Meeting</option>
                <option value="personal">🏠 Personal</option>
                <option value="holiday">🎉 Holiday</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingEvent(null)} className="flex-1 h-11 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl shadow-black/20 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-5">New Event</h2>
            <div className="space-y-4">
              <input
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="work">💼 Work</option>
                <option value="meeting">📅 Meeting</option>
                <option value="personal">🏠 Personal</option>
                <option value="holiday">🎉 Holiday</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEventModal(false)} className="flex-1 h-11 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newEvent.title.trim() || !newEvent.date || !newEvent.time) {
                    alert("Please fill all fields");
                    return;
                  }
                  const eventDateTime = new Date(`${newEvent.date}T${newEvent.time}`);
                  if (eventDateTime < new Date()) {
                    alert("Cannot create event in the past");
                    return;
                  }
                  const event = {
                    id: Date.now(),
                    title: newEvent.title,
                    date: newEvent.date,
                    time: newEvent.time,
                    type: newEvent.type,
                  };
                  setEvents([...events, event]);
                  setShowEventModal(false);
                  setNewEvent({ title: "", date: "", time: "", type: "work" });
                }}
                className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-3">Delete Event</h2>
            <p className="text-slate-500 mb-6">
              Are you sure you want to delete <strong>{deleteEvent.title}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteEvent(null)} className="flex-1 h-11 rounded-xl border border-slate-300 dark:border-slate-700">
                Cancel
              </button>
              <button
                onClick={() => {
                  setEvents(events.filter((e) => e.id !== deleteEvent.id));
                  setDeleteEvent(null);
                }}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Calendar;