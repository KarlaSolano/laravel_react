import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-r from-indigo-200 from-25% text-black/50 dark:bg-black dark:text-white/50">
            <div>
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="w-full  sm:max-w-md mt-6 px-6 py-4 opacity-70 bg-gradient-to-r from-curret from-25%  shadow-md overflow-hidden sm:rounded-lg shadow-2xl">
                {children}
            </div>
        </div>
    );
}
