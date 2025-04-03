"use client";
import { cryptoCoins, GetCandles, GetCryptoInfo, GetPrice1MinuteAgo } from "@/lib/api-binance";
import { CandleData, PriceData } from "@/types/interfaces";
import { createChart, CandlestickSeries, HistogramSeries, UTCTimestamp, IChartApi, ISeriesApi } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { FaMoon, FaSun, FaBars } from "react-icons/fa";

export default function Chart() {
    const times = [
        { value: "1m", label: "1 Minute" },
        { value: "5m", label: "5 Minutes" },
        { value: "15m", label: "15 Minutes" },
        { value: "30m", label: "30 Minutes" },
        { value: "1h", label: "1 Hour" },
        { value: "4h", label: "4 Hours" },
        { value: "1d", label: "1 Day" },
        { value: "1w", label: "1 Week" },
    ];
    const [time, setTime] = useState("1h");
    const [crtytoName, setCrytoName] = useState<string>("BTCUSDT");
    const [datas, setDatas] = useState<CandleData[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const [prices, SetPrices] = useState<PriceData>({ current: 0, oneMinuteAgo: 0 });
    const [darkMode, setDarkMode] = useState<boolean>(true);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const chartContainer = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeries = useRef<ISeriesApi<"Candlestick">>(null);
    const volumeSeries = useRef<ISeriesApi<"Histogram">>(null);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    useEffect(() => {
        const fetchCandles = async () => {
            const fetchedData = await GetCandles(time, crtytoName);
            if (fetchedData.length > 0) {
                setDatas(fetchedData);
            }
        };
        fetchCandles();
    }, [time, crtytoName]);

    useEffect(() => {
        if (!chartContainer.current) return;

        if (!chartRef.current) {
            chartRef.current = createChart(chartContainer.current, {
                layout: {
                    background: { color: darkMode ? "#131722" : "#FFFFFF" },
                    textColor: darkMode ? "#d1d4dc" : "#000000",
                },
                grid: {
                    vertLines: { color: darkMode ? "#1e222d" : "#e0e0e0" },
                    horzLines: { color: darkMode ? "#1e222d" : "#e0e0e0" },
                },
            });

            candlestickSeries.current = chartRef.current.addSeries(CandlestickSeries, {
                upColor: "#26a69a",
                downColor: "#ef5350",
                borderVisible: false,
                wickUpColor: "#26a69a",
                wickDownColor: "#ef5350",
            });

            volumeSeries.current = chartRef.current.addSeries(HistogramSeries, {
                priceScaleId: "volume",
                color: "#26a69a",
                priceFormat: { type: "volume" },
            });

            volumeSeries.current.priceScale().applyOptions({
                scaleMargins: { top: 0.8, bottom: 0 },
            });

            candlestickSeries.current.priceScale().applyOptions({
                scaleMargins: { top: 0.2, bottom: 0.3 },
            });

            chartRef.current.timeScale().applyOptions({
                rightOffset: 10,
                timeVisible: true,
                secondsVisible: false,
            });

            chartRef.current.applyOptions({
                crosshair: {
                    mode: 0,
                    vertLine: {
                        color: "#6A5ACD",
                        width: 1,
                        style: 1,
                        visible: true,
                        labelVisible: true,
                    },
                    horzLine: {
                        color: "#6A5ACD",
                        width: 1,
                        style: 1,
                        visible: true,
                        labelVisible: true,
                    },
                },
            });
        } else {
            chartRef.current.applyOptions({
                layout: {
                    background: { color: darkMode ? "#131722" : "#F1F5F9" },
                    textColor: darkMode ? "#d1d4dc" : "#000000",
                },
                grid: {
                    vertLines: { color: darkMode ? "#1e222d" : "#e0e0e0" },
                    horzLines: { color: darkMode ? "#1e222d" : "#e0e0e0" },
                },
            });
        }

        if (datas.length > 0 && candlestickSeries.current && volumeSeries.current) {
            candlestickSeries.current.setData(
                datas.map((item) => ({
                    time: (item.openTime / 1000) as UTCTimestamp,
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                }))
            );
            volumeSeries.current.setData(
                datas.map((item) => ({
                    time: (item.openTime / 1000) as UTCTimestamp,
                    value: item.volume,
                    color: item.close > item.open ? "#26a69a" : "#ef5350",
                }))
            );
        }
    }, [datas, darkMode]);

    useEffect(() => {
        const resizeChart = () => {
            if (chartRef.current && chartContainer.current) {
                const width = chartContainer.current.clientWidth;
                const height = chartContainer.current.clientHeight;
                if (typeof width === "number" && typeof height === "number") {
                    chartRef.current.resize(width, height);
                }
            }
        };
        window.addEventListener("resize", resizeChart);
        return () => {
            window.removeEventListener("resize", resizeChart);
        };
    }, []);
    useEffect(() => {
        const getPrices = async () => {
            const priceCurrent = await GetCryptoInfo(crtytoName);
            const current = parseFloat(priceCurrent.data.lastPrice);

            const priceOneMinute = await GetPrice1MinuteAgo(crtytoName);
            const oneMinuteAgo = parseFloat(priceOneMinute?.toString() ?? "0");
            SetPrices({ current, oneMinuteAgo });
            // const oneMinuteAgo = parseFloat(priceOneMinute);
            SetPrices({ current, oneMinuteAgo });
        };
        getPrices();
    }, [show, crtytoName]);

    const handlePrice = () => {
        setShow(!show);
    };
    const toggleDarkMode = () => {
        const currentMode = localStorage.getItem("darkMode");
        setDarkMode(currentMode);
    };

    if (darkMode === null) {
        return <div>Loading...</div>; // Đảm bảo rằng trạng thái darkMode được đặt sau khi client đã hydrat hóa
    }
    return (
        <div
            className={`w-full min-h-screen flex flex-col lg:flex-row p-3 sm:p-4 lg:p-5 gap-4 transition-colors duration-300 ${
                darkMode ? "bg-black text-amber-50" : "bg-white text-black"
            }`}
        >
            <div className="w-full lg:w-3/4 xl:w-4/5 flex gap-2 flex-col">
                <div
                    className={`px-3 py-4 sm:py-3 w-full flex flex-wrap justify-between items-center gap-3
                    ${darkMode ? "bg-[#131722]" : "bg-[#F1F5F9]"}
                    rounded-t-lg shadow-sm transition-colors duration-300`}
                >
                    <strong className="text-lg sm:text-xl font-bold">{crtytoName}</strong>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2.5 rounded-md transition-colors duration-200
                                     ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {darkMode ? <FaMoon size={18} /> : <FaSun size={18} />}
                        </button>
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={`p-2.5 w-28 rounded-md border-2 hover:border-gray-400 focus:outline-none transition-all duration-200
                                        ${
                                            darkMode
                                                ? "bg-gray-800 text-white border-gray-700 focus:border-sky-500"
                                                : "bg-white text-black border-gray-300 focus:border-sky-500"
                                        }`}
                            aria-label="Select time frame"
                        >
                            {times.map((item, index) => (
                                <option key={index} value={item.value} className={`${darkMode ? "bg-gray-800" : "bg-white"} p-2`}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
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
            </div>
            <div
                className={`w-full lg:w-1/4 xl:w-1/5 rounded-lg flex flex-col ${
                    darkMode ? "bg-[#131722]" : "bg-[#F1F5F9]"
                } shadow-sm transition-colors duration-300`}
            >
                <div className="p-4 flex-grow">
                    <div
                        onClick={toggleNav}
                        className={`flex justify-between items-center mb-3 cursor-pointer lg:cursor-default ${
                            darkMode ? "text-white" : "text-black"
                        }`}
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
                        {cryptoCoins.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => setCrytoName(item.cryptoName)}
                                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-200 ${
                                    crtytoName === item.cryptoName
                                        ? darkMode
                                            ? "bg-gray-700"
                                            : "bg-gray-300"
                                        : darkMode
                                        ? "hover:bg-gray-800"
                                        : "hover:bg-gray-200"
                                }`}
                            >
                                <img
                                    className="w-7 h-7 rounded-full object-cover"
                                    src={item.cryptoImage || "/placeholder.svg"}
                                    alt={item.cryptoName}
                                />
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
        </div>
    );
}
