import { Sidebar } from "../../component/sidebar";
import { UpdateProduct } from "../../component/Product/UpdateProduct";

export const UpdateProductPage = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <UpdateProduct />
      </div>
    </div>
  );
};
