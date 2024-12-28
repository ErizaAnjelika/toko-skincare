import { Sidebar } from "../../component/sidebar";
import { Product } from "../../component/Product/Product";

export const ProductPage = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <Product />
      </div>
    </div>
  );
};
