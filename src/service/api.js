import axios from "axios";
import { userInfo } from "../pages/AuthProvider";

const BASE_URL = "http://localhost:8080/api/v1";

export const loginApi = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      username: data.username, // Kirimkan email secara eksplisit
      password: data.password, // Kirimkan password secara eksplisit
    });
    return response; // Kembalikan data user jika login berhasil
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// get chart penjualan
export const fetchChart = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.get(`${BASE_URL}/chart/sales-by-date`, {
      headers,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// get chart penjualan
export const fetchChartProduct = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.get(`${BASE_URL}/chart/top-selling-products`, {
      headers,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// get product
export const fetchDataProducts = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.get(`${BASE_URL}/products`, {
      headers,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// add product
export const addProduct = async (data) => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.post(`${BASE_URL}/products`, data, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// get product by id
export const fetchDataProductByID = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.get(`${BASE_URL}/products/${id}`, {
      headers,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// update product
export const updateDataProduct = async (id, data) => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.put(`${BASE_URL}/products/${id}`, data, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// delete product
export const deleteProduct = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.delete(`${BASE_URL}/products/${id}`, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// get kategori
export const fetchDataCategories = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.get(`${BASE_URL}/product-categories`, {
      headers,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateDataCategories = async (id, data) => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.put(
      `${BASE_URL}/product-categories/${id}`,
      data,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// add categories
export const addCategories = async (data) => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.post(`${BASE_URL}/product-categories`, data, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// delete kategori
export const deleteCategories = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.delete(
      `${BASE_URL}/product-categories/${id}`,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// get user
export const fetchDataUser = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.get(`${BASE_URL}/users`, {
      headers,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// add user
export const addUser = async (data) => {
  try {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    const response = await axios.post(`${BASE_URL}/register`, data, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
