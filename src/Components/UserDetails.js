import { useEffect, useState } from "react";
import { getAuthToken, request } from "./axios_helper";
import { useNavigate, useParams } from "react-router-dom";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function UserDetails({ currentUser }) {
  const navigation = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    ten: "",
    email: "",
    username: "",
    password: "",
    role: "",
  });
  const [formAction, setFormAction] = useState(user);

  useEffect(() => {
    if (currentUser().username === "" && getAuthToken() === "null") {
      navigation("/login", { replace: true });
    }
    if (id !== "0") {
      request("GET", `/api/user/${id}`)
        .then((response) => {
          console.log(response.data);
          return response.data;
        })
        .then((data) => {
          setUser(data);
          setFormAction(data);
        })
        .catch((err) => {
          alert(err.response.data);
          navigation("/users", { replace: true });
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setFormAction({ ...user, [e.target.name]: e.target.value });
    console.log(formAction);
  };

  const handleCancel = () => {
    if (
      window.confirm(
        `Bạn có muốn hủy ${id !== "0" ? "cập nhật" : "thêm"} user: ${
          user.username
        } không ?`
      )
    ) {
      alert("Cancel!");
      navigation("/users", { replace: true });
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setFormAction(user);
    console.log(formAction);
    if (
      window.confirm(
        `Bạn có muốn ${
          id !== "0"
            ? `cập nhật user: ${user.username} không ?`
            : `thêm user: ${user.username} không ?`
        } `
      )
    ) {
      request(id !== "0" ? "PUT" : "POST", `/api/user/save/${id}`, formAction)
        .then((response) => {
          alert(response.data);
          console.log(response.data);
          navigation("/users", { replace: true });
        })
        .catch((err) => {
          alert(err.response.data);
          console.log(err);
        });
    }
  };

  return (
    <form id="formAction" className="mx-8 mb-12" onSubmit={handleSubmitForm}>
      <div className="w-full h-full bg-white rounded-lg">
        <div className="mt-4">
          <div className="p-4 grid gap-x-6 gap-y-8 sm:grid-cols-1">
            <div className="sm:col-span-4">
              <label
                htmlFor="ten"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tên người dùng
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="ten"
                    id="ten"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Tên người dùng"
                    value={user.ten}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Email"
                    value={user.email}
                    autoComplete="email"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="username"
                    value={user.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                password
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="password"
                    id="password"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                role
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  required
                  value={user.role}
                  onChange={handleChange}
                >
                  <option value="" hidden>
                    -- Chọn đối tượng sử dụng --
                  </option>
                  <option value="admin">Admin</option>
                  <option value="staff">Nhân viên</option>
                  <option value="reader">Người đọc</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 mr-12">
          {currentUser().role === "admin" ? (
            (
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
            ) && id !== "0" ? (
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add
              </button>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </form>
  );
}
