import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi komponen Chart.js yang diperlukan
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);
export const GrafikProduk = () => {
  const data = {
    labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
    datasets: [
      {
        label: "Produk",
        data: [120, 150, 180, 70, 90],
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Warna batang
        borderColor: "rgba(54, 162, 235, 1)", // Warna tepi batang
        borderWidth: 1, // Lebar tepi batang
      },
    ],
  };

  // Opsi konfigurasi grafik
  const options = {
    indexAxis: "y", // Membuat batang menjadi horizontal
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Posisi legenda di atas
      },
      title: {
        display: true,
        text: "Produk terjual Per Bulan",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Jumlah Produk",
        },
        beginAtZero: true, // Memulai sumbu X dari 0
      },
      y: {
        title: {
          display: true,
          text: "Products",
        },
      },
    },
  };
  return (
    <div className="bg-white p-4 rounded-md drop-shadow-md ">
      <h1 className="font-semibold">Grafik Produk</h1>
      <p className="text-sm">Produk Terlaris</p>
      <div className="h-64 md:h-96 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
