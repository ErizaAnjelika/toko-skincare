import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { addTransaction, fetchDataProductByBarcode } from "../../service/api";
import { userInfo } from "../../pages/AuthProvider";
import { Html5QrcodeScanner } from "html5-qrcode";

export const AddTransaction = () => {
  const [items, setItems] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [total, setTotal] = useState(0);
  const [printData, setPrintData] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (scannedBarcode) => handleBarcodeScan(scannedBarcode),
      (error) => console.error("Scanning error:", error)
    );

    return () => scanner.clear();
  }, []);

  const handleBarcodeScan = async (barcode) => {
    try {
      const response = await fetchDataProductByBarcode(barcode);
      if (response) {
        const product = await response;

        setItems((prevItems) => {
          const existingItem = prevItems.find(
            (item) => item.barcode === barcode
          );
          if (existingItem) {
            return prevItems.map((item) =>
              item.barcode === barcode
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    total: (item.quantity + 1) * product.harga_jual,
                  }
                : item
            );
          }
          return [
            ...prevItems,
            {
              barcode,
              name: product.name,
              price: product.harga_jual,
              quantity: 1,
              total: product.harga_jual,
            },
          ];
        });

        setTotal((prevTotal) => prevTotal + product.harga_jual);
      } else {
        Swal.fire("Error", "Produk tidak ditemukan!", "error");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      Swal.fire("Error", "Terjadi kesalahan saat mencari produk.", "error");
    }
  };

  const handleManualInput = (e) => {
    if (e.key === "Enter" && barcode.trim() !== "") {
      handleBarcodeScan(barcode);
      setBarcode("");
    }
  };

  const handleQuantityChange = (barcode, newQuantity) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.barcode === barcode
          ? {
              ...item,
              quantity: newQuantity,
              total: newQuantity * item.price,
            }
          : item
      )
    );
    setTotal(
      items.reduce(
        (sum, item) =>
          item.barcode === barcode
            ? sum + newQuantity * item.price
            : sum + item.total,
        0
      )
    );
  };

  const handleCancelItem = (barcode) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.barcode !== barcode)
    );
    setTotal((prevTotal) => {
      const canceledItem = items.find((item) => item.barcode === barcode);
      return prevTotal - (canceledItem?.total || 0);
    });
  };

  const handleTransactionSubmit = async () => {
    if (items.length === 0) {
      Swal.fire("Error", "Tidak ada item dalam transaksi!", "error");
      return;
    }

    const payload = {
      user_id: userInfo.data.id,
      metode_pembayaran: paymentMethod,
      items: items.map(({ barcode, quantity }) => ({ barcode, quantity })),
    };

    try {
      const response = await addTransaction(payload);
      if (response) {
        Swal.fire("Berhasil!", "Transaksi berhasil ditambahkan.", "success");
        setPrintData({ items, total, paymentMethod });
        setItems([]);
        setTotal(0);
        setPaymentMethod("cash");
      } else {
        Swal.fire(
          "Error",
          "Terjadi kesalahan saat menambahkan transaksi.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      Swal.fire(
        "Error",
        "Terjadi kesalahan saat menambahkan transaksi.",
        "error"
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-md">
      <h2 className="text-2xl font-bold mb-4">Tambah Transaksi</h2>

      {/* Scanner Barcode */}
      <div id="reader" className="mb-4 text-center"></div>

      {/* Input Manual */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Masukkan Barcode Secara Manual
        </label>
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={handleManualInput}
          className="border rounded w-full p-2"
          placeholder="Masukkan barcode produk dan tekan Enter..."
        />
      </div>

      {/* Tabel Produk */}
      <table className="min-w-full bg-white border border-gray-300 mb-4">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 border">Nama Produk</th>
            <th className="px-4 py-2 border">Harga</th>
            <th className="px-4 py-2 border">Qty</th>
            <th className="px-4 py-2 border">Total</th>
            <th className="px-4 py-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.barcode}>
              <td className="px-4 py-2 border">{item.name}</td>
              <td className="px-4 py-2 border">
                Rp {item.price.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.barcode, parseInt(e.target.value))
                  }
                  className="border rounded w-16 text-center"
                  min={1}
                />
              </td>
              <td className="px-4 py-2 border">
                Rp {item.total.toLocaleString("id-ID")}
              </td>
              <td className="px-4 py-2 border text-center">
                <button
                  onClick={() => handleCancelItem(item.barcode)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total dan Submit */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold">
          Total: Rp {total.toLocaleString("id-ID")}
        </span>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="cash">Cash</option>
          <option value="debit">Debit</option>
        </select>
      </div>

      <button
        onClick={handleTransactionSubmit}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Submit Transaksi
      </button>

      {/* Print Bill */}
      {printData && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold mb-2 text-center">
            Struk Transaksi
          </h3>
          <p className="text-sm text-center">Toko Skincare</p>
          <p className="text-sm text-center">Jl. Contoh No.123, Kota</p>
          <hr className="my-2" />
          <p className="text-sm">
            <strong>Tanggal:</strong> {new Date().toLocaleString()}
          </p>
          <p className="text-sm">
            <strong>Kasir:</strong> {userInfo.data.nama_kasir}
          </p>
          <hr className="my-2" />
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left border-b pb-2">Nama Produk</th>
                <th className="text-left border-b pb-2">Qty</th>
                <th className="text-right border-b pb-2">Harga</th>
              </tr>
            </thead>
            <tbody>
              {printData.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-1">{item.name}</td>
                  <td className="py-1">{item.quantity}</td>
                  <td className="py-1 text-right">
                    Rp {item.price.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="my-2" />
          <p className="text-right text-sm font-bold">
            Total: Rp {printData.total.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-center mt-2">
            Terima kasih telah berbelanja di Toko Skincare!
          </p>
        </div>
      )}
    </div>
  );
};
