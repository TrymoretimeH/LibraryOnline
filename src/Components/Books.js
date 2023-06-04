import { useEffect, useState, Fragment } from "react";
import {
  getAuthToken,
  request,
  setAuthHeader,
  setRole,
  setTen,
  getTen,
  setEmail,
  setGiohang,
  getGiohang,
  setUsername,
} from "./axios_helper";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

export default function Books({
  isLoggedIn,
  setIsLoggedIn,
  currentUser,
  setCurrentUser,
}) {
  const [books, setBooks] = useState([]);
  const [booksWithSearch, setBooksWithSearch] = useState(books);
  const [isDeleted, setIsDeleted] = useState(false);
  const [open, setOpen] = useState(false);
  const navigation = useNavigate();
  const [cart, setCart] = useState(getGiohang() !== "" ? JSON.parse(getGiohang()) : []);
  const [isGiohangChanged, setIsGiohangChanged] = useState(false);

  // console.log(cart)

  const checkLoginStatus = () => {
    if (getAuthToken() !== "null") {
      // console.log(getAuthToken());
      if (isLoggedIn()) {
        request("GET", "/api/book/all")
          .then((response) => response.data)
          .then((data) => {
            const formattedData = data.map((item) => {
              const formattedDate = new Date(item.ngayphathanh); // Chuyển đổi timestamp thành đối tượng ngày (date)
              const dateString = formattedDate.toDateString();
              return {
                ...item,
                ngayphathanh: dateString, // Cập nhật giá trị ngayphathanh thành đối tượng ngày (date)
              };
            });
            setBooks(formattedData);
            setBooksWithSearch(formattedData);
          })
          .catch((error) => {
            console.log(error);
            setAuthHeader(null);
          });
      } else {
        setIsLoggedIn(true);
      }
    } else {
      setTen("");
      setRole("");
      setEmail("");
      setIsLoggedIn(false);
      setUsername("");
      setGiohang("")
      navigation("/login", { replace: true });
    }
  };

  useEffect(() => {
    checkLoginStatus();
    if (getGiohang() !== "") {
      setCart(JSON.parse(getGiohang()));
    }
    setIsGiohangChanged(!isGiohangChanged);

  }, [isDeleted, getTen(), isLoggedIn(), getAuthToken()]);

  const handleView = (e) => {
    const formAction = document.querySelector("#formAction");
    formAction.setAttribute("action", `/book/${e.target.dataset.id}`);
    formAction.submit();
  };

  const handleDelete = (e) => {
    if (
      window.confirm(
        `Are you sure you want to delete Book: ${e.target.dataset.title}`
      )
    ) {
      request("DELETE", `/api/book/delete/${e.target.dataset.id}`)
        .then((response) => response.data)
        .then((data) => {
          alert(data);
          setIsDeleted(!isDeleted);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setBooksWithSearch(books);
    } else {
      setBooksWithSearch(
        books.filter(
          (book) =>
            book.tieude.toLowerCase().includes(e.target.value.toLowerCase()) ||
            book.tacgia.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const handleRemoveItemCart = (e) => {
    e.preventDefault();
    if (window.confirm(`Bạn có muốn xóa hết sách này ở giỏ hàng không?`)) {
      const cartWithRemove = currentUser().giohang.filter(
        (item) => item.id !== Number(e.target.dataset.id)
      );
  
      const formRemoveCartItem = {
        username: currentUser().username,
        giohang: JSON.stringify(cartWithRemove),
      };
  
      setCart(cartWithRemove);
      setIsGiohangChanged(!isGiohangChanged);
      request("PUT", `api/user/save/cart`, formRemoveCartItem)
        .then((response) => response.data)
        .then((data) => console.log(data))
        .catch((error) => console.log(error));

    }
  };

  useEffect(() => {
    setCurrentUser({ ...currentUser(), giohang: cart });
    setGiohang(JSON.stringify(cart));
  }, [isGiohangChanged]);

  const handleChangeAmountItemCart = (e) => {
    const updateCart = cart.map((item) => {
      if (item.id === Number(e.target.dataset.id)) {
        return {
          ...item,
          soluongdaban: e.target.value,
        };
      }
      return item;
    });

    setCart(updateCart);
    setIsGiohangChanged(!isGiohangChanged);

    const formRemoveCartItem = {
      username: currentUser().username,
      giohang: JSON.stringify(updateCart),
    };

    request("PUT", `api/user/save/cart`, formRemoveCartItem)
      .then((response) => response.data)
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  const handlePayCart = (e) => {
    e.preventDefault();
    if (window.confirm(`Bạn có muốn thanh toán hết sách ở giỏ hàng không?`)) {
      setCart([]);
      setIsGiohangChanged(!isGiohangChanged);
      request("PUT", `api/book/pay/cart`, cart)
        .then((response) => response.data)
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
      request("PUT", `api/user/pay/cart`, { username: currentUser().username })
        .then((response) => response.data)
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
      alert("Thanh toán thành công. Cảm ơn quý khách!");
      checkLoginStatus();
    }
  };

  return (
    <div className="book-container scroll-smooth">
      {currentUser().role === "admin" ? (
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
                className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
          </div>

          <div className="flex flex-col mt-6">
            <div className="overflow-x-auto sm:mx-2 lg:mx-4">
              <div className="inline-block pb-4 min-w-full align-middle">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="text-center min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="text-center py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Tiêu đề
                        </th>

                        <th
                          scope="col"
                          className="text-center px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Tác giả
                        </th>

                        <th
                          scope="col"
                          className="text-center px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Ngày phát hành
                        </th>

                        <th
                          scope="col"
                          className="text-center px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Số trang
                        </th>

                        <th
                          scope="col"
                          className="text-center px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Thể loại
                        </th>

                        <th
                          scope="col"
                          className="text-center px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Số lượng đã bán
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
                      {booksWithSearch.map((book) => (
                        <tr key={book.id}>
                          <td className="text-center px-4 py-4 text-sm font-medium whitespace-nowrap">
                            <div>
                              <h2 className="text-center font-medium text-gray-800 dark:text-white ">
                                {book.tieude}
                              </h2>
                            </div>
                          </td>
                          <td className="text-center px-12 py-4 text-sm font-medium whitespace-nowrap">
                            <div className="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                              {book.tacgia}
                            </div>
                          </td>
                          <td className="text-center px-4 py-4 text-sm whitespace-nowrap">
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {book.ngayphathanh}
                            </h4>
                            {/* <p className="text-gray-500 dark:text-gray-400">
                              Brings all your news into one place
                            </p> */}
                          </td>
                          <td className="text-center px-4 py-4 text-sm whitespace-nowrap">
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {book.sotrang}
                            </h4>
                          </td>

                          <td className="text-center px-4 py-4 text-sm whitespace-nowrap">
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {book.theloai}
                            </h4>
                          </td>

                          <td className="text-center px-4 py-4 text-sm whitespace-nowrap">
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {book.soluongdaban}
                            </h4>
                          </td>

                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <button
                              onClick={handleView}
                              className="mr-2 px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100"
                              data-id={book.id}
                            >
                              View
                            </button>
                            {currentUser().role === "admin" ? (
                              <button
                                data-id={book.id}
                                data-title={book.title}
                                onClick={handleDelete}
                                className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-red-200"
                              >
                                Delete
                              </button>
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
          <form id="formAction"></form>
        </section>
      ) : (
        <div className="bg-white">
          <div className="flex mx-auto max-w-2xl lg:max-w-7xl lg:mr-8 lg:ml-8 pt-4">
            <div className="flex justify-center items-center w-full w-full">
              <div className="relative flex items-center md:mt-0 w-full">
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
                  placeholder="Tìm kiếm"
                  onChange={handleSearch}
                  className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <button className="ml-8 mr-8 text-red-500 hover:text-red-700">
                <ShoppingCartIcon
                  onClick={() => setOpen(true)}
                  className="h-8 w-8  flex-none"
                />
              </button>
            </div>
            <Transition.Root show={open} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                      <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                              <div className="flex items-start justify-between">
                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                  Giỏ hàng
                                </Dialog.Title>
                                <div className="ml-3 flex h-7 items-center">
                                  <button
                                    type="button"
                                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                    onClick={() => setOpen(false)}
                                  >
                                    <span className="sr-only">Close panel</span>
                                    <XMarkIcon
                                      className="h-6 w-6"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </div>
                              </div>

                              <div className="mt-8">
                                <div className="flow-root">
                                  <ul className="-my-6 divide-y divide-gray-200">
                                    {currentUser().giohang.length > 0
                                      ? cart.map((book) => (
                                          <li
                                            key={book.id}
                                            className="flex py-6"
                                          >
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                              <img
                                                src={
                                                  books.length > 0
                                                    ? books.find(
                                                        (item) =>
                                                          item.id === book.id
                                                      ).anh
                                                    : ""
                                                }
                                                alt="Book"
                                                className="h-full w-full object-cover object-center"
                                              />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                              <div>
                                                <div className="flex justify-between text-base text-gray-900">
                                                  <h3 className="font-medium">
                                                    <a href={"book/" + book.id}>
                                                      {books.length > 0
                                                        ? books.find(
                                                            (item) =>
                                                              item.id ===
                                                              book.id
                                                          ).tieude
                                                        : ""}
                                                    </a>
                                                    <p className="font-normal italic text-gray-500">
                                                      {books.length > 0
                                                        ? books.find(
                                                            (item) =>
                                                              item.id ===
                                                              book.id
                                                          ).tacgia
                                                        : ""}
                                                    </p>
                                                  </h3>
                                                </div>
                                              </div>
                                              <div className="flex flex-1 items-end justify-between text-sm">
                                                <p className="text-gray-500">
                                                  Số lượng
                                                  <input
                                                    data-id={book.id}
                                                    onChange={
                                                      handleChangeAmountItemCart
                                                    }
                                                    value={book.soluongdaban}
                                                    type="number"
                                                    min={1}
                                                    max={999}
                                                    step={1}
                                                    className="ml-2 font-medium text-gray-900"
                                                  />
                                                </p>

                                                <div className="flex">
                                                  <button
                                                    data-id={book.id}
                                                    onClick={
                                                      handleRemoveItemCart
                                                    }
                                                    type="button"
                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                  >
                                                    Xóa
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </li>
                                        ))
                                      : null}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Tổng cộng</p>
                                <p>
                                  {cart.length > 0
                                    ? cart.reduce(
                                        (countBooks, book) =>
                                          countBooks +
                                          Number(book.soluongdaban),
                                        0
                                      )
                                    : "0"}{" "} 
                                  cuốn
                                </p>
                              </div>
                              <div className="mt-6">
                                <button
                                  onClick={handlePayCart}
                                  type="button"
                                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                >
                                  Thanh toán
                                </button>
                              </div>
                              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                <p>
                                  or
                                  <button
                                    type="button"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                    onClick={() => setOpen(false)}
                                  >
                                    Tiếp tục mua
                                    <span aria-hidden="true"> &rarr;</span>
                                  </button>
                                </p>
                              </div>
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </div>
          <div className="mx-auto max-w-2xl lg:max-w-7xl mt-6 lg:mr-8 lg:ml-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Sản phẩm hiện có
            </h2>

            <div className="py-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {booksWithSearch.map((book) => (
                <div key={book.id} className="group relative border p-2 border-gray-900 rounded-lg">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img
                      src={book.anh}
                      alt="Book Card"
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        <a href={"book/" + book.id}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {book.tieude}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 italic">
                        {book.tacgia}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      đã bán {book.soluongdaban}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
