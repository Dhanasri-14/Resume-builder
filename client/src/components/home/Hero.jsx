
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Hero = () => {


    const {user} = useSelector(state => state.auth)


    const [menuOpen, setMenuOpen] = React.useState(false);

    const logos = [
        'https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/framer.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg',
        'https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg',
    ];

    return (
        <>
            <div className="min-h-screen pb-20 bg-gradient-to-b from-green-50 to-white text-gray-900">
                {/* Navbar */}
                <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">
                    <a href="/">
                        <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
                    </a>

                    <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                        <a href="#" className="hover:text-green-600 transition">Home</a>
                        <a href="#features" className="hover:text-green-600 transition">Features</a>
                        <a href="#testimonials" className="hover:text-green-600 transition">Testimonials</a>
                        <a href="#cta" className="hover:text-green-600 transition">Contact</a>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to="/app?state=register"
                            className="hidden md:block px-5 py-1.5 bg-green-500 hover:bg-green-600 active:scale-95 transition-all rounded-full text-white" hidden={user}
                        >
                            Get started
                        </Link>
                        <Link
                            to="/app?state=login"
                            className="hidden md:block px-5 py-1.5 border border-green-500 active:scale-95 hover:bg-green-50 transition-all rounded-full text-green-700 hover:text-slate-900" hidden={user}
                        >
                            Login
                            
                        </Link>
                        <Link to= '/app' className='hidden md:block px-8 py-2 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white' hidden={!user}>
                         Dashboard
                        </Link>
                    </div>

                    <button
                        onClick={() => setMenuOpen(true)}
                        className="md:hidden active:scale-90 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 5h16M4 12h16M4 19h16" />
                        </svg>
                    </button>
                </nav>

                {/* Mobile Menu */}
                <div
                    className={`fixed inset-0 z-[100] bg-green-900/90 text-white backdrop-blur-md flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <a href="/" className="hover:text-green-200">Home</a>
                    <a href="#features" className="hover:text-green-200">Features</a>
                    <a href="#testimonials" className="hover:text-green-200">Testimonials</a>
                    <a href="#contact" className="hover:text-green-200">Contact</a>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="aspect-square size-10 p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 transition text-white rounded-md"
                    >
                        ✕
                    </button>
                </div>

                {/* Hero Section */}
                <div className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-40 text-center mt-20">
                    <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 bg-green-300 blur-[100px] opacity-30"></div>

                    {/* Avatars + Stars */}
                    <div className="flex items-center mt-16">
                        <div className="flex -space-x-3 pr-3">
                            {[
                                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
                                'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
                                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
                                'https://randomuser.me/api/portraits/men/75.jpg',
                            ].map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`user${i}`}
                                    className="size-8 rounded-full border-2 border-white object-cover hover:-translate-y-0.5 transition"
                                />
                            ))}
                        </div>

                        <div className="text-left">
                            <div className="flex">
                                {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                        <svg
                                            key={i}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="green"
                                            stroke="green"
                                            strokeWidth="2"
                                        >
                                            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                        </svg>
                                    ))}
                            </div>
                            <p className="text-sm text-gray-700">Used by 10,000+ users</p>
                        </div>
                    </div>

                    {/* Headline — AI-powered stays on same line */}
                    <h1 className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-6 md:leading-[70px]">
                        Land your dream job with <span className="whitespace-nowrap bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">AI-powered</span> resumes.
                    </h1>

                    <p className="max-w-md text-center text-base my-7 text-gray-700">
                        Create, edit and download professional resumes with AI-powered assistance.
                    </p>


                    {/* CTA Buttons — uniform full-size with aligned icons */}
                    <div className="flex items-center gap-4 mt-4">
                        {/* Get Started Button */}
                        <Link
                            to="/app"
                            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full px-8 h-12 ring-1 ring-green-400 ring-offset-2 transition-all text-base shadow-md active:scale-95"
                        >
                            Get started
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-5"
                            >
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </Link>

                        {/* Try Demo Button */}
                        <button className="flex items-center justify-center gap-2 border-2 border-green-400 text-green-700 hover:bg-green-50 transition-all rounded-full px-8 h-12 font-medium text-base active:scale-95">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="size-5"
                            >
                                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                                <rect x="2" y="6" width="14" height="12" rx="2"></rect>
                            </svg>
                            <span>Try demo</span>
                        </button>
                    </div>



                    <p className="py-6 text-slate-600 mt-14">
                        Trusted by leading brands
                    </p>

                    <div className="flex flex-wrap justify-between max-sm:justify-center gap-6 max-w-3xl w-full mx-auto py-4">
                        {logos.map((logo, i) => (
                            <img key={i} src={logo} alt="logo" className="h-6 w-auto" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Global Font */}
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          * { font-family: 'Poppins', sans-serif; }
        `}
            </style>
        </>
    );
};

export default Hero;

