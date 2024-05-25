import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { HashLink } from "react-router-hash-link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Features", to: "", href: "/#features" },
  { name: "Pricing", to: "", href: "/#pricing" },
  { name: "F&Q", to: "", href: "/#faq" },
];

const Header = ({ className }) => {
  const { currentUser, credits } = useAuth();
  const location = useLocation();
  const pathname = location.pathname.substring(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SignedOutMenu = () => {
    return (
      <div className=" flex items-center">
        <Button size="sm">
          <Link to="/summarizer">
            Summarize
          </Link>
        </Button>

        <div className="flex items-center">
          <Link to="/login">
            <Button variant="link" className="text-white px-2">
              Sign in
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  const SignedInMenu = () => {
    return (
      <div className=" flex items-center">
        <Link to="/console/youtube">
          <Button size="sm">Console</Button>
        </Link>
      </div>
    );
  };

  return (
    <header className={cn("bg-gray-900 sticky top-0 z-10 text-white", className)}>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-2 md:gap-x-6 py-1 px-2 md:py-2 lg:px-8"
        aria-label="Global"
      >
        <div className="flex md:flex-1">
          <Link to="/" className="-m-1.5 flex items-center">
            <span className="sr-only">Fusion AI</span>
            <img className="h-10 w-10 ml-3 mr-1 " src={logo} alt="" />
            <p className="text-2xl font-semibold leading-6 ">
              Fusion AI
            </p>
          </Link>
        </div>
        <div className="hidden md:flex md:gap-x-6 lg:gap-x-12">
          {navigation.map((item) => (
            <HashLink
              smooth
              key={item.name}
              to={item.href}
              className="text-sm font-semibold leading-6 "
            >
              {item.name}
            </HashLink>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-2 md:gap-x-6">
          {currentUser ? <SignedInMenu /> : <SignedOutMenu />}
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center gap-x-6">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Fusion AI</span>
              <div className="flex items-center">
                <img className="h-12 w-12" src={logo} alt="Fusion AI" />
                <div className="text-2xl font-semibold leading-6 text-gray-900">
                  Fusion AI
                </div>
              </div>
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
                  Sign in
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
