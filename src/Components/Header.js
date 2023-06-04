import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const navigation = [
  { name: "Books List", href: "/books", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header({ logout, isLoggedIn, currentUser }) {
    const navigater = useNavigate();

    if (currentUser().role === "admin" && navigation.length < 2) {
        navigation.push({ name: "Add a Book", href: "/book/0", current: true })
        navigation.push({ name: "Users List", href: "/users", current: false })
        navigation.push({ name: "Add a User", href: "/user/0", current: false })
    } else if (currentUser().role !== "admin" && navigation.length > 2) {
        navigation.pop({ name: "Add a Book", href: "/book/0", current: true })
        navigation.pop({ name: "Users List", href: "/users", current: false })
        navigation.pop({ name: "Add a User", href: "/user/0", current: false })
    }

    const handleSignout = () => {
        logout();
        navigater("/", { replace: true })
    }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex ml-24 sm:ml-0 items-center justify-center">
                <div className="flex items-center">
                  <a
                    href="/"
                    className="block w-auto text-white lg:hidden"
                  >
                    Library
                  </a>
                  <a
                    href="/"
                    className="hidden w-auto lg:block text-white"
                  >
                    Management Library
                  </a>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Profile dropdown */}
                { isLoggedIn() ? <Menu as="div" className="relative ml-3">
                  <div>
                    
                    <Menu.Button className="flex rounded-full items-center justify-center bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <p className="text-white rounded-md ml-2 py-2 text-sm">Hi,</p>
                      <p className="text-white rounded-md px-3 py-2 text-sm font-bold">
                         {currentUser().ten}
                         </p>
                      <img
                        className="h-8 w-8 rounded-full ring-2 ring-white mr-2"
                        src="images/user.png"
                        alt="user avatar"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-black-200 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <div className="px-4 py-3 text-sm text-gray-900">
                          <div>{currentUser().ten}</div>
                          <div className="font-medium truncate">{currentUser().email}</div>
                        </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                            <button
                              type="button"
                              onClick={handleSignout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "w-full block px-4 py-2 text-sm text-gray-700 text-start "
                              )}
                            >
                              Đăng xuất
                            </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu> : <div></div> }
                
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
