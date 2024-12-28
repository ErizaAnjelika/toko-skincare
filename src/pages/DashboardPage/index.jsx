import { Sidebar } from "../../component/sidebar";
import { Dashboard } from "../../component/dashboard";

export const DashboardPage = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <Dashboard />
      </div>
    </div>
  );
};
