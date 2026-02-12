import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, Layout, Users, Shield, Star, Mail, Phone, MapPin } from 'lucide-react'

const LandingPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        // Set body background to white for the landing page
        document.body.style.backgroundColor = 'white';
        document.body.style.color = '#111827'; // gray-900

        // Cleanup: revert to dark mode for the rest of the app
        return () => {
            document.body.style.backgroundColor = '#111';
            document.body.style.color = '#eee';
        };
    }, []);

    return (
        <div className='min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-blue-200 selection:text-blue-900'>
            {/* Navbar */}
            <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm'>
                <div className='flex justify-between items-center px-6 py-4 max-w-7xl mx-auto'>
                    <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 bg-blue-600 rounded-lg transform rotate-45 flex items-center justify-center'>
                            <div className='w-4 h-4 bg-white rounded-sm transform -rotate-45'></div>
                        </div>
                        <span className='text-2xl font-bold tracking-tight text-blue-900'>ETS</span>
                        {/* Employee Tracker System (Ets) */}
                    </div>

                    <div className='hidden md:flex items-center gap-8'>
                        <a href="#home" className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'>Home</a>
                        <a href="#features" className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'>Features</a>
                        <a href="#reviews" className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'>Reviews</a>
                        <a href="#contact" className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'>Contact Us</a>
                        <a href="#about" className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors'>About Us</a>
                    </div>

                    <button
                        onClick={() => navigate('/login', { state: { type: 'employee' } })}
                        className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 shadow-lg shadow-blue-500/30 font-medium'
                    >
                        Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className='relative pt-20 pb-32 overflow-hidden px-6'>
                <div className='flex flex-col items-center justify-center text-center max-w-5xl mx-auto z-10 relative'>
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-sm text-blue-700 mb-8 font-medium animate-fade-in-up'>
                        {/* <span className='w-2 h-2 rounded-full bg-blue-600 animate-pulse'></span> */}
                        {/* v2.0 is now live */}
                    </div>
                    <h1 className='text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tigher'>
                        The Ultimate <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>Employee Tracker</span> System.
                    </h1>
                    <p className='text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed font-light'>
                        Streamline your workforce, track attendance, assign tasks, and manage coding challenges all in one beautiful, unified platform.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-6 w-full justify-center'>
                        <button
                            onClick={() => navigate('/login', { state: { type: 'employee' } })}
                            className='group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 min-w-[200px]'
                        >
                            Employee Portal <Users className='ml-2 group-hover:scale-110 transition-transform' size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/login', { state: { type: 'admin' } })}
                            className='group px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 min-w-[200px]'
                        >
                            Admin Portal <Shield className='ml-2 group-hover:scale-110 transition-transform' size={20} />
                        </button>
                    </div>
                </div>

                {/* Dashboard Preview "Image" (CSS Mockup) */}
                <div className='mt-20 max-w-6xl mx-auto relative z-10 px-4'>
                    <div className='relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white'>

                        {/* Dashboard Content Mockup */}
                        <div className='relative aspect-video bg-gray-50 border-b border-gray-200'>
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                                alt="Dashboard Preview"
                                className='w-full h-full object-cover'
                            />
                            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
                        </div>
                    </div>
                    {/* Decorative Blobs */}
                    <div className='absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-200/20 blur-3xl rounded-full'></div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className='py-20 bg-white border-b border-gray-100'>
                <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
                    <div className='relative'>
                        <div className='absolute -z-10 -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-2xl'></div>
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
                            alt="Team Collaboration"
                            className='rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500'
                        />
                    </div>
                    <div>

                        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight'>
                            Empowering Organizations to Build Better Workplaces.
                        </h2>
                        <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
                            EmpManager is not just another HR tool; it's a comprehensive ecosystem designed to bridge the gap between management and employees. From real-time attendance tracking to seamless task delegation, we provide the tools you need to foster a culture of transparency and productivity.
                        </p>
                        <ul className='space-y-4 mb-8'>
                            <li className='flex items-center gap-3 text-gray-700'>
                                <CheckCircle className='text-green-500' size={20} />
                                <span>Streamlined Communication Channels</span>
                            </li>
                            <li className='flex items-center gap-3 text-gray-700'>
                                <CheckCircle className='text-green-500' size={20} />
                                <span>Data-Driven Performance Metrics</span>
                            </li>
                            <li className='flex items-center gap-3 text-gray-700'>
                                <CheckCircle className='text-green-500' size={20} />
                                <span>Secure and Scalable Infrastructure</span>
                            </li>
                        </ul>

                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className='py-20 bg-slate-50'>
                <div className='max-w-7xl mx-auto px-6'>
                    <div className='text-center mb-16'>
                        <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Everything you need to manage your team</h2>
                        <p className='mt-4 text-lg text-gray-600'> Powerful features to help you grow your business.</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <FeatureCard
                            icon={Layout}
                            title="Unified Dashboard"
                            desc="Manage everything from a single, intuitive dashboard designed for clarity and speed."
                            color="blue"
                        />
                        <FeatureCard
                            icon={Users}
                            title="Employee Tracking"
                            desc="Real-time attendance monitoring and detailed employee profiles at your fingertips."
                            color="indigo"
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Task Management"
                            desc="Assign tasks, track progress, and review submissions with our powerful kanban-style system."
                            color="cyan"
                        />
                    </div>
                </div>
            </section>

            {/* Reviews / Testimonials Section */}
            <section id="reviews" className='py-20 bg-slate-50 border-t border-gray-200'>
                <div className='max-w-7xl mx-auto px-6'>
                    <div className='text-center mb-16'>
                        <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Trusted by Teams Everywhere</h2>
                        <p className='mt-4 text-lg text-gray-600'>See what our customers have to say.</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <ReviewCard
                            name="Aswini Pasam"
                            role="HR Manager, TechCorp"
                            content="This platform has completely transformed how we manage our remote team. The attendance tracking is effortless."
                            rating={5}
                        />
                        <ReviewCard
                            name="Indhraneel Shetty
"
                            role="CTO, StartUp Inc"
                            content="The task assignment and review workflow is a game-changer for our engineering team. Highly recommended!"
                            rating={5}
                        />
                        <ReviewCard
                            name="Dhiraj Moreshwar Aknurwar"
                            role="Operations Lead, GlobalFlow"
                            content="Intuitive, fast, and reliable. Customer support is top-notch. It's the best investment we've made this year."
                            rating={4}
                        />
                    </div>
                </div>
            </section>


            <footer id="contact" className="bg-gray-900 text-white py-4">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-4">

                    {/* Logo & About */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-blue-600 rounded-lg transform rotate-45 flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-sm transform -rotate-45"></div>
                            </div>
                            <span className="text-lg font-bold">ETS Manager</span>
                        </div>

                        <p className="text-gray-400 max-w-sm text-xs">
                            Building the future of workforce management. Join thousands of companies using EmpManager to streamline their operations.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold mb-2">Quick Links</h3>
                        <ul className="space-y-1 text-sm">
                            <li><a href="#home" className="text-gray-400 hover:text-white">Home</a></li>
                            <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
                            <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                            <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold mb-2">Contact</h3>
                        <ul className="space-y-1 text-xs">
                            <li className="flex items-start gap-2 text-gray-400">
                                <MapPin size={14} className="text-blue-500" />
                                <span>Aja Consulting Services LLP, 4th Flour<br />A Block, Q City, Gachibowli<br /> Hyderabad, Telangana 500032</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <Phone size={14} className="text-blue-500" />
                                <span>+91 9666477844</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <Mail size={14} className="text-blue-500" />
                                <span>hr@ajacs.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="max-w-7xl mx-auto px-6 pt-2 mt-3 border-t border-gray-800 text-center text-gray-500 text-xs">
                    <p>© 2026 Admin & Employee Tracker System.</p>
                </div>
            </footer>




















        </div>
    )
}

const FeatureCard = ({ icon: Icon, title, desc, color }) => {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50',
        indigo: 'text-indigo-600 bg-indigo-50',
        cyan: 'text-cyan-600 bg-cyan-50'
    }

    return (
        <div className='p-8 rounded-2xl bg-slate-50 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all hover:-translate-y-1 duration-300 group'>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${colorClasses[color] || colorClasses.blue} group-hover:scale-110 transition-transform`}>
                <Icon size={28} />
            </div>
            <h3 className='text-xl font-bold mb-3 text-gray-900'>{title}</h3>
            <p className='text-gray-600 leading-relaxed'>{desc}</p>
        </div>
    )
}

const ReviewCard = ({ name, role, content, rating }) => {
    return (
        <div className='p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
            <div className='flex gap-1 mb-4'>
                {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
            </div>
            <p className='text-gray-700 mb-6 italic'>"{content}"</p>
            <div>
                <h4 className='font-bold text-gray-900'>{name}</h4>
                <p className='text-sm text-gray-500'>{role}</p>
            </div>
        </div>
    )
}

export default LandingPage
