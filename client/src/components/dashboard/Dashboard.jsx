import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
    ClockIcon,
    CloudArrowUpIcon,
    PlayCircleIcon,
    UserCircleIcon,
    BookOpenIcon,
    UserGroupIcon,
    ChevronDoubleLeftIcon,
    LanguageIcon
} from '@heroicons/react/24/outline'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import HistoryPage from '../../pages/HistoryPage'
import UserProfilePage from '../../pages/UserProfilePage'
import YoutubeSummary from '../SummarizerPage/YoutubeSummary'
import UploadSummary from '../SummarizerPage/UploadSummary'
import SearchPage from '@/pages/SearchPage'
import logo from '@/assets/logo.png'
import MeetingSummary from '../SummarizerPage/MeetingSummary'
import { Button } from '../ui/button'
import { useTheme } from '@/contexts/ThemeProvider'
import { cn } from '@/utils/utils'
import CaptionPage from '../CaptionPage/CaptionPage'


const navigation = [
    { name: 'Youtube', to: 'youtube', icon: PlayCircleIcon, current: true },
    { name: 'Upload', to: 'upload', icon: CloudArrowUpIcon, current: false },
    { name: 'Captions', to: 'captions', icon: LanguageIcon, current: false },
    // { name: "Meeting", to: "meeting", icon: UserGroupIcon, current: false },
    { name: 'Search', to: 'search', icon: BookOpenIcon, current: false },
    { name: 'History', to: 'history', icon: ClockIcon, current: false },
    // { name: 'Billing', to: 'billing', icon: CreditCardIcon, current: false },
    { name: 'Profile', to: 'profile', icon: UserCircleIcon, current: false },
]

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const [currentPathname, setCurrentPathname] = useState("")
    useEffect(() => {
        setCurrentPathname(location.pathname.split("/")[2] || "youtube")
    }, [location.pathname])
    const {isSideBarOpening, setIsSideBarOpening } = useTheme()

    const Bar3Button = () => {
        return (
            <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6 mx-2" aria-hidden="true" />
            </button>
        )
    }

    const toggleSideBar = () => {
        setIsSideBarOpening(!isSideBarOpening)
    }


    return (

        <>
            <div className='h-screen flex flex-col'>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>

                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                                        <div className='flex gap-x-2 pt-4'>
                                            <img className="h-12 w-12" src={logo} alt="Fusion AI" />
                                            <div className="flex shrink-0 items-center text-white text-3xl">
                                                Fusion AI
                                            </div>
                                        </div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul role="list" className="-mx-2 flex-1 space-y-1">
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        <Link
                                                            to={item.to}
                                                            className={cn(
                                                                currentPathname === item.to
                                                                    ? 'bg-gray-800 text-white'
                                                                    : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                            )}
                                                            onClick={() => setSidebarOpen(false)}
                                                        >
                                                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className={
                    cn(
                        "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block  lg:overflow-y-auto lg:bg-gray-900 lg:pb-4 transition-all duration-300 ease-in-out overflow-hidden ",
                        isSideBarOpening ? "w-44 lg:p-4" : "w-12"
                    )
                }>

                    <Link to="/" className=" font-bold flex h-16 shrink-0 items-center justify-center text-white text-2xl text-left text-nowrap">
                        <img className="h-10 w-10 mr-1 " src={logo} alt="Fusion AI" />
                        <span className={
                            cn(
                                isSideBarOpening ? "block" : "hidden",
                                "text-2xl transition-all duration-300 ease-in-out"
                            )
                        }>Fusion AI</span>
                    </Link>

                    <nav className="mt-4">
                        <ul role="list" className="flex flex-col items-center space-y-1 ">
                            {navigation.map((item) => (
                                <Link key={item.name} to={item.to} className='w-full text-center'>
                                    <li key={item.name}
                                        className={cn(
                                            currentPathname === item.to ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                            'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold'
                                        )}>
                                        <item.icon className="h-6 w-6 shrink-0 mr-2" aria-hidden="true" />
                                        <span className="sr-only">{item.name}</span>
                                        <div>{item.name}</div>
                                    </li>
                                </Link>
                            ))}
                            <div className={
                                cn(
                                    "",
                                    isSideBarOpening ? "text-right w-full" : "text-left"
                                )
                            }>
                                <span className='sr-only'>Toggle sidebar</span>
                                <Button
                                    variant="ghost"
                                    className="text-gray-400 hover:bg-gray-800 hover:text-white"
                                    onClick={toggleSideBar}
                                ><ChevronDoubleLeftIcon className={
                                    cn(
                                        "h-6 w-6 transition-all duration-300 ease-in-out",
                                        isSideBarOpening ? "" : "transform rotate-180"
                                    )
                                } /> 
                                </Button>
                            </div>
                        </ul>
                    </nav>
                </div>

                <div className={cn(currentPathname === "youtube" || currentPathname === "upload" ? "hidden" : "", "sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden")}>
                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />{currentPathname}
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6 text-white capitalize">{currentPathname}</div>
                </div>

                <main className={
                    cn(
                        "h-[80vh] flex-1 transition-all duration-300 ease-in-out",
                        isSideBarOpening ? "lg:pl-44 " : "lg:pl-12"
                    )
                }>
                    <Routes>
                        <Route path='' element={<YoutubeSummary Bar3Button={Bar3Button} />} />
                        <Route path='youtube' element={<YoutubeSummary Bar3Button={Bar3Button} />} />
                        <Route path='upload' element={<UploadSummary Bar3Button={Bar3Button} />} />
                        <Route path='meeting' element={<MeetingSummary Bar3Button={Bar3Button} />} />
                        <Route path='billing' element={<div />} />
                        <Route path='history' element={<HistoryPage />} />
                        <Route path='profile' element={<UserProfilePage />} />
                        <Route path='search' element={<SearchPage />} />
                        <Route path='captions' element={<CaptionPage />} />
                    </Routes>
                </main>

            </div>
        </>
    )
}

export default Dashboard