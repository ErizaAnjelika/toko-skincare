import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);
export const GrafikPenjualan = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Penjualan",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Menambahkan kelengkungan pada garis
      },
    ],
  };

  // Opsi konfigurasi grafik
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Penjualan Per hari",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hari",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
        beginAtZero: true, // Memulai sumbu Y dari 0
      },
    },
  };
  return (
    <div className="bg-white p-4 rounded-md drop-shadow-md">
      <h1 className="font-semibold">Grafik Penjualan</h1>
      <p className="text-sm">Penjualan Terlaris</p>
      <div className="h-64 md:h-96 w-full">
        <Line data={data} options={options} />{" "}
      </div>
    </div>
  );
};
