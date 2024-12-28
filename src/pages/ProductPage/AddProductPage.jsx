import { Sidebar } from "../../component/sidebar";
import { AddProduct } from "../../component/Product/AddProduct";

export const AddProductPage = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <AddProduct />
      </div>
    </div>
  );
};
