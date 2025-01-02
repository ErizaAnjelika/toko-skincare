export const formatPrice = (price) => {
  const numericPrice = parseFloat(price);
  if (!isNaN(numericPrice)) {
    const formattedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
    return formattedPrice;
  }
  return price;
};

// Fungsi untuk menghitung harga setelah diskon
export const calculateDiscountedPrice = (price, discount) => {
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice) || discount < 0 || discount > 100) {
    return price; // Atau handle error jika diperlukan
  }

  const discountAmount = (numericPrice * discount) / 100;
  const discountedPrice = numericPrice - discountAmount;

  return formatPrice(discountedPrice);
};

// Fungsi untuk memformat tanggal
export const formatDate = (dateString) => {
  // Parsing tanggal dari string
  const date = new Date(dateString);

  // Memeriksa apakah parsing berhasil
  if (isNaN(date.getTime())) {
    return dateString; // Kembalikan string asli jika parsing gagal
  }

  // Format tanggal dengan menggunakan Intl.DateTimeFormat
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formatter.format(date);
};

export const formatText = (text) => {
  // Pastikan text bukan undefined atau null
  if (typeof text !== "string") {
    return ""; // Kembali ke string kosong jika text bukan string
  }

  const noHtml = text.replace(/<\/?[^>]+(>|$)/g, "");
  // Menghapus karakter tidak penting
  const cleanedText = noHtml.replace(/\s+/g, " ").trim();
  return cleanedText;
};

import { useState, useEffect } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
