import React from "react";
import { FaBars } from "react-icons/fa";

export default function SideBar({ cryptoCoins, cryptoName, setCryptoName, darkMode, isNavOpen, toggleNav, handlePrice, show, prices }: any) {
    return (
        <div
            className={`w-full lg:w-1/4 xl:w-1/5 rounded-lg flex flex-col ${
                darkMode ? "bg-[#131722]" : "bg-[#F1F5F9]"
            } shadow-sm transition-colors duration-300`}
        >
            <div className="p-4 flex-grow">
                <div
                    onClick={toggleNav}
                    className={`flex justify-between items-center mb-3 cursor-pointer lg:cursor-default ${darkMode ? "text-white" : "text-black"}`}
                >
                    <h2 className="text-lg font-semibold">Crypto List</h2>
                    <span className="lg:hidden">
                        <FaBars
                            className={`text-xl transition-colors duration-200 ${
                                darkMode ? "text-white hover:text-gray-400" : "text-black hover:text-gray-600"
                            }`}
                        />
                    </span>
                </div>
                <ul
                    className={`flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar transition-all duration-300 ${
                        isNavOpen ? "block" : "hidden"
                    } lg:block`}
                >
                    {cryptoCoins.map((item: any, index: number) => (
                        <li
                            key={index}
                            onClick={() => setCryptoName(item.cryptoName)}
                            className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-200 ${
                                cryptoName === item.cryptoName
                                    ? darkMode
                                        ? "bg-gray-700"
                                        : "bg-gray-300"
                                    : darkMode
                                    ? "hover:bg-gray-800"
                                    : "hover:bg-gray-200"
                            }`}
                        >
                            <img className="w-7 h-7 rounded-full object-cover" src={item.cryptoImage || "/placeholder.svg"} alt={item.cryptoName} />
                            <span className="font-medium">{item.cryptoName}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handlePrice}
                    className="w-full px-6 py-3.5 rounded-lg bg-sky-500 text-white font-bold hover:bg-sky-600 active:bg-sky-700 transition-colors duration-200 shadow-sm"
                >
                    Get Current Price
                </button>
                {show && (
                    <div
                        className={`flex flex-col gap-3 p-4 rounded-lg mt-4 ${
                            darkMode ? "bg-gray-800" : "bg-gray-200"
                        } transition-colors duration-300`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-sm sm:text-base">Current Price:</span>
                            <span className="font-bold text-base sm:text-lg">${prices.current?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm sm:text-base">One Minute Ago:</span>
                            <span className="font-bold text-base sm:text-lg">${prices.oneMinuteAgo?.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
