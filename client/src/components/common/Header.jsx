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
import { LinkToDashboard } from "./RoutingLinks";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { CaptionsIcon, NotebookPenIcon, NotebookTextIcon } from "lucide-react";

const navigation = [
  {
    name: "Features",
    to: "",
    href: "/#features",
    submenu: [
      {
        name: "Transcription",
        description: "Leading Accuracy and Speed transcription at lowest cost.",
        to: "",
        href: "/transcription#top",
        icon: <CaptionsIcon className="size-8" />,
      },
      {
        name: "Summarization",
        description: " Fast and accurate summarization at lowest cost.",
        to: "",
        href: "/summarization#top",
        icon: <NotebookTextIcon className="size-8" />,
      },
      // {
      //   name: "Meetings Notes",
      //   description: "Jot down your meetings for you.",
      //   to: "",
      //   href: "/meeting#top",
      //   icon: <NotebookPenIcon className="size-8" />,

      // },
    ],
  },
  { name: "Pricing", to: "", href: "/#pricing" },
  { name: "F&Q", to: "", href: "/#faq" },
  // { name: "About", to: "", href: "/about" },
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
          <LinkToDashboard>Summarize</LinkToDashboard>
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
        <LinkToDashboard>
          <Button size="sm">Console</Button>
        </LinkToDashboard>
      </div>
    );
  };

  return (
    <header
      className={cn("bg-gray-900 sticky top-0 z-10 text-white", className)}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-2 md:gap-x-6 py-1 px-2 md:py-2 lg:px-8"
        aria-label="Global"
      >
        <div className="flex md:flex-1">
          <Link to="/" className="-m-1.5 flex items-center">
            <span className="sr-only">Fusion AI Video</span>
            <img className="h-10 w-10 ml-3 mr-1 " src={logo} alt="" />
            <p className="text-2xl font-semibold leading-6 ">Fusion AI Video</p>
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex md:gap-x-6 lg:gap-x-12">
          <NavigationMenuList>
            {navigation.map((item) => (
              <NavigationMenuItem key={item.name}>
                {item.submenu ? (
                  <NavigationMenuTrigger>
                    <HashLink to={item.href}>{item.name}</HashLink>
                  </NavigationMenuTrigger>
                ) : (
                  
                    <HashLink to={item.href} className={navigationMenuTriggerStyle()}>{item.name}</HashLink>
                 
                )}

                {item.submenu && (
                  <NavigationMenuContent>
                    <div className="grid  p-2 gap-3">
                      {item.submenu.map((item) => (
                        <NavigationMenuLink
                          key={item.name}
                          asChild
                          className={navigationMenuTriggerStyle()}
                        >
                          <HashLink
                            smooth
                            key={item.name}
                            to={item.href}
                            className="text-sm font-semibold flex gap-4 h-20"
                          >
                            <div className="h-16 w-12 flex items-center justify-center bg-gray-700 rounded-md">
                              {item.icon}
                            </div>
                            <div className="flex flex-col w-80">
                              <h3 className=" text-md ">{item.name}</h3>
                              <p className="text-gray-400">
                                {item.description}
                              </p>
                            </div>
                          </HashLink>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-1 items-center justify-end gap-x-2 md:gap-x-6">
          {currentUser ? <SignedInMenu /> : <SignedOutMenu />}
        </div>
        <div className="flex md:hidden">
          <button type="button" onClick={() => setMobileMenuOpen(true)}>
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
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center gap-x-6">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Fusion AI Video</span>
              <div className="flex items-center">
                <img className="h-12 w-12" src={logo} alt="Fusion AI" />
                <div className="text-3xl ml-2 font-semibold leading-6 text-white">
                  Fusion AI Video
                </div>
              </div>
            </Link>
            <LinkToDashboard className="ml-auto">
              <Button>Summarize</Button>
            </LinkToDashboard>
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
                  <HashLink
                    smooth
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </HashLink>
                ))}
              </div>
              <div className="py-6">
                {currentUser ? null : (
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-50"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header;
