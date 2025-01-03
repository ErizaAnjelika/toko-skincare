import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { deleteCategories, fetchDataCategories } from "../../service/api";
import Swal from "sweetalert2";
import { AddCategories } from "./AddCategories";
import { UpdateCategories } from "./UpdateCategories";

export const Categories = () => {
  const [dataCategories, setDataCategories] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isTambahModalOpen, setTambahModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fungsi untuk membuka modal edit
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataCategories();
        setDataCategories(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan pencarian dan kategori
  const filteredData = dataCategories?.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(filterText.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (id) => {
    try {
      // Tampilkan dialog konfirmasi
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data produk ini akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      // Jika pengguna menekan tombol "Ya, hapus!"
      if (result.isConfirmed) {
        // Panggil API deleteProduct
        const response = await deleteCategories(id);

        // Jika berhasil, tampilkan pesan sukses
        if (response) {
          Swal.fire({
            title: "Berhasil!",
            text: "Kategori telah dihapus.",
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
          });
          // Lakukan pembaruan data, misalnya panggil kembali data produk
          setDataCategories(await fetchDataCategories());
        } else {
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus produk.",
            "error"
          );
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal!", "Terjadi kesalahan pada sistem.", "error");
    }
  };

  const columns = [
    { name: "No", selector: (row, index) => index + 1, sortable: true },
    {
      name: "Kategori",
      selector: (row) => (row.name ? row.name : "-"),
      wrap: true,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="bg-blue-500 text-white p-1 rounded"
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-500 text-white p-1 rounded"
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                clipRule="evenodd"
              />
            </svg>
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
              placeholder="Cari kategori..."
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
      <AddCategories
        isOpen={isTambahModalOpen}
        onClose={() => setTambahModalOpen(false)}
        onAdded={async () => setDataCategories(await fetchDataCategories())}
      />

      {/* Edit Modal */}
      <UpdateCategories
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdated={async () => setDataCategories(await fetchDataCategories())}
        category={selectedCategory}
      />
    </div>
  );
};
