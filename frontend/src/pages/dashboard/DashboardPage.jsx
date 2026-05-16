import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/dashboard/StatCard";
import RecentTasksList from "../../components/dashboard/RecentTasksList";
import OverdueAlert from "../../components/dashboard/OverdueAlert";
import { Loader2, FolderKanban, ClipboardList, CheckCircle2, Clock3, AlertCircle } from "lucide-react";

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(res.data.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Failed to load dashboard. Please try refreshing.</p>
      </div>
    );
  }

  const { stats, recentTasks, overdueTasksList } = data;

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Workspace Header */}
      <div className="bg-white border-b border-border px-6 md:px-8 py-6 shrink-0 flex items-center justify-between shadow-sm z-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Welcome back, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-sm md:text-base text-text-secondary mt-1 font-medium">
            {isAdmin ? "Here's an overview of your team's work." : "Here's a summary of your assigned tasks."}
          </p>
        </div>
      </div>

      {/* Fluid Content Workspace */}
      <div className="flex-1 p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {isAdmin && (
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              icon={<FolderKanban className="w-5 h-5" />}
              colorClass="text-primary"
              bgClass="bg-primary/10"
            />
          )}
          <StatCard
            title={isAdmin ? "Total Tasks" : "Assigned Tasks"}
            value={stats.totalTasks}
            icon={<ClipboardList className="w-5 h-5" />}
            colorClass="text-blue-600"
            bgClass="bg-blue-50"
          />
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            icon={<CheckCircle2 className="w-5 h-5" />}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
          />
          <StatCard
            title="Pending"
            value={stats.pendingTasks}
            icon={<Clock3 className="w-5 h-5" />}
            colorClass="text-amber-600"
            bgClass="bg-amber-50"
          />
          <StatCard
            title="Overdue"
            value={stats.overdueTasks}
            icon={<AlertCircle className="w-5 h-5" />}
            colorClass="text-red-600"
            bgClass="bg-red-50"
          />
        </div>

        {/* Middle: Recent Tasks */}
        <div className="w-full">
          <RecentTasksList tasks={recentTasks} />
        </div>

        {/* Bottom: Overdue Alert */}
        <div className="w-full">
          <OverdueAlert tasks={overdueTasksList} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
