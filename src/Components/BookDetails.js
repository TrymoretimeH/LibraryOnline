import { useEffect, useState } from "react";
import { getAuthToken, getGiohang, request, setGiohang } from "./axios_helper";
import { useNavigate, useParams } from "react-router-dom";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";

const breadcrumb = { name: "Book", href: "/books" };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BookDetails({ currentUser, setCurrentUser }) {
  const navigation = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState({
    tieude: "",
    tacgia: "",
    mota: "",
    ngayphathanh: "",
    sotrang: 0,
    theloa: "",
    anh: "images/book.jpg",
    nhanxet: [],
    rate: [],
  });
  const [item, setItem] = useState({
    id: Number(id),
    soluongdaban: 1,
  });
  const [formAction, setFormAction] = useState(book);
  const [averageRate, setAverageRate] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommented, setIsCommented] = useState(false);

  console.log(currentUser());

  useEffect(() => {
    if (currentUser().username === "" && getAuthToken() === "null") {
      navigation("/login", { replace: true });
    }
    if (id !== "0") {
      request("GET", `/api/book/${id}`)
        .then((response) => response.data)
        .then((data) => {
          const date = new Date(data.ngayphathanh); // Chuyển đổi timestamp thành đối tượng ngày (date)
          const year = date.getFullYear(); // Lấy năm
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (cộng 1 vì tháng được đánh số từ 0 đến 11)
          const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày

          const formattedDate = `${year}-${month}-${day}`;
          const nhanxet = JSON.parse(data.nhanxet);
          const rate = JSON.parse(data.rate);
          console.log(JSON.stringify(nhanxet));
          data = {
            ...data,
            ngayphathanh: formattedDate, // Cập nhật giá trị ngayphathanh thành đối tượng ngày (date)
            nhanxet,
            rate,
          };

          console.log(data);

          setBook(data);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  useEffect(() => {
    setFormAction({
      ...book,
      nhanxet: JSON.stringify(book.nhanxet),
      rate: JSON.stringify(book.rate),
    });
    console.log(formAction);
  }, [book, book.nhanxet, book.rate]);

  useEffect(() => {
    if (book.rate.length > 0) {
      const sum = book.rate.reduce((s, point) => s + point, 0);
      console.log(sum);
      setAverageRate((sum / book.rate.length).toFixed(1));
    }
    console.log(book.rate);
  }, [book.rate]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    if (
      window.confirm(
        `Are you sure to cancel ${id !== "0" ? "save" : "add"} this book ?`
      )
    ) {
      alert("Cancel!");
      navigation("/books", { replace: true });
    }
  };

  const handleChangeInputFile = (e) => {
    const bookImg = document.querySelector("#book-card-img");
    const file = e.target.files[0];
    if (file) {
      setBook({ ...book, anh: "images/" + file.name });
      const reader = new FileReader(); // Tạo một đối tượng FileReader

      reader.onload = () => {
        bookImg.setAttribute("src", reader.result); // Lấy dữ liệu ảnh dưới dạng URL

        // Sử dụng imageDataURL theo nhu cầu của bạn (ví dụ: hiển thị hoặc gửi đi)
      };
      reader.readAsDataURL(file); // Đọc tệp ảnh dưới dạng URL
    } else {
      setBook({ ...book, anh: "" });
    }
  };

  const handleChangeUserInputNhanxet = (e) => {
    setComment(e.target.value);
    setIsCommented(true);
  };

  const handleClickEditBtn = (e) => {
    e.preventDefault();
    e.target.classList.add("hidden");
    const btnSave = document.getElementById("save-btn");
    const inputs = document.querySelectorAll("[disabled]");
    inputs.forEach((input) => input.removeAttribute("disabled"));
    btnSave.classList.remove("hidden");
  };

  const handleSumbitRating = (e) => {
    e.preventDefault();
    // console.log(e.target.farthestViewportElement.dataset.id);
    if (isRated) {
      let rating = 5;
      if (e.target.dataset.id !== undefined) {
        console.log(e.target.dataset);
        rating = e.target.dataset.id;
      } else {
        rating = e.target.farthestViewportElement.dataset.id;
      }
      if (
        window.confirm(
          `Bạn đồng ý đánh giá lại ${rating} sao cuốn sách ${book.tieude} chứ ?`
        )
      ) {
        book.rate.pop();
        setBook({ ...book, rate: [...book.rate, Number(rating)] });
      }
    } else {
      let rating = 5;
      if (e.target.dataset.id !== undefined) {
        console.log(e.target.dataset);
        rating = e.target.dataset.id;
      } else {
        rating = e.target.farthestViewportElement.dataset.id;
      }
      if (
        window.confirm(
          `Bạn đồng ý đánh giá ${rating} sao cuốn sách ${book.tieude} chứ ?`
        )
      ) {
        setBook({ ...book, rate: [...book.rate, Number(rating)] });
        setIsRated(true);
      }
    }
  };

  const handleAddCartItem = (e) => {
    e.preventDefault();
    const giohang = JSON.parse(getGiohang());
    if (Array.isArray(giohang)) {
      giohang.push(item);
      request("PUT", `api/user/save/cart`, {
        username: currentUser().username,
        giohang: JSON.stringify(giohang),
      })
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          setGiohang(JSON.stringify(giohang));
          console.log(getGiohang())
          alert("Thêm vào giỏ hàng thành công!")
          navigation("/books", { replace: true });
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (
      window.confirm(
        `Bạn có muốn ${
          id !== "0"
            ? `cập nhật cuốn sách '${book.tieude}'`
            : "thêm cuốn sách này"
        } chứ ?`
      )
    ) {
      if (comment !== "") {
        formAction.nhanxet = JSON.stringify([
          ...JSON.parse(formAction.nhanxet),
          currentUser().ten + ": " + comment,
        ]);
      }

      request(id !== "0" ? "PUT" : "POST", `/api/book/save/${id}`, formAction)
        .then((response) => {
          alert(response.data);

          navigation("/books", { replace: true });
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data)
        });
    }
  };

  return (
    <form id="formAction" className="mx-8" onSubmit={handleSubmitForm}>
      {currentUser().role === "admin" ? (
        <div className="space-y-12 w-full h-full bg-white rounded-lg mt-8">
          <div className="border-b border-gray-900/10 py-4">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 mx-8 lg:grid-cols-2">
              <div className="flex flex-col">
                <div className="flex ">
                  <div className="mr-4 w-1/2">
                    <label
                      htmlFor="tieude"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Tiêu đề (*)
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="text"
                          name="tieude"
                          id="tieude"
                          className="disabled:cursor-not-allowed block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Tiêu đề"
                          value={book.tieude}
                          onChange={handleChange}
                          required
                          disabled={id !== "0" ? true : false}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-1/2">
                    <label
                      htmlFor="tacgia"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Tác giả (*)
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="text"
                          name="tacgia"
                          id="tacgia"
                          className="disabled:cursor-not-allowed block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Tác giả"
                          value={book.tacgia}
                          onChange={handleChange}
                          required
                          disabled={id !== "0" ? true : false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="mota"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Mô tả về sách
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="mota"
                      rows="4"
                      name="mota"
                      className="disabled:cursor-not-allowed block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                      value={book.mota}
                      onChange={handleChange}
                      placeholder="Thêm mô tả cho sách"
                      disabled={id !== "0" ? true : false}
                    ></textarea>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-1/2 mr-4">
                    <label
                      htmlFor="ngayphathanh"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Ngày phát hành (*)
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="date"
                          name="ngayphathanh"
                          id="ngayphathanh"
                          className="disabled:cursor-not-allowed block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Ngày phát hành"
                          value={book.ngayphathanh}
                          onChange={handleChange}
                          required
                          disabled={id !== "0" ? true : false}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-1/2">
                    <label
                      htmlFor="sotrang"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Số trang
                    </label>
                    <div className="mt-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="number"
                        id="sotrang"
                        name="sotrang"
                        className="disabled:cursor-not-allowed block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        required
                        min={1}
                        max={999}
                        step={1}
                        onChange={handleChange}
                        placeholder="Số trang"
                        value={book.sotrang}
                        disabled={id !== "0" ? true : false}
                      ></input>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="theloai"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Thể loại (*)
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <select
                        type="text"
                        name="theloai"
                        id="theloai"
                        className="disabled:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                        placeholder="Thể loại"
                        value={book.theloai}
                        onChange={handleChange}
                        required
                        disabled={id !== "0" ? true : false}
                      >
                        <option value="" hidden>
                          -- Chọn thể loại --
                        </option>
                        <option value="Trinh Thám">Trinh Thám</option>
                        <option value="Ngôn Tình">Ngôn tình</option>
                        <option value="Phiêu Lưu">Phiêu lưu</option>
                        <option value="Tình Cảm">Tình cảm</option>
                        <option value="Tâm Lý">Tâm lý</option>
                        <option value="Tiểu Thuyết">Tiểu Thuyết</option>
                        <option value="Tài Liệu Tham Khảo">
                          Tài Liệu Tham Khảo
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center overflow-hidden">
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    onChange={handleChangeInputFile}
                    disabled={id !== "0" ? true : false}
                    type="file"
                    name="anh"
                    className="disabled:cursor-not-allowed cursor-pointer block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "
                  />
                </label>
                <div className="max-h-full justify-center flex">
                  <img
                    id="book-card-img"
                    className="min-h-300 max-h-80 object-cover"
                    src={"../" + book.anh}
                    alt="Book Card"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6 mr-24">
              {currentUser().role === "admin" ? (
                (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-sm font-semibold leading-6 text-gray-900 px-8"
                  >
                    Cancel
                  </button>
                ) && id !== "0" ? (
                  <div>
                    <button
                      onClick={handleClickEditBtn}
                      type="button"
                      className="px-8 rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Edit
                    </button>
                    <button
                      id="save-btn"
                      type="submit"
                      className="hidden px-8 rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="px-8 rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add
                  </button>
                )
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white py-4">
          <div className="">
            <nav aria-label="Breadcrumb">
              <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <li>
                  <div className="flex items-center">
                    <a
                      href={breadcrumb.href}
                      className="mr-2 text-sm font-medium text-gray-900"
                    >
                      {breadcrumb.name}
                    </a>
                    <svg
                      width={16}
                      height={20}
                      viewBox="0 0 16 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-5 w-4 text-gray-300"
                    >
                      <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                    </svg>
                  </div>
                </li>

                <li className="text-sm">
                  <a
                    href={book.id}
                    aria-current="page"
                    className="font-medium text-gray-500 hover:text-gray-600"
                  >
                    {book.tieude}
                  </a>
                </li>
              </ol>
            </nav>

            {/* Image gallery */}
            <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
              <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
                <img
                  src={"../" + book.anh}
                  alt="Book Card"
                  className="w-full max-h-screen object-contain"
                />
              </div>

              <div className="aspect-h-5 mt-4 lg:mt-0 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {book.tieude}
                </h1>

                <p className="mt-4 italic text-2xl tracking-tight text-gray-900 leading-3 text-base">
                  {book.tacgia}
                </p>

                <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                  {/* Description and details */}
                  <div>
                    <h3 className="sr-only">Description</h3>

                    <div className="space-y-6">
                      <p className="text-base text-gray-900">{book.mota}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:row-span-3 lg:mt-2">
                  <h2 className="sr-only">Product information</h2>
                  <div>
                    <label htmlFor="soluong" className="mr-8">
                      Số lượng:
                    </label>
                    <input
                      id="soluong"
                      name="soluong"
                      type="number"
                      value={item.soluongdaban}
                      onChange={(e) =>
                        setItem({ ...item, soluongdaban: e.target.value })
                      }
                      min={1}
                      max={999}
                      step={1}
                    />
                  </div>

                  {/* Reviews */}
                  <div className="mt-6">
                    <h3 className="sr-only">Reviews</h3>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <StarIcon
                            key={rating}
                            data-id={rating}
                            onClick={handleSumbitRating}
                            className={classNames(
                              averageRate >= rating
                                ? "text-amber-200"
                                : "text-gray-200",
                              "h-5 w-5 flex-shrink-0 cursor-pointer hover:text-amber-200"
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="sr-only">{averageRate} out of 5 stars</p>
                      <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        {averageRate}/5 ({book.rate.length} đánh giá)
                      </p>
                    </div>
                  </div>

                  <div className="mt-10">
                    <button
                      onClick={handleAddCartItem}
                      type="button"
                      className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>

                  <div>
                    <p className="mt-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      Nhận xét ({book.nhanxet.length})
                    </p>
                    <ol className="max-w-full space-y-1 mt-2 ">
                      {book.nhanxet.map((nhanxet, index) => {
                        return (
                          <li key={index} className="text-black">
                            {nhanxet}
                          </li>
                        );
                      })}
                    </ol>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="large-input"
                      className="block mb-2 text-sm font-medium text-black-900"
                    >
                      Viết Nhận xét
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={comment}
                        onChange={handleChangeUserInputNhanxet}
                        id="large-input user-input-nhanxet"
                        placeholder="Để lại nhận xét về cuốn sách"
                        className="mr-8 block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        Gửi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
