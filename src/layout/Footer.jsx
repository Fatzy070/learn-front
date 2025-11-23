import React from 'react';
import Info from '../data/Info';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaHeart, FaTwitter, FaLinkedin, FaGithub, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
    const { nav } = Info;
    const year = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-white dark:bg-gray-900 text-white relative ">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2%, transparent 0%), 
                                    radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2%, transparent 0%)`,
                    backgroundSize: '100px 100px'
                }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
             
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <FaGraduationCap size={32} className="text-purple-400" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <h1 className="learn text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                LearnHub
                            </h1>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Empowering minds through quality education. Your journey to knowledge starts here.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://x.com/fatzy_tech" className="p-2 bg-gray-800 hover:bg-purple-600 rounded-lg transition-all duration-300 transform hover:scale-110">
                                <FaTwitter className="text-gray-300 hover:text-white" />
                            </a>
                            <a href="www.linkedin.com/in/faruk-ogunsola-394815312" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-all duration-300 transform hover:scale-110">
                                <FaLinkedin className="text-gray-300 hover:text-white" />
                            </a>
                            <a href="https://github.com/Fatzy070" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-110">
                                <FaGithub className="text-gray-300 hover:text-white" />
                            </a>
                        </div>
                    </div>

                   
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                        <div className="space-y-3">
                            {nav.map((item, index) => (
                                <Link 
                                    key={index}
                                    to={item.path}
                                    className="block text-gray-300 hover:text-purple-300 transition-all duration-300 transform hover:translate-x-2 hover:font-medium"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Learning Paths</h3>
                        <div className="space-y-3">
                            <a href="#" className="block text-gray-300 hover:text-purple-300 transition-colors duration-300">
                                Web Development
                            </a>
                            <a href="#" className="block text-gray-300 hover:text-purple-300 transition-colors duration-300">
                                Data Science
                            </a>
                            <a href="#" className="block text-gray-300 hover:text-purple-300 transition-colors duration-300">
                                Mobile Development
                            </a>
                            <a href="#" className="block text-gray-300 hover:text-purple-300 transition-colors duration-300">
                                UI/UX Design
                            </a>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Get the latest courses and learning tips delivered to your inbox.
                        </p>
                        <div className="flex gap-2">
                            <input 
                                type="email" 
                                placeholder="Enter your email"
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 space-y-4 md:space-y-0 pt-8 md:flex  md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center text-start gap-2 text-gray-300">
                        <span>Made with</span>
                        <FaHeart className="text-red-500 animate-pulse" />
                        <span>by Ogunsola Faruk aka Fatzy</span>
                    </div>
                    
                    <div className="text-gray-300 text-sm">
                        © {year} LearnHub. All rights reserved. 
                        <span className="text-purple-300 ml-2">Building the future of education</span>
                    </div>

                    {/* Scroll to Top */}
                    <section className='flex justify-center'>
                        <button 
                        onClick={scrollToTop}
                        className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 group"
                    >
                        <FaArrowUp className="text-white group-hover:animate-bounce" />
                    </button>
                    </section>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-overlay filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-blue-500 rounded-full mix-blend-overlay filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </footer>
    );
};

export default Footer;