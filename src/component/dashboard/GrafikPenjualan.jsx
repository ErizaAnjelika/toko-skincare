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
import { useEffect, useState } from "react";
import { fetchChart } from "../../service/api";
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
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchChart();
        if (data && data.length > 0) {
          // Proses data menjadi format { labels: [...], values: [...] }
          const labels = data.map((item) =>
            new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(item.tanggal))
          );

          const values = data.map((item) => item.total_penjualan);

          setChartData({ labels, values });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  // Data untuk grafik
  const data = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: "Penjualan",
        data: chartData?.values || [],
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
          text: "Tanggal",
        },
      },
      y: {
        title: {
          display: true,
          text: "Jumlah Penjualan",
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
