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
import { useEffect, useState } from "react";
import { fetchChartProduct } from "../../service/api";

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
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchChartProduct();
        if (data && data.length > 0) {
          const labels = data.map((item) => item.nama_produk);

          const values = data.map((item) => item.jumlah_terjual);

          setChartData({ labels, values });
        }
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);
  const data = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: "Produk",
        data: chartData?.values || [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
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
