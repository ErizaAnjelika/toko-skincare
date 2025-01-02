import { useState } from "react";
import { loginApi } from "../service/api";
import Swal from "sweetalert2";

function Login() {
  const [authLogin, setAuthLogin] = useState({
    username: "",
    password: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setAuthLogin({
      ...authLogin,
      [name]: value,
    });
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginApi(authLogin);
    if (response && response.data && response.status === 200) {
      const { data } = response;

      localStorage.setItem(
        "user-info",
        JSON.stringify({
          ...data,
        })
      );
      window.location.href = "/";
      Swal.fire({
        title: "Login success",
        text: "Selamat datang di Toko Skincare",
        icon: "success",
        timer: 3000, // Waktu dalam milidetik
        showConfirmButton: "Ok", // Sembunyikan tombol "OK"
      });
    } else {
      Swal.fire({
        title: "Login Failed",
        text: "Invalid username or password",
        icon: "error",
        timer: 3000, // Waktu dalam milidetik
        showConfirmButton: "Ok", // Sembunyikan tombol "OK"
      });
    }
  };

  const handleKeyDown = (e, nextElement) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
      if (nextElement) {
        nextElement.focus(); // Focus on the next input
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 to-purple-400">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Toko Skincare
        </h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={authLogin.username}
              onChange={handleInput}
              onKeyDown={(e) =>
                handleKeyDown(e, document.getElementById("password"))
              }
              placeholder="Masukkan username"
              className="mt-1 block w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={authLogin.password}
              onChange={handleInput}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  document.querySelector('button[type="submit"]')
                )
              }
              placeholder="Masukkan password"
              className="mt-1 block w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleLogin}
            type="submit"
            className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
