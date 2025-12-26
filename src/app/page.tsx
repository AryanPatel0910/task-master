import { addTask, deleteTask, toggleTask } from "./actions";
import { prisma } from "@/lib/db";

export default async function Home() {
  // Fetch tasks directly in the component (Server Component magic!)
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-xl mx-auto mt-20 p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Master</h1>

      {/* The Input Form */}
      <form action={addTask} className="flex gap-2 mb-8">
        <input 
          type="text" 
          name="title"
          placeholder="What needs to be done?" 
          className="flex-1 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
          required
        />
        <button className="bg-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-500">
          Add
        </button>
      </form>

      {/* The List */}
      <ul className="space-y-3">
        {tasks.map((task) => (
        <li key={task.id} className="bg-slate-900 p-4 rounded-lg flex justify-between items-center border border-slate-800">
  
          {/* LEFT SIDE: Checkbox + Text */}
          <div className="flex items-center gap-3">
            
            {/* The Toggle Form (Acts like a checkbox) */}
            <form action={toggleTask}>
              <input type="hidden" name="id" value={task.id} />
              <button 
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all
                  ${task.isCompleted 
                    ? "bg-green-500 border-green-500 text-black" 
                    : "border-slate-500 hover:border-green-400"
                  }`}
              >
                {task.isCompleted && "✓"}
              </button>
            </form>

            {/* The Task Title (Strikethrough if done) */}
            <div className="flex flex-col">
              <span className={`font-medium transition-all ${task.isCompleted ? "line-through text-slate-500" : "text-white"}`}>
                {task.title}
              </span>
              <span className="text-xs text-slate-500">
                {task.createdAt.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: Delete Button */}
          <form action={deleteTask}>
            <input type="hidden" name="id" value={task.id} />
            <button className="text-red-400 hover:text-red-300 hover:bg-red-950/30 p-2 rounded-full transition-colors">
              ✖
            </button>
          </form>
        </li>
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-slate-500">No tasks yet. Add one!</p>
        )}
      </ul>
    </div>
  );
}