import { Sidebar } from "../../component/sidebar";
import { Categories } from "../../component/Categories/Categories";

export const CategoriesPage = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <Categories />
      </div>
    </div>
  );
};
