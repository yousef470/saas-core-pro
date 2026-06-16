import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  MoreVertical, 
  Calendar, 
  Clock, 
  Layout,
  Search,
    Edit,
  Trash2
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useTheme from "../hooks/useTheme";
import useAuth from "../hooks/useAuth";

// بيانات تجريبية أولية
const initialData = {
  tasks: {
"task-1": {
 id:"task-1",
 content:"تطوير نظام الدفع",
 desc:"ربط بوابة Stripe مع النظام الجديد",
 priority:"High",
 category:"Dev",
 date:"2026-06-12",
 status:"todo"
},
    "task-2": { id: "task-2", content: "تصميم الهوية البصرية", desc: "عمل لوجو جديد لنسخة برو", priority: "Medium", date: "2026-06-15", category: "Design",
       status:"progress"
     },
    "task-3": { id: "task-3", content: "تحليل البيانات", desc: "استخراج تقارير الربع الثاني", priority: "Low", date: "2026-06-20", category: "Analytics" , status:"todo"},
    "task-4": { id: "task-4", content: "تحسين الأداء", desc: "تقليل حجم الصور في الموقع", priority: "High", date: "2026-06-22", category: "Dev" , status:"done"},
  },
  columns: {
    "col-1": { id: "col-1", title: "To Do", titleAr: "قيد الانتظار", taskIds: ["task-1", "task-3"] },
    "col-2": { id: "col-2", title: "In Progress", titleAr: "قيد التنفيذ", taskIds: ["task-2"] },
    "col-3": { id: "col-3", title: "Done", titleAr: "تم الإنجاز", taskIds: ["task-4"] },
  },
  columnOrder: ["col-1", "col-2", "col-3"],
};

function Kanban() {

  const { user } = useAuth(); // سيُستخدم لإظهار اسم المستخدم في الترحيب
  const { lang } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(() => {
  const saved =
    localStorage.getItem("kanbanData");

  return saved
    ? JSON.parse(saved)
    : initialData;
});

const [showTaskModal, setShowTaskModal] =
  useState(false);

const [taskToDelete, setTaskToDelete] =
  useState(null);

const [editingTask, setEditingTask] =
  useState(null);

const [newTask, setNewTask] =
  useState({
    title: "",
    desc: "",
    priority: "Medium",
    category: "Dev",
    columnId: "col-1",
    date: "",
     status:"todo"
  });

useEffect(() => {
  localStorage.setItem(
    "kanbanData",
    JSON.stringify(data)
  );
}, [data]);



const onDragEnd = (result) => {
  const { destination, source, draggableId } = result;

  if (!destination) return;

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  const start = data.columns[source.droppableId];
  const finish = data.columns[destination.droppableId];

  // داخل نفس العمود
  if (start === finish) {
    const newTaskIds = Array.from(start.taskIds);

    newTaskIds.splice(source.index, 1);

    newTaskIds.splice(
      destination.index,
      0,
      draggableId
    );

    const newColumn = {
      ...start,
      taskIds: newTaskIds,
    };

 setData({
    ...data,
    columns: {
      ...data.columns,
      [newColumn.id]: newColumn,
    },
  });

    return;
  }

  // بين عمودين مختلفين
  const startTaskIds = Array.from(start.taskIds);

  startTaskIds.splice(source.index, 1);

  const newStart = {
    ...start,
    taskIds: startTaskIds,
  };

  const finishTaskIds = Array.from(finish.taskIds);

  finishTaskIds.splice(
    destination.index,
    0,
    draggableId
  );

  const newFinish = {
    ...finish,
    taskIds: finishTaskIds,
  };

  const statusMap = {
    "col-1": "todo",
    "col-2": "progress",
    "col-3": "done",
  };

  const updatedTask = {
    ...data.tasks[draggableId],
    status:
      statusMap[destination.droppableId],
  };


setData({
  ...data,

  tasks: {
    ...data.tasks,
    [draggableId]: updatedTask,
  },

  columns: {
    ...data.columns,
    [newStart.id]: newStart,
    [newFinish.id]: newFinish,
  },
});


};

  const handleAddTask = () => {
  if (!newTask.title.trim()) return;

  const taskId =
    `task-${Date.now()}`;

const columnStatusMap = {
  "col-1": "todo",
  "col-2": "progress",
  "col-3": "done",
};


const task = {
  id: taskId,
  content: newTask.title,
  desc: newTask.desc,
  priority: newTask.priority,
  category: newTask.category,
  date: newTask.date,

  status:
    columnStatusMap[newTask.columnId],
};

  const column =
    data.columns[newTask.columnId];

  const updatedColumn = {
    ...column,
    taskIds: [
      ...column.taskIds,
      taskId,
    ],
  };

  setData({
    ...data,
    tasks: {
      ...data.tasks,
      [taskId]: task,
    },
    columns: {
      ...data.columns,
      [updatedColumn.id]:
        updatedColumn,
    },
  });

  setShowTaskModal(false);

  setNewTask({
    title: "",
    desc: "",
    priority: "Medium",
    category: "Dev",
    columnId: "col-1",
    date: "",
    status:"todo"
  });





};


const handleSaveTaskEdit = () => {

const statusToColumn = {
  todo: "col-1",
  progress: "col-2",
  done: "col-3",
};

const targetColumnId =
  statusToColumn[editingTask.status];

// إزالة التاسك من كل الأعمدة
const newColumns = {};

Object.values(data.columns).forEach(
  (column) => {

    newColumns[column.id] = {
      ...column,
      taskIds: column.taskIds.filter(
        id => id !== editingTask.id
      ),
    };

  }
);

// إضافته للعمود الجديد
newColumns[targetColumnId] = {
  ...newColumns[targetColumnId],
  taskIds: [
    ...newColumns[targetColumnId].taskIds,
    editingTask.id,
  ],
};

setData({
  ...data,

  tasks: {
    ...data.tasks,
    [editingTask.id]: editingTask,
  },

  columns: newColumns,
});
  setEditingTask(null);
};



const handleDeleteTask = (
  taskId
) => {

  const newTasks = {
    ...data.tasks,
  };

  delete newTasks[taskId];

  const newColumns = {};

  Object.values(data.columns)
    .forEach((column) => {

      newColumns[column.id] = {
        ...column,
        taskIds:
          column.taskIds.filter(
            id => id !== taskId
          ),
      };

    });

  setData({
    ...data,
    tasks: newTasks,
    columns: newColumns,
  });

};

// داخل المكون Kanban قبل الـ return
const filteredColumns = useMemo(() => {
  const newColumns = { ...data.columns };
  
  Object.keys(newColumns).forEach((colId) => {
    const column = newColumns[colId];
    // فلترة المهام بناءً على السيرش
    const filteredTaskIds = column.taskIds.filter((taskId) =>
      data.tasks[taskId].content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    newColumns[colId] = { ...column, taskIds: filteredTaskIds };
  });
  
  return newColumns;
}, [data, searchTerm]);


  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
     className="min-h-screen "
    >
      <div className="relative space-y-8">

      {/* الخلفية المضيئة - نفس ستايل الداشبورد */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[140px] pointer-events-none" />

                 {/* =========================================
  Header
========================================= */}  

      <div className="relative z-10 space-y-8">
        {/* قسم العنوان والترحيب */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 p-8 bg-gradient-to-br from-indigo-500/15 via-transparent to-cyan-500/10 backdrop-blur-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                <Layout className="text-indigo-500" size={32} />
                {lang === "ar" ? `مهامك، ${user?.name || "بطل"} 👋` : `Your Tasks, ${user?.name || "Pro"} 👋`}
              </h1>
              <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl">
                {lang === "ar" ? "نظم مشاريعك وتابع تقدم فريقك لحظة بلحظة بتصميم زجاجي عصري." : "Manage your project workflows and track team performance with modern glassmorphism."}
              </p>
            </div>

           {/* =========================================
    Search
========================================= */}  
            
            <div className="flex gap-3">
               <div className="relative ">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
<input

type="text"
value={searchTerm}
onChange={(e)=>
setSearchTerm(e.target.value)
}
placeholder={
lang === "ar"
? "بحث..."
: "Search..."
}className="
pl-10
pr-4
py-2
w-64

bg-white
dark:bg-slate-900

border
border-slate-200
dark:border-white/10

rounded-xl

focus:outline-none
focus:ring-2
focus:ring-indigo-500/20
focus:border-indigo-500


"/>
               </div>


<button
onClick={() =>
  setShowTaskModal(true)
}
className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
>
                <Plus size={20} />
                <span className="hidden sm:inline">{lang === "ar" ? "إضافة مهمة" : "Add Task"}</span>
              </button>
            </div>
          </div>
        </div>


                   {/* =========================================
    STATS CARDS
========================================= */}  

<div className="
grid
grid-cols-1
md:grid-cols-3
gap-5
">

<div className="
p-6
rounded-3xl
bg-gradient-to-br
from-indigo-500/10
to-indigo-500/5
border
border-indigo-500/20
">
<h3 className="text-sm text-slate-500">
Total Tasks
</h3>

<p className="
text-4xl
font-black
mt-2
text-indigo-500
">
{Object.keys(data.tasks).length}
</p>
</div>

<div className="
p-6
rounded-3xl
bg-gradient-to-br
from-amber-500/10
to-amber-500/5
border
border-amber-500/20
">
<h3 className="text-sm text-slate-500">
In Progress
</h3>

<p className="
text-4xl
font-black
mt-2
text-amber-500
">
{data.columns["col-2"].taskIds.length}
</p>
</div>

<div className="
p-6
rounded-3xl
bg-gradient-to-br
from-emerald-500/10
to-emerald-500/5
border
border-emerald-500/20
">
<h3 className="text-sm text-slate-500">
Done
</h3>

<p className="
text-4xl
font-black
mt-2
text-emerald-500
">
{data.columns["col-3"].taskIds.length}
</p>
</div>

</div>



              {/* =========================================
    Kanban CARDS
========================================= */}  

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{data.columnOrder.map((columnId) => {
  // استخدم الأعمدة المفلترة التي جهزناها في الـ useMemo
  const column = filteredColumns[columnId]; 
  const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <div key={column.id} className="flex flex-col space-y-4">
                  {/* رأس العمود */}
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${column.id === 'col-1' ? 'bg-amber-500' : column.id === 'col-2' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                      <h3 className="font-bold text-lg tracking-tight uppercase">
                        {lang === "ar" ? column.titleAr : column.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-white/5 text-[10px] font-black opacity-60">
                        {tasks.length}
                      </span>
                    </div>
                    <MoreVertical size={18} className="text-slate-400 cursor-pointer" />
                  </div>

                  {/* منطقة الإفلات */}
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-[600px] rounded-[2rem] border transition-all duration-300 p-3 flex flex-col gap-4 ${
                          snapshot.isDraggingOver ? "bg-indigo-500/5 border-indigo-500/30 ring-4 ring-indigo-500/5" : "border-slate-200 dark:border-white/10 bg-white/5 backdrop-blur-sm"
                        }`}
                      >
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                                  snapshot.isDragging 
                                  ? "shadow-2xl border-indigo-500 ring-2 ring-indigo-500/20 scale-[1.02]" 
                                  : "border-slate-200 dark:border-white/5 hover:border-indigo-500/40 bg-white/5"
                                }`}
                                style={{
                                  ...provided.draggableProps.style,
                                  background: "var(--bg-card)",
                                  borderColor: "var(--border)"
                                }}
                              >
                                {/* تصنيف المهمة */}
                                <div className="flex items-center justify-between mb-4">
                                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg tracking-wider ${
                                    task.category === "Design" ? "bg-pink-500/10 text-pink-500" : 
                                    task.category === "Dev" ? "bg-indigo-500/10 text-indigo-500" : "bg-emerald-500/10 text-emerald-500"
                                  }`}>
                                    {task.category}
                                  </span>
                                  <span
className={`
text-[10px]
font-bold
px-2
py-1
rounded-lg

${task.status === "todo"
? "bg-amber-500/10 text-amber-500"
: task.status === "progress"
? "bg-indigo-500/10 text-indigo-500"
: "bg-emerald-500/10 text-emerald-500"
}
`}
>
{
task.status === "todo"
? "To Do"
: task.status === "progress"
? "In Progress"
: "Done"
}
</span>
                                  <Clock size={14} className={task.priority === 'High' ? 'text-red-500' : 'text-slate-400'} />
<button
className="mr-2"
onClick={() => {
  setEditingTask(task);
}}
>
  <Edit
    size={16}
    className="
    text-indigo-500
    hover:scale-110
    transition
    "
  />
</button>

<button
onClick={() =>
  setTaskToDelete(task.id)
}
>
  <Trash2
    size={16}
    className="
    text-red-500
    hover:scale-110
    transition
    "
  />
</button>

                                </div>

                                <h4 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-500 transition-colors">
                                  {task.content}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-5">
                                  {task.desc}
                                </p>

                                {/* أسفل الكارت */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                  <div className="flex -space-x-2">
                                    {[1, 2].map((i) => (
                                      <img
                                        key={i}
                                        className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover"
                                        src={`https://ui-avatars.com/api/?name=User+${i}&background=6366f1&color=fff`}
                                        alt="Avatar"
                                      />
                                    ))}
                                    <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">+1</div>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                                    <Calendar size={12} />
                                    {new Date(task.date)
.toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {/* زر إضافة سريع في نهاية العمود */}
                        <button
                        onClick={() =>
setShowTaskModal(true)
} className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 transition-all text-xs font-bold">
                           + {lang === 'ar' ? 'إضافة مهمة' : 'New Task'}
                        </button>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
</div>

           {/* =========================================
    modals
========================================= */}  
{showTaskModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="w-full max-w-md bg-white/90
dark:bg-slate-900/95
backdrop-blur-xl
border border-slate-200
dark:border-white/10
shadow-2xl
shadow-black/20 rounded-3xl p-6">

      <h2 className="text-xl font-bold mb-5">
        Add Task
      </h2>

      <div className="space-y-4">

        <input
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              title: e.target.value,
            })
          }
         className="
w-full h-11
px-4
rounded-xl
bg-slate-50
dark:bg-slate-800/50
border
border-slate-200
dark:border-white/10
focus:border-indigo-500
focus:ring-2
focus:ring-indigo-500/20
outline-none
transition-all
"
        />

        <textarea
          placeholder="Description"
          value={newTask.desc}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              desc: e.target.value,
            })
          }
          className="w-full p-4 rounded-xl border bg-slate-50
dark:bg-slate-800/50

border-slate-200
dark:border-white/10
focus:border-indigo-500
focus:ring-2
focus:ring-indigo-500/20
outline-none
transition-all"
        />

        <select
          value={newTask.priority}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              priority: e.target.value,
            })
          }
         className="
w-full
h-11
px-4
rounded-xl
bg-slate-50
dark:bg-slate-800
border
border-slate-200
dark:border-white/10
text-slate-900
dark:text-white
"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          value={newTask.category}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              category: e.target.value,
            })
          }
         className="
w-full
h-11
px-4
rounded-xl
bg-slate-50
dark:bg-slate-800
border
border-slate-200
dark:border-white/10
text-slate-900
dark:text-white
"
        >
          <option>Dev</option>
          <option>Design</option>
          <option>Analytics</option>
        </select>

        <select
          value={newTask.columnId}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              columnId: e.target.value,
            })
          }
         className="
w-full
h-11
px-4
rounded-xl
bg-slate-50
dark:bg-slate-800
border
border-slate-200
dark:border-white/10
text-slate-900
dark:text-white
"
        >
          <option value="col-1">
            To Do
          </option>

          <option value="col-2">
            In Progress
          </option>

          <option value="col-3">
            Done
          </option>
        </select>

        <input
          type="date"
          value={newTask.date}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              date: e.target.value,
            })
          }
         className="
w-full
h-11
px-4
rounded-xl
bg-slate-50
dark:bg-slate-800
border
border-slate-200
dark:border-white/10
text-slate-900
dark:text-white
"
        />

      </div>

      <div className="flex gap-3 mt-6">

        <button
          onClick={() =>
            setShowTaskModal(false)
          }
          className="flex-1 h-11 border
border-slate-200
dark:border-white/10
hover:bg-slate-100
dark:hover:bg-white/5
transition-all
rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={handleAddTask}
          className="flex-1 h-11 bg-indigo-600 text-white rounded-xl"
        >
          Add Task
        </button>

      </div>

    </div>

  </div>
)}


{editingTask && (

<div className="
fixed inset-0
bg-black/50
flex items-center justify-center
z-50
">

<div
className="
w-full max-w-md
bg-white/95
dark:bg-slate-900/95
backdrop-blur-xl
border
border-slate-200
dark:border-white/10
rounded-3xl
p-6
shadow-2xl
shadow-black/20
"
>

<h2 className="
text-xl font-bold mb-5
">
Edit Task
</h2>

<div className="space-y-4">

<input
value={editingTask.content}
onChange={(e)=>
setEditingTask({
...editingTask,
content:e.target.value
})
}
className="
w-full
h-11
px-4
rounded-xl
bg-slate-50
dark:bg-slate-800
border
border-slate-200
dark:border-white/10
text-slate-900
dark:text-white
"
/>

<textarea
value={editingTask.desc}
onChange={(e)=>
setEditingTask({
...editingTask,
desc:e.target.value
})
}
className="
w-full p-4
rounded-xl border
bg-slate-50
dark:bg-slate-800

border-slate-200
dark:border-white/10
text-slate-900
dark:text-white
"
/>

<select
value={editingTask.priority}
onChange={(e)=>
setEditingTask({
...editingTask,
priority:e.target.value
})
}
className="
w-full
h-11
px-4
rounded-xl
bg-slate-50
dark:bg-slate-800
border
border-slate-200
dark:border-white/10
text-slate-900
dark:text-white
"
>
<option>Low</option>
<option>Medium</option>
<option>High</option>
</select>


<select
value={editingTask.status}
onChange={(e)=>
setEditingTask({
...editingTask,
status:e.target.value
})
}
className="
w-full
h-11
px-4
rounded-xl
bg-slate-50
dark:bg-slate-800
border
border-slate-200
dark:border-white/10
text-slate-900
dark:text-white
"
>
<option value="todo">
To Do
</option>

<option value="progress">
In Progress
</option>

<option value="done">
Done
</option>
</select>



<select
value={editingTask.category}
onChange={(e)=>
setEditingTask({
...editingTask,
category:e.target.value
})
}
className="
w-full
h-11
px-4
rounded-xl
bg-slate-50
dark:bg-slate-800
border
border-slate-200
dark:border-white/10
text-slate-900
dark:text-white
"
>
<option>Dev</option>
<option>Design</option>
<option>Analytics</option>
</select>


<input
type="date"
value={editingTask.date}
onChange={(e)=>
setEditingTask({
...editingTask,
date:e.target.value
})
}
className="
w-full
h-11
px-4
rounded-xl
bg-slate-50
dark:bg-slate-800
border
border-slate-200
dark:border-white/10
text-slate-900
dark:text-white
"
/>

</div>


<div className="
flex gap-3 mt-6
">

<button
onClick={()=>
setEditingTask(null)
}
className="
flex-1 h-11
border
border-slate-200
dark:border-white/10
hover:bg-slate-100
dark:hover:bg-white/5
transition-all
rounded-xl
"
>
Cancel
</button>

<button
onClick={handleSaveTaskEdit}
className="
flex-1 h-11
bg-indigo-600
text-white
rounded-xl
"
>
Save
</button>

</div>

</div>

</div>

)}


{taskToDelete && (

<div
className="
fixed inset-0
bg-black/50
flex items-center
justify-center
z-50
"
>

<div
className="
bg-white
dark:bg-slate-900
rounded-3xl
p-6
w-[350px]
"
>

<h2
className="
font-bold
text-lg
"
>
Delete Task
</h2>

<p
className="mt-3"
>
Are you sure?
</p>

<div
className="
flex gap-3 mt-6
"
>

<button
onClick={() =>
setTaskToDelete(null)
}
className="
flex-1
h-11
border
rounded-xl
"
>
Cancel
</button>

<button
onClick={() => {
handleDeleteTask(
taskToDelete
);

setTaskToDelete(
null
);
}}
className="
flex-1
h-11
bg-red-500
hover:bg-red-600
shadow-lg
shadow-red-500/20
text-white
rounded-xl
"
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

export default Kanban;