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
  const [cashAmount, setCashAmount] = useState();

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
        setCashAmount();
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

  const handlePrintInvoice = () => {
    if (!printData) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");

    const invoiceContent = `
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h3 {
              text-align: center;
              margin-bottom: 20px;
            }
            .invoice-header, .invoice-footer {
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f9f9f9;
            }
            .total {
              font-weight: bold;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <h3>Struk Transaksi</h3>
          <div class="invoice-header">
            <p>Toko Skincare</p>
            <p>Jl. Contoh No.123, Kota</p>
          </div>
          <p><strong>Tanggal:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Kasir:</strong> ${userInfo.data.nama_kasir}</p>
          <table>
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Qty</th>
                <th>Harga</th>
              </tr>
            </thead>
            <tbody>
              ${printData.items
                .map(
                  (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>Rp ${item.price.toLocaleString("id-ID")}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
          <p class="total">Total: Rp ${printData.total.toLocaleString(
            "id-ID"
          )}</p>
          
          <div class="invoice-footer">
            <p>Terima kasih telah berbelanja di Toko Skincare!</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  // <p><strong>Nominal Uang:</strong> Rp ${cashAmount.toLocaleString(
  //           "id-ID"
  //         )}</p>
  //         <p><strong>Kembalian:</strong> Rp ${(cashAmount - printData.total > 0
  //           ? cashAmount - printData.total
  //           : 0
  //         ).toLocaleString("id-ID")}</p>

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-6 bg-white rounded-md shadow-md max-w-7xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Tambah Transaksi
        </h2>
        {/* Scanner Barcode */}
        <div id="reader" className="mb-6 text-center"></div>
        {/* Input Manual */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Masukkan Barcode Secara Manual
          </label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleManualInput}
            className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan barcode produk dan tekan Enter..."
          />
        </div>
        {/* Tabel Produk */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
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
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.barcode,
                          parseInt(e.target.value)
                        )
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
        </div>
        <div className="border w-1/3 flex flex-col p-6 space-y-4 mb-6">
          <h1 className="text-md font-bold">Detail Transaksi</h1>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">
              Total: Rp {total.toLocaleString("id-ID")}
            </span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          {paymentMethod === "cash" && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center gap-2">
                <label className="text-md font-bold text-gray-700">
                  Nominal Uang
                </label>
                <input
                  type="number"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(Number(e.target.value))}
                  className="border rounded p-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nominal uang"
                />
              </div>
              <div className="flex items-center justify-between">
                <h1 className=" text-md font-bold text-gray-700">Kembalian</h1>
                <span className="text-md font-bold text-green-600">
                  Rp{" "}
                  {(cashAmount - total > 0
                    ? cashAmount - total
                    : 0
                  ).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          )}
          
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleTransactionSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 shadow-md w-full sm:w-auto"
          >
            Submit Transaksi
          </button>
          {printData && (
            <button
              onClick={handlePrintInvoice}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 shadow-md w-full sm:w-auto"
            >
              Cetak Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
