import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { deleteProduct, fetchDataProducts } from "../../service/api";
import { formatDate, formatPrice } from "../../service/function";
import Barcode from "react-barcode";
import JsBarcode from "jsbarcode";
import Swal from "sweetalert2";

export const Product = () => {
  const [dataProduct, setDataProducts] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataProducts();
        setDataProducts(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan pencarian dan kategori
  const filteredData = dataProduct?.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || item.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBarcodeClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handlePrintBarcode = () => {
    // Buat elemen div sementara
    const barcodeDiv = document.createElement("div");

    // Buat 18 barcode menggunakan JsBarcode
    Array.from({ length: 15 }).forEach(() => {
      // Buat elemen SVG untuk barcode
      const svg = document.createElement("svg");
      JsBarcode(svg, selectedProduct.barcode || "0000000000", {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: false, // Tidak menampilkan kode di dalam barcode
      });

      // Buat elemen div untuk setiap item barcode
      const barcodeItem = document.createElement("div");
      barcodeItem.style.textAlign = "center"; // Center-align setiap item barcode

      // Tambahkan SVG barcode ke dalam div
      barcodeItem.appendChild(svg);

      // Tambahkan teks kode di bawah barcode
      const codeText = document.createElement("p");
      codeText.textContent = selectedProduct.barcode || "0000000000";
      codeText.style.marginTop = "5px"; // Beri sedikit jarak antara barcode dan teks
      codeText.style.fontSize = "12px"; // Ukuran font untuk teks
      barcodeItem.appendChild(codeText);

      // Tambahkan div barcodeItem ke div utama
      barcodeDiv.appendChild(barcodeItem);
    });

    // Ambil HTML dari barcode yang dihasilkan
    const barcodeHTML = barcodeDiv.innerHTML;

    // Buat konten cetak
    const printContent = `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h1>Barcode Produk: ${selectedProduct.name}</h1>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
          ${barcodeHTML} 

        </div>
      </div>
    `;

    // Buat window baru untuk mencetak
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print Barcode</title>");
    printWindow.document.write(
      "<style>@media print { body { margin: 0; } }</style>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
    setOpenDetail(false);
  };

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
        const response = await deleteProduct(id);

        // Jika berhasil, tampilkan pesan sukses
        if (response) {
          Swal.fire("Berhasil!", "Produk telah dihapus.", "success", 3000);
          // Lakukan pembaruan data, misalnya panggil kembali data produk
          setDataProducts(await fetchDataProducts());
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
      name: "Nama Produk",
      selector: (row) => (row.name ? row.name : "-"),
      wrap: true,
    },
    {
      name: "Kategori",
      selector: (row) => (row.category.name ? row.category.name : "-"),
      wrap: true,
    },
    {
      name: "Tgl Expired",
      selector: (row) =>
        row.tanggal_kadaluarsa ? formatDate(row.tanggal_kadaluarsa) : "-",
      sortable: true,
    },
    {
      name: "Harga Jual",
      selector: (row) => (row.harga_jual ? formatPrice(row.harga_jual) : "-"),
      sortable: true,
      wrap: true,
    },
    {
      name: "QYT",
      selector: (row) => (row.quantity ? row.quantity + " pcs" : "-"),
      sortable: true,
    },
    {
      name: "Barcode",
      selector: (row) => (row.barcode ? row.barcode : "-"),
      sortable: true,
      cell: (row) => (
        <button
          onClick={() => handleBarcodeClick(row)}
          className="capitalize underline hover:text-blue-500 text-md"
        >
          lihat barcode
        </button>
      ),
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenDetail(row)}
            className="bg-yellow-500 text-white p-1 rounded"
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
                d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => (window.location.href = `/product/update/${row.id}`)}
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

  const categories = [
    ...new Set(dataProduct?.map((item) => item.category?.name)),
  ];

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
          customStyles={customStyles}
        />
      </div>
      {/* Modal Barcode */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Barcode Produk</h2>
            <div>
              <p className="text-sm mb-4">
                <strong>Nama Produk:</strong> {selectedProduct.name}
              </p>
              <div className="mb-4">
                <strong>Barcode:</strong>
                {/* Menampilkan barcode dari nilai produk */}
                <Barcode value={selectedProduct.barcode || "0000000000"} />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handlePrintBarcode}
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  Cetak Barcode
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {openDetail && selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h1 className="font-bold">Nama Produk</h1>
                <p>{selectedProduct.name}</p>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-bold">Kategori</h1>
                <p>
                  {selectedProduct.category.name
                    ? selectedProduct.category.name
                    : "-"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-bold">Tanggal Masuk</h1>
                <p>{formatDate(selectedProduct.tanggal_masuk)}</p>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-bold">Tanggal Kadaluarsa</h1>
                <p>{formatDate(selectedProduct.tanggal_kadaluarsa)}</p>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-bold">Harga Beli</h1>
                <p>{formatPrice(selectedProduct.harga_beli)}</p>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-bold">Harga Jual</h1>
                <p>{formatPrice(selectedProduct.harga_jual)}</p>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-bold">Margin Keuntungan</h1>
                <p>{selectedProduct.margin_keuntungan} %</p>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-bold">Quantity</h1>
                <p>{selectedProduct.quantity} pcs</p>
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold">Barcode</h1>
                <Barcode value={selectedProduct.barcode || "0000000000"} />
              </div>

              <button
                onClick={handleCloseDetail}
                className="bg-gray-500 text-white py-2 px-4 rounded mt-4"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
