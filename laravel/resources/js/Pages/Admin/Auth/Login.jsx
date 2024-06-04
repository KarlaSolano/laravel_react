import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid';

import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.login.store'));
    };

    return (
        <GuestLayout>
            <Head title="Admin" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <p className='text-2xl text-center'>
            {' '}Login Admin
            </p>
        
            <form  onSubmit={submit}>
                <div>                
                    <InputLabel  htmlFor="name" value="Nombre" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full text-gray-800"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        icon={UserIcon}  // Pasa el ícono como un prop
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        icon={LockClosedIcon }  // Pasa el ícono como un prop
                        className="mt-1 block w-full text-gray-800"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600"></span>
                        Recuerdame
                    </label>                    
                </div>

                <div className="flex items-center justify-end mt-4">
                     
                    {/* <Link
                        href={route('admin.register')}
                        className="ms-4 inline-flex items-center px-4 py-2 underline decoration-solid"
                    >
                        Registrar
                    </Link>
 */}
                    <PrimaryButton className="ms-4 inline-flex items-center px-4 py-2 bg-gray-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-600 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150" disabled={processing}>
                        Iniciar Sesión
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
