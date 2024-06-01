import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, icon: Icon, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <div className="relative rounded-md shadow-sm">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
            )}
            <input
                {...props}
                type={type}
                className={
                    `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${Icon ? 'pl-10' : ''} ` +
                    className
                }
                ref={input}
            />
        </div>
    );
});
