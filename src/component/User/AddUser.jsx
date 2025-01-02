import { useState } from "react";
import Swal from "sweetalert2";
import { addUser } from "../../service/api";

export const AddUser = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    nama_kasir: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Menambahkan role default "kasir"
      const userData = { ...formData, role: "kasir" };

      const response = await addUser(userData);
      if (response) {
        Swal.fire({
          title: "Berhasil!",
          text: "Pengguna berhasil ditambahkan.",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
        });
        setFormData({
          username: "",
          password: "",
          email: "",
          nama_kasir: "",
        });
        onAdded(); // Memperbarui data di komponen utama
        onClose(); // Menutup modal
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat menambahkan pengguna.",
        "error"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Tambah Pengguna</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kasir
            </label>
            <input
              type="text"
              name="nama_kasir"
              value={formData.nama_kasir}
              onChange={handleChange}
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
                    setFormData({
                      username: "",
                      password: "",
                      email: "",
                      nama_kasir: "",
                    });
                    onClose();
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
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
