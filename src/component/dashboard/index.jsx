import { GrafikPenjualan } from "./GrafikPenjualan";
import { GrafikProduk } from "./GrafikProduk";

export const Dashboard = () => {
  return (
    <div className="p-4 mt-14">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-10">
        <GrafikProduk />
        <GrafikPenjualan />
      </div>
    </div>
  );
};
