import Swal from "sweetalert2";
import {
  fetchDataCategories,
  fetchDataProductByID,
  updateDataProduct,
} from "../../service/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const UpdateProduct = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    harga_beli: "",
    quantity: "",
    tanggal_masuk: "",
    tanggal_kadaluarsa: "",
    margin_keuntungan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch product details by ID
        const productData = await fetchDataProductByID(id);
        setFormData({
          name: productData.name,
          category_id: productData.category_id,
          harga_beli: productData.harga_beli,
          quantity: productData.quantity,
          tanggal_masuk: productData.tanggal_masuk,
          tanggal_kadaluarsa: productData.tanggal_kadaluarsa,
          margin_keuntungan: productData.margin_keuntungan,
        });

        // Fetch categories
        const response = await fetchDataCategories();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await updateDataProduct(id, {
        ...formData,
        category_id: parseInt(formData.category_id, 10),
        harga_beli: parseFloat(formData.harga_beli),
        quantity: parseInt(formData.quantity, 10),
        margin_keuntungan: parseFloat(formData.margin_keuntungan),
      });
      if (response) {
        Swal.fire("Berhasil!", "Produk berhasil diperbarui!", "success");
        window.location.href = "/product";
      } else {
        Swal.fire(
          "Gagal!",
          "Terjadi kesalahan saat memperbarui produk.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
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
          name: "",
          category_id: "",
          harga_beli: "",
          quantity: "",
          tanggal_masuk: "",
          tanggal_kadaluarsa: "",
          margin_keuntungan: "",
        });
        window.location.href = "/product";
      }
    });
  };
  return (
    <div className="p-4 mt-14">
      <h1 className="text-2xl font-semibold mb-4">Update Produk</h1>
      <div className="container mx-auto mt-6 p-4 bg-white rounded-md shadow-md">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Produk
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Harga Beli</label>
            <input
              type="number"
              name="harga_beli"
              value={formData.harga_beli}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal Masuk
            </label>
            <input
              type="date"
              name="tanggal_masuk"
              value={formData.tanggal_masuk}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal Kadaluarsa
            </label>
            <input
              type="date"
              name="tanggal_kadaluarsa"
              value={formData.tanggal_kadaluarsa}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Margin Keuntungan (%)
            </label>
            <input
              type="number"
              name="margin_keuntungan"
              value={formData.margin_keuntungan}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="flex gap-2 pt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
            <button
              className=" bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              type="button"
              onClick={handleCancel}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
