import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import MemberManager from "../../components/projects/MemberManager";
import TaskCard from "../../components/tasks/TaskCard";
import CreateTaskForm from "../../components/forms/CreateTaskForm";
import { useAuth } from "../../context/AuthContext";
import { Loader2, Plus } from "lucide-react";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [project, setProject] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members");
  const [showTaskForm, setShowTaskForm] = useState(false);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`)
      ]);
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Project not found");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    if (!isAdmin) return;
    try {
      const { data } = await api.get("/projects/users");
      setAllUsers(data.data);
    } catch {
      // silently fail — member picker just won't show
    }
  };

  useEffect(() => {
    fetchProjectAndTasks();
    fetchAllUsers();
  }, [id]);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setShowTaskForm(false);
  };

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!project) return null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Workspace Header */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-6 shrink-0 flex flex-col gap-4 z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary font-medium">
          <Link to="/projects" className="hover:text-primary transition-colors">
            Projects
          </Link>
          <span>/</span>
          <span className="text-text-primary">{project.title}</span>
        </nav>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">{project.title}</h1>
          <p className="text-sm md:text-base text-text-secondary mt-2 leading-relaxed max-w-4xl">
            {project.description || "No description provided."}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 text-xs font-semibold text-text-secondary">
            <span>
              Created by{" "}
              <span className="text-text-primary">
                {project.createdBy?.name} <span className="text-text-secondary/70 font-medium">({project.createdBy?.email})</span>
              </span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>{formatDate(project.createdAt)}</span>
            <span className="hidden sm:inline">•</span>
            <span>
              <span className="text-text-primary">
                {project.members.length}
              </span>{" "}
              member{project.members.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Fluid Content Workspace */}
      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-[1200px] mx-auto w-full">
        {/* Tabs / Sub-Nav */}
        <div className="flex gap-8 border-b border-gray-200 w-full mb-2">
          {["members", "tasks"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize transition-all duration-200 border-b-2 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-soft">
            <h2 className="text-lg font-bold text-text-primary mb-6 tracking-tight">
              Project Members
            </h2>
            <MemberManager
              project={project}
              allUsers={isAdmin ? allUsers : []}
              onUpdate={handleProjectUpdate}
            />
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-lg font-bold text-text-primary tracking-tight">Project Tasks</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </button>
              )}
            </div>

            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="text-text-primary font-semibold text-base">No tasks found in this project.</p>
                {isAdmin && (
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="mt-3 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    Create the first task &rarr;
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Task Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <h2 className="text-xl font-bold text-text-primary mb-6 tracking-tight">Create New Task</h2>
              <CreateTaskForm
                prefilledProject={project._id}
                prefilledProjectTitle={project.title}
                onSuccess={handleTaskCreated}
                onCancel={() => setShowTaskForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
