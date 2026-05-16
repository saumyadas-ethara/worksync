import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import TaskCard from "../../components/tasks/TaskCard";
import CreateTaskForm from "../../components/forms/CreateTaskForm";
import { useAuth } from "../../context/AuthContext";
import { TASK_STATUS } from "../../constants";
import { Plus, ListTodo, Loader2, Filter } from "lucide-react";

const TasksPage = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const query = filterStatus ? `?status=${filterStatus}` : "";
      const { data } = await api.get(`/tasks${query}`);
      setTasks(data.data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus]);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Workspace Header */}
      <div className="bg-white border-b border-border px-6 md:px-8 py-6 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Tasks</h1>
          <p className="text-sm md:text-base text-text-secondary mt-1 font-medium">
            {isAdmin ? "Manage all tasks" : "Your assigned tasks"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 shrink-0"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          )}
        </div>
      </div>

      {/* Fluid Content Workspace */}
      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Toolbar Section */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center shadow-sm w-full sm:w-80">
          <Filter className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-text-primary font-medium cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value={TASK_STATUS.TODO}>To Do</option>
            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUS.DONE}>Done</option>
          </select>
        </div>

        {/* Create Task Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <h2 className="text-xl font-bold text-text-primary mb-6 tracking-tight">Create New Task</h2>
              <CreateTaskForm
                onSuccess={handleTaskCreated}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-200 rounded-3xl shadow-soft">
            <div className="w-20 h-20 rounded-[24px] bg-gray-50 border border-gray-200 flex items-center justify-center mb-6 shadow-sm">
              <ListTodo className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-text-primary font-bold text-xl tracking-tight">No tasks found</p>
            <p className="text-text-secondary text-base mt-2 max-w-md font-medium">
              {filterStatus
                ? "Try changing your filter settings."
                : isAdmin
                ? "Create your first task to start organizing work."
                : "You have no assigned tasks right now."}
            </p>
            {isAdmin && !filterStatus && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200"
              >
                Create Task
              </button>
            )}
          </div>
        )}

        {/* Tasks Grid */}
        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
