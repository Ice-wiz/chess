


export const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <svg
            className="animate-spin h-10 w-10 text-gray-900 dark:text-gray-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            fill="none"
            strokeWidth="4"
            stroke="currentColor"
            />
            <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm2.5-2a6.5 6.5 0 1 0 13 0A6.5 6.5 0 0 0 6.5 10z"
            />
        </svg>
        <p className="mt-4 text-lg text-gray-900 dark:text-gray-100">Loading...</p>
        </div>
    );
}