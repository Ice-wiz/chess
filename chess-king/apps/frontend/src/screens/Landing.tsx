import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#0f3d2e] to-[#183d3d] flex items-center justify-center font-sans text-white">
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Right Section - Image */}
                <div className="h-full w-full flex items-center justify-center p-6 md:p-12">
                    <img
                        src="/chess-board.jpeg"
                        alt="Chess Board"
                        className="rounded-xl shadow-2xl w-full h-auto object-cover max-h-[500px] border border-green-900"
                    />
                </div>
                {/* Left Section - Text */}
                <div className="flex flex-col justify-center px-8 py-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                        Welcome to Chess Arena
                    </h1>
                    <p className="text-xl text-gray-200 mb-8 max-w-md">
                        Play online chess with friends or match up with players from around the world. Smooth, sleek, and strategy-packed.
                    </p>
                   <Button onClick={() => navigate("/game")}>
                    Play Online
                   </Button>
                </div>
            </div>
        </div>
    );
};
