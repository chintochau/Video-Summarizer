import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
    CreditCardIcon,
    ClockIcon,
    CloudArrowUpIcon,
    PlayCircleIcon,
    UserCircleIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import HistoryPage from '../../pages/HistoryPage'
import UserProfilePage from '../../pages/UserProfilePage'
import YoutubeSummary from '../SummarizerPage/YoutubeSummary'
import UploadSummary from '../SummarizerPage/UploadSummary'
import { useNavigate } from 'react-router-dom';
import RAGPage from '@/pages/RAGPage'


function RootRedirect() {
    let navigate = useNavigate();
    useEffect(() => {
        navigate('youtube');
    }, [navigate]);

    return null;
}

const navigation = [
    { name: 'Youtube', to: 'youtube', icon: PlayCircleIcon, current: true },
    { name: 'Upload', to: 'upload', icon: CloudArrowUpIcon, current: false },
    { name: 'Search', to: 'rag', icon: BookOpenIcon, current: false },
    { name: 'History', to: 'history', icon: ClockIcon, current: false },
    { name: 'Billing', to: 'billing', icon: CreditCardIcon, current: false },
    { name: 'Profile', to: 'profile', icon: UserCircleIcon, current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const [currentPathname, setCurrentPathname] = useState("")
    useEffect(() => {
        setCurrentPathname(location.pathname.split("/")[2])

    }, [location.pathname])

    const Bar3Button = () => {
        return (
            <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6 mx-2" aria-hidden="true" />
        </button>
        )
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
                                        <div className="flex h-16 shrink-0 items-center text-white text-3xl">
                                            Fusion AI
                                        </div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul role="list" className="-mx-2 flex-1 space-y-1">
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        <Link
                                                            to={item.to}
                                                            className={classNames(
                                                                currentPathname === item.to 
                                                                    ? 'bg-gray-800 text-white'
                                                                    : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                            )}
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
                <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:p-4 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4 w-56">
                    <Link to="/" className="flex h-16 shrink-0 items-center justify-center text-white text-2xl text-left">
                        Fusion AI
                    </Link>
                    <nav className="mt-4">
                        <ul role="list" className="flex flex-col items-center space-y-1 ">
                            {navigation.map((item) => (
                                <Link key={item.name} to={item.to} className='w-full text-center'>
                                    <li key={item.name}
                                        className={classNames(
                                            currentPathname === item.to ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                            'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold'
                                        )}>
                                        <item.icon className="h-6 w-6 shrink-0 mr-2" aria-hidden="true" />
                                        <span className="sr-only">{item.name}</span>
                                        <div>{item.name}</div>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className={classNames(currentPathname === "youtube" || currentPathname === "upload" ? "hidden" : "", "sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden")}>
                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div>
                    <Link to="">
                        <span className="sr-only">Your profile</span>
                        <img
                            className="h-8 w-8 rounded-full bg-gray-800"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                        />
                    </Link>
                </div>

                <main className="lg:pl-56 h-[80vh] flex-1">
                    <Routes>
                        <Route path='' element={<RootRedirect />} />
                        <Route path='youtube' element={<YoutubeSummary Bar3Button={Bar3Button} />} />
                        <Route path='upload' element={<UploadSummary />} />
                        <Route path='billing' element={<div />} />
                        <Route path='history' element={<HistoryPage />} />
                        <Route path='profile' element={<UserProfilePage />} />
                        <Route path='rag' element={<RAGPage />} />
                    </Routes>
                </main>

            </div>
        </>
    )
}

export default Dashboard