import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import ProjectCard from "../../components/projects/ProjectCard";
import CreateProjectForm from "../../components/forms/CreateProjectForm";
import { useAuth } from "../../context/AuthContext";
import { Plus, FolderClosed, Loader2, Search } from "lucide-react";

const ProjectsPage = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/projects");
      setProjects(data.data);
    } catch {
      toast.error("Failed to load projects");
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
      // silently fail
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchAllUsers();
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setShowForm(false);
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [projects, searchQuery]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Workspace Header */}
      <div className="bg-white border-b border-border px-6 md:px-8 py-6 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Projects</h1>
          <p className="text-sm md:text-base text-text-secondary mt-1 font-medium">
            {isAdmin ? "Manage all projects" : "Your assigned projects"}
          </p>
        </div>
        {isAdmin && (
          <button
            id="new-project-btn"
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 shrink-0"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        )}
      </div>

      {/* Fluid Content Workspace */}
      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Toolbar Section */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center shadow-sm w-full sm:w-80">
          <Search className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-text-primary placeholder-gray-400"
          />
        </div>

        {/* Create Project Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <h2 className="text-xl font-bold text-text-primary mb-6 tracking-tight">Create New Project</h2>
              <CreateProjectForm
                onSuccess={handleProjectCreated}
                onCancel={() => setShowForm(false)}
                allUsers={allUsers}
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
        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-200 rounded-3xl shadow-soft">
            <div className="w-20 h-20 rounded-[24px] bg-gray-50 border border-gray-200 flex items-center justify-center mb-6 shadow-sm">
              <FolderClosed className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-text-primary font-bold text-xl tracking-tight">No projects yet</p>
            <p className="text-text-secondary text-base mt-2 max-w-md font-medium">
              {isAdmin ? "Create your first project to start organizing tasks." : "You haven't been assigned to any projects yet."}
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200"
              >
                Create Project
              </button>
            )}
          </div>
        )}
        
        {/* Search Empty State */}
        {!loading && projects.length > 0 && filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-text-primary font-semibold text-lg tracking-tight">No matching projects</p>
            <p className="text-text-secondary text-sm mt-1.5">Try adjusting your search query.</p>
          </div>
        )}

        {/* Project Grid */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
