import { useState } from "react";
import DataTable from "react-data-table-component";

export const Product = () => {
  const data = [
    { id: 1, name: "Produk A", category: "Elektronik", price: 50000 },
    { id: 2, name: "Produk B", category: "Fashion", price: 75000 },
    { id: 3, name: "Produk C", category: "Elektronik", price: 100000 },
    { id: 4, name: "Produk D", category: "Mainan", price: 150000 },
  ];

  const [filterText, setFilterText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter data berdasarkan pencarian dan kategori
  const filteredData = data.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    { name: "No", selector: (row, index) => index + 1, sortable: true },
    { name: "Nama Produk", selector: (row) => row.name, sortable: true },
    { name: "Kategori", selector: (row) => row.category, sortable: true },
    {
      name: "Harga",
      selector: (row) => `Rp${row.price.toLocaleString()}`,
      sortable: true,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="flex gap-4">
          <button
            onClick={() => (window.location.href = `/product/edit/${row.id}`)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Edit
          </button>
          <button className="bg-red-500 text-white py-2 px-4 rounded">
            Hapus
          </button>
        </div>
      ),
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
        paddingLeft: "16px", // Padding kiri header cell
        paddingRight: "16px", // Padding kanan header cell
        fontWeight: "bold", // Teks tebal
        fontSize: "14px", // Ukuran font header cell
        textTransform: "uppercase", // Kapitalisasi teks
      },
    },
    rows: {
      style: {
        minHeight: "48px", // Tinggi baris tabel
      },
    },
    cells: {
      style: {
        paddingLeft: "16px", // Padding kiri cell
        paddingRight: "16px", // Padding kanan cell
      },
    },
    pagination: {
      style: {
        backgroundColor: "#f4f4f4", // Warna latar belakang pagination
        borderTop: "1px solid #ddd", // Garis pembatas di atas pagination
      },
    },
  };

  // Semua kategori unik untuk filter
  const categories = [...new Set(data.map((item) => item.category))];

  return (
    <div className="p-4 mt-14">
      <h1 className="text-2xl font-semibold">Produk</h1>
      <div className="container mx-auto mt-6 p-4 bg-white rounded-md shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => (window.location.href = "/product/add")}
            className="bg-[#2e7d32] text-white py-2 px-4 rounded hover:bg-[#147218] shadow-sm"
          >
            &#43; Tambah
          </button>

          <div className="flex items-center gap-4">
            {/* Filter Kategori */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border p-2 rounded-md"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Search Bar */}
            <input
              type="search"
              placeholder="Cari produk..."
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
          highlightOnHover
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};
