import { AddTransaction } from "../../component/Transaction/AddTransaction";

export const AddTransactionPage = () => {
  return (
    <div className="h-screen bg-gradient-to-r from-pink-300 to-purple-400">
      <div className="p-4 max-w-7xl mx-auto">
        <AddTransaction />
      </div>
    </div>
  );
};
