import { useEffect, useState } from "react";
import { getAuthToken, request, setAuthHeader } from "./axios_helper";
import { useNavigate } from "react-router-dom";

export default function Users({ isLoggedIn, setIsLoggedIn, currentUser }) {
  const [users, setUsers] = useState([]);
  const [usersWithSearch, setUsersWithSearch] = useState(users);
  const [isDeleted, setIsDeleted] = useState(false);
  const navigation = useNavigate();

  console.log(currentUser());

  const checkUserStatus = () => {
    if (getAuthToken() !== "null") {
      console.log(getAuthToken());
      if (isLoggedIn()) {
        request("GET", "/api/user/all")
          .then((response) => response.data)
          .then((data) => {
            setUsers(data);
            setUsersWithSearch(data);
          })
          .catch((error) => {
            console.log(error);
            setAuthHeader(null);
          });
      } else {
        setIsLoggedIn(true);
      }
    } else {
      if (isLoggedIn()) {
        setIsLoggedIn(false);
      } else {
        navigation("/login", { replace: true });
      }
    }
  };

  const disableDeleteAdmin = () => {
    const admins = document.querySelectorAll(".btnDelete");
    admins.forEach((admin) => {
      if (admin.dataset.role === "admin") {
        admin.setAttribute("disabled", true);
      }
      if (
        admin.dataset.role === "admin" &&
        admin.classList.contains("hover:bg-red-200")
      ) {
        admin.classList.remove("hover:bg-red-200");
      } else if (admin.dataset.role === "admin" && admin.classList.contains("hover:bg-gray-100") ) {
        admin.classList.remove("hover:bg-gray-100");
      }

    });
  };

  useEffect(() => {
    checkUserStatus();
  }, [isLoggedIn(), isDeleted]);

  const handleDelete = (e) => {
    disableDeleteAdmin();
    if (e.target.dataset.role !== "admin") {
      if (
        window.confirm(
          `Are you sure you want to delete User: ${e.target.dataset.username}`
        )
      ) {
        request("DELETE", `/api/user/delete/${e.target.dataset.id}`)
          .then((response) => response.data)
          .then((data) => {
            alert(data);
            setIsDeleted(!isDeleted);
          })
          .catch((error) => console.log(error));
      }
    } else {
      e.preventDefault();
    }
  };

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setUsersWithSearch(users);
    } else {
      setUsersWithSearch(
        users.filter((user) =>
          user.username.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const handleEdit = (e) => {
    disableDeleteAdmin();
    if (e.target.dataset.role !== "admin") {
      const formAction = document.querySelector("#formAction");
      formAction.setAttribute("action", `/user/${e.target.dataset.id}`);
      formAction.submit();
    }
  };

  return (
    <div>
      <section className="container px-12 mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="relative flex items-center mt-4 w-full">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Search"
              onChange={handleSearch}
              className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg  placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <div className="overflow-x-auto sm:mx-2 lg:mx-4">
            <div className="inline-block min-w-full pb-4 align-middle">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="text-center min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="text-center py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Username
                      </th>

                      <th
                        scope="col"
                        className="text-center px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Password
                      </th>

                      <th
                        scope="col"
                        className="text-center px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Role
                      </th>

                      <th
                        scope="col"
                        className="text-center px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {usersWithSearch.map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                          <div>
                            <h2 className="text-center font-medium text-gray-800 dark:text-white ">
                              {user.username}
                            </h2>
                          </div>
                        </td>

                        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="text-center px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            {user.password}
                          </div>
                        </td>

                        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="text-center inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                            {user.role}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          {currentUser().role === "admin" ? (
                            <div>
                              <button
                                data-id={user.id}
                                data-username={user.username}
                                data-role={user.role}
                                onClick={handleEdit}
                                className="btnDelete mr-2 px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button
                                data-id={user.id}
                                data-username={user.username}
                                data-role={user.role}
                                onClick={handleDelete}
                                className="btnDelete px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <form id="formAction"></form>
    </div>
  );
}
