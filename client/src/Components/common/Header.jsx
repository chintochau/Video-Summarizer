import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GeneralButton from "../GeneralButton";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import BoltIcon from "@mui/icons-material/Bolt";
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Product', to: '' },
  { name: 'Features', to: '' },
  { name: 'Marketplace', to: '' },
  { name: 'Pricing', to: '/pricing' },
  { name: 'Console', to: '/console' },
]


const Header = () => {
  const { currentUser, credits } = useAuth();
  const location = useLocation()
  const pathname = location.pathname.substring(1)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // when user logged in
  const LoggedInMenu = () => {
    const menuItems = ["history", "profile"]
    return (
      <div className="flex">
        <Link to="/pricing" className="text-indigo-600 flex rounded-md outline-1 outline hover:text-indigo-400 cursor-pointer pr-2">
          <BoltIcon />
          <div className=""> {credits}</div>
        </Link>
      </div>)

  }

  const LoggedOutMenu = () => {
    return (
      <Link to="/login" className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900">
        Log in
      </Link>
    )
  }

  return (
    <header className="bg-white sticky top-0 z-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5">
            <span className="sr-only">Fusion AI</span>
            <img className="h-12 w-auto" src={logo} alt="" />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link key={item.name} to={item.to} className="text-sm font-semibold leading-6 text-gray-900">
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          {currentUser ? <LoggedInMenu /> : <LoggedOutMenu />}
          <Link
            to="/summarizer"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Summarize
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center gap-x-6">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Fusion AI</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </Link>
            <Link
              to="/summarizer"
              className="ml-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Summarize
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  to="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header;
