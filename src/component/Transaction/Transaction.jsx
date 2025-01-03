import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchDataTransaction } from "../../service/api";
import { formatDate, formatPrice } from "../../service/function";

export const Transaction = () => {
  const [dataTransaction, setDataTransaction] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataTransaction();
        setDataTransaction(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
    setOpenDetail(false);
  };

  // Filter data berdasarkan pencarian dan kategori
  const filteredData = dataTransaction?.filter((item) => {
    const matchesSearch = item.transaction_date
      .toLowerCase()
      .includes(filterText.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    { name: "No", selector: (row, index) => index + 1, sortable: true },
    {
      name: "Tgl Transaksi",
      selector: (row) =>
        row.transaction_date ? formatDate(row.transaction_date) : "-",
      wrap: true,
    },
    {
      name: "Kasir",
      selector: (row) => (row.user.nama_kasir ? row.user.nama_kasir : "-"),
      wrap: true,
    },
    {
      name: "Total Transaksi",
      selector: (row) => (row.amount ? formatPrice(row.amount) : "-"),
      wrap: true,
    },
    {
      name: "Metode Pembayaran",
      selector: (row) => (row.metode_pembayaran ? row.metode_pembayaran : "-"),
      wrap: true,
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
    ...new Set(dataTransaction?.map((item) => item.metode_pembayaran)),
  ];

  return (
    <div className="p-4 mt-14">
      <h1 className="text-2xl font-semibold">Kategori</h1>
      <div className="container mx-auto mt-6 p-4 bg-white rounded-md shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() =>
              (window.location.href = "/transaction/add-transaction")
            }
            className="bg-[#2e7d32] text-white py-2 px-4 rounded hover:bg-[#147218] shadow-sm"
          >
            &#43; Tambah
          </button>

          <div className="flex items-center gap-4">
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

      {/* Modal Detail */}
      {openDetail && selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Detail Produk</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 text-center">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="px-4 py-2 border border-gray-300">
                      Nama Produk
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Qty</th>
                    <th className="px-4 py-2 border border-gray-300">Harga</th>
                    <th className="px-4 py-2 border border-gray-300">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.items.map((item) => (
                    <tr key={item.id} className="text-gray-700">
                      <td className="px-4 py-2 border border-gray-300">
                        {item.product.name}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        Rp {item.price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        Rp {item.amount.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleCloseDetail}
              className="bg-gray-500 text-white py-2 px-4 rounded mt-4"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
