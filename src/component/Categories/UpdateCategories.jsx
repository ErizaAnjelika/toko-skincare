import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { updateDataCategories } from "../../service/api"; // Fungsi untuk memperbarui kategori

export const UpdateCategories = ({ isOpen, onClose, onUpdated, category }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateDataCategories(category.id, { name });
      if (response) {
        Swal.fire({
          title: "Berhasil!",
          text: "Kategori berhasil diperbarui.",
          icon: "success",
          timer: 3000, // Timer dalam milidetik
          timerProgressBar: true,
        });

        onUpdated(); // Memperbarui data di komponen utama
        onClose(); // Menutup modal
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat memperbarui kategori.",
        "error",
        3000
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Edit Kategori</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kategori
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                Swal.fire({
                  title: "Apakah Anda yakin?",
                  text: "Perubahan tidak akan disimpan.",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#d33",
                  cancelButtonColor: "#3085d6",
                  confirmButtonText: "Ya, batalkan!",
                  cancelButtonText: "Kembali",
                }).then((result) => {
                  if (result.isConfirmed) {
                    // Tutup modal atau arahkan ke halaman lain
                    onClose(); // Jika modal menggunakan onClose untuk menutup
                    // window.location.href = "/product"; // Jika langsung diarahkan ke halaman lain
                  }
                });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
