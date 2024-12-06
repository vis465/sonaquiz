import React from 'react'

const Button = ({
    type = 'button',
    className = '',
    disabled = false,
    children,
    active = true,
    onClick = () => { }
}) => {
    return (
        <button
        onClick={onClick}
            disabled={disabled}
            className={`w-full ${active ? "  text-white text-4xl px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700" : " text-white text-4xl px-6 py-3 rounded-md bg-red-600 hover:bg-red-700"} transiiton-all duration-300 py-1 px-3 rounded-lg text-sm ${className}`}
            type={type}>{children}</button>

    )
}
                
export default Button