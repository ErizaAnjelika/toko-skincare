import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchDataUser } from "../../service/api";
import { AddUser } from "./AddUser";

export const User = () => {
  const [dataUsers, setDataUsers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isTambahModalOpen, setTambahModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataUser();
        setDataUsers(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan pencarian dan kategori
  const filteredData = dataUsers.filter((item) => {
    const matchesSearch = item.nama_kasir
      .toLowerCase()
      .includes(filterText.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { name: "No", selector: (row, index) => index + 1, sortable: true },
    {
      name: "Nama",
      selector: (row) => (row.nama_kasir ? row.nama_kasir : "-"),
      wrap: true,
    },
    {
      name: "Username",
      selector: (row) => (row.username ? row.username : "-"),
      wrap: true,
    },
    {
      name: "Email",
      selector: (row) => (row.email ? row.email : "-"),
      wrap: true,
    },
  ];

  const customStyles = {
    header: {
      style: {
        minHeight: "56px", // Tinggi header
        backgroundColor: "#f4f4f4", // Warna latar belakang header
        color: "#333", // Warna teks header
      },
    },
    headCells: {
      style: {
        fontWeight: "bold", // Teks tebal
        textTransform: "uppercase", // Kapitalisasi teks
      },
    },
    rows: {
      style: {
        minHeight: "48px", // Tinggi baris tabel
        fontSize: "14px", // Ukuran font
      },
    },
    cells: {
      style: {
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflow: "visible",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#f4f4f4", // Warna latar belakang pagination
        borderTop: "1px solid #ddd", // Garis pembatas di atas pagination
      },
    },
  };

  return (
    <div className="p-4 mt-14">
      <h1 className="text-2xl font-semibold">Kategori</h1>
      <div className="container mx-auto mt-6 p-4 bg-white rounded-md shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setTambahModalOpen(true)}
            className="bg-[#2e7d32] text-white py-2 px-4 rounded hover:bg-[#147218] shadow-sm"
          >
            &#43; Tambah
          </button>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <input
              type="search"
              placeholder="Cari user..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="border p-2 rounded-md w-full"
            />
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          customStyles={customStyles}
        />
      </div>
      {/* Tambah Modal */}
      <AddUser
        isOpen={isTambahModalOpen}
        onClose={() => setTambahModalOpen(false)}
        onAdded={async () => setDataUsers(await fetchDataUser())}
      />
    </div>
  );
};
