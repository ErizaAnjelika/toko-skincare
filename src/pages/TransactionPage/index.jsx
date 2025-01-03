import { Sidebar } from "../../component/sidebar";
import { Transaction } from "../../component/Transaction/Transaction";

export const TransactionPage = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <Transaction />
      </div>
    </div>
  );
};
