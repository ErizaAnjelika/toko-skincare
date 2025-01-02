import { Sidebar } from "../../component/sidebar";
import { User } from "../../component/User/User";

export const UserPage = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <User />
      </div>
    </div>
  );
};
