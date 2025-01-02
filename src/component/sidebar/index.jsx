import { useState } from "react";
import { userInfo } from "../../pages/AuthProvider";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

export const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // const closeDropdown = () => {
  //   setIsDropdownOpen(false);
  // };

  const handleLogout = () => {
    console.log("diklik");
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari akun Anda.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user-info");
        window.location.href = "/login";
      }
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 drop-shadow-sm">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>
              <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-8 me-3"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap ">
                  Skincare
                </span>
              </a>
            </div>
            <div className="hidden md:flex w-full max-w-md mx-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-0"
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    className={`flex text-sm bg-gray-800 rounded-full ${
                      isDropdownOpen ? "focus:ring-2 focus:ring-gray-800" : ""
                    }`}
                    aria-expanded={isDropdownOpen}
                    onClick={toggleDropdown}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-10 h-10 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user photo"
                    />
                  </button>
                </div>
                {isDropdownOpen && (
                  <div
                    className="z-50 absolute right-2 top-10 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow"
                    id="dropdown-user"
                  >
                    <div className="px-4 py-3" role="none">
                      <p className="text-sm text-gray-900" role="none">
                        {userInfo.data.nama_kasir}
                      </p>
                      <p
                        className="text-sm font-medium text-gray-900 truncate"
                        role="none"
                      >
                        {userInfo.data.email}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      <li>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={toggleSidebar} // Menutup sidebar saat overlay diklik
            style={{ left: "16rem" }}
          ></div>
        )}
        <aside
          id="logo-sidebar"
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 drop-shadow-sm ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
            <ul className="space-y-2 font-medium">
              <li>
                <a
                  href="/"
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-200 group ${
                    isActive("/")
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 ${
                      isActive("/")
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-700"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  <span className="ms-3">Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="/product"
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-200 group ${
                    isActive("/product")
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 ${
                      isActive("/product")
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-700"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="ms-3">Produk</span>
                </a>
              </li>
              <li>
                <a
                  href="/categories"
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-200 group ${
                    isActive("/categories")
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 ${
                      isActive("/categories")
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-700"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10.83 5a3.001 3.001 0 0 0-5.66 0H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17ZM4 11h9.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2Zm1.17 6H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17a3.001 3.001 0 0 0-5.66 0Z" />
                  </svg>

                  <span className="ms-3">Kategori</span>
                </a>
              </li>
              <li>
                <a
                  href="/transaction"
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-200 group ${
                    isActive("/transaction")
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 ${
                      isActive("/transaction")
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-700"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M4 19v2c0 .5523.44772 1 1 1h14c.5523 0 1-.4477 1-1v-2H4Z"
                    />
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M9 3c0-.55228.44772-1 1-1h8c.5523 0 1 .44772 1 1v3c0 .55228-.4477 1-1 1h-2v1h2c.5096 0 .9376.38314.9939.88957L19.8951 17H4.10498l.90116-8.11043C5.06241 8.38314 5.49047 8 6.00002 8H12V7h-2c-.55228 0-1-.44772-1-1V3Zm1.01 8H8.00002v2.01H10.01V11Zm.99 0h2.01v2.01H11V11Zm5.01 0H14v2.01h2.01V11Zm-8.00998 3H10.01v2.01H8.00002V14ZM13.01 14H11v2.01h2.01V14Zm.99 0h2.01v2.01H14V14ZM11 4h6v1h-6V4Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="ms-3">Transaksi</span>
                </a>
              </li>
              <li>
                <a
                  href="/user"
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-200 group ${
                    isActive("/user")
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 ${
                      isActive("/user")
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-700"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="ms-3">User</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
