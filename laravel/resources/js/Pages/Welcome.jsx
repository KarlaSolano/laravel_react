import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
};

    return (
        <>
            <Head title="Inicio" />
            <div className="bg-gradient-to-r from-indigo-200 from-25% text-black/50 dark:bg-black dark:text-white/50">
               
                <div className="relative min-h-screen flex flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">                      
                    
                    <header>
                    <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.web ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard User
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="ms-4 inline-flex items-center px-4 py-2 bg-blue-300 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-400 active:bg-blue-400 focus:outline-none focus:border-blue-400 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                        >
                                            INICIAR SESIÓN USER
                                        </Link>
                                        
                                    </>
                                )}

                                {auth.admin ? (
                                    
                                    <Link
                                        href="/admin/dashboard"
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                       Dashboard Admin
                                    </Link>
                                ) : (
                                    <>                                      

                                        <Link
                                        href="/admin/login"
                                        className="ms-4 inline-flex items-center px-4 py-2 bg-blue-300 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-400 active:bg-blue-400 focus:outline-none focus:border-blue-400 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        INICIAR SESIÓN ADMIN
                                    </Link>
                                        
                                    </>
                                )}
                             
                    </nav>
                    </header>
                        <main className="mt-1">
                            <div className="grid lg:grid-cols-1 p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300   focus:outline-none focus-visible:ring-[#FF2D20] md:row-span-3 lg:p-10 lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]">
                                                                
                               <div className="flex flex-col items-stretch gap-6 overflow-hidden bg-white p-6 ">

                                <div className="flex justify-center">
                                    <img className='animate-pulse' src="https://t3.ftcdn.net/jpg/03/39/70/90/360_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg" />
                                </div>

                               </div>
                              
                            </div>                            
                        </main>

                        <footer className="py-6 text-end text-sm text-gray dark:text-white/70">
                            Copyright © 2024
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
