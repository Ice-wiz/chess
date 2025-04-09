

export const Button = ({onClick, children}:{onClick:()=>void, children: React.ReactNode}) => {
    return (
        <button
        onClick={onClick}
        className="px-8 py-4 text-2xl bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out font-bold max-w-md">
            {children}
        </button>
    )
}