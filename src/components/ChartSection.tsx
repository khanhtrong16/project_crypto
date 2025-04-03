import React from "react";

export default function ChartSection({ chartContainer, datas, darkMode }: any) {
    return (
        <div
            className={`w-full flex-grow overflow-hidden border transition-colors duration-300 relative ${
                darkMode ? "border-gray-800" : "border-gray-200"
            } h-[400px] sm:h-[500px] md:h-[600px] lg:h-full rounded-b-lg`}
            ref={chartContainer}
        >
            {datas.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-100 dark:bg-gray-900">
                    <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
