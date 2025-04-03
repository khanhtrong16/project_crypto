"use client";
import { cryptoCoins, GetCandles, GetCryptoInfo, GetPrice1MinuteAgo } from "@/lib/api-binance";
import { CandleData, PriceData } from "@/types/interfaces";
import { createChart, CandlestickSeries, HistogramSeries, UTCTimestamp, IChartApi, ISeriesApi } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { times } from "@/lib/api-binance";
import ChartSection from "./ChartSection";
import SideBar from "./sidebar";

export default function Chart() {
    const [time, setTime] = useState("1h");
    const [cryptoName, setCrytoName] = useState<string>("BTCUSDT");
    const [datas, setDatas] = useState<CandleData[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const [prices, SetPrices] = useState<PriceData>({ current: 0, oneMinuteAgo: 0 });
    const [darkMode, setDarkMode] = useState<boolean>(true);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const chartContainer = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeries = useRef<ISeriesApi<"Candlestick">>(null);
    const volumeSeries = useRef<ISeriesApi<"Histogram">>(null);

    // hàm xử lí lấy dữ liệu từ api
    useEffect(() => {
        const fetchCandles = async () => {
            const fetchedData = await GetCandles(time, cryptoName);
            if (fetchedData.length > 0) {
                setDatas(fetchedData);
            }
        };
        fetchCandles();
    }, [time, cryptoName]);

    // Tạo chart và các series
    useEffect(() => {
        //kiểm tra xem chartContainer có tồn tại hay không -> nếu không thì return
        if (!chartContainer.current) return;

        //kiểm tra xem chartRef có tồn tại hay không -> nếu không thì tạo chart mới
        if (!chartRef.current) {
            chartRef.current = createChart(chartContainer.current, {});
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
        }

        // nếu chartRef đã tồn tại thì cập nhật options cho chart
        chartRef.current.applyOptions({
            layout: {
                background: { color: darkMode ? "#131722" : "#F1F5F9" },
                textColor: darkMode ? "#d1d4dc" : "#000000",
            },
            grid: {
                vertLines: { color: darkMode ? "#1e222d" : "#e0e0e0" },
                horzLines: { color: darkMode ? "#1e222d" : "#e0e0e0" },
            },
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
        // nếu chartRef đã tồn tại thì cập nhật dữ liệu cho chart
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

    // hàm xử lí nhận sự kiện khi người dùng thay đổi kích thước trang web với chart
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

    //hàm xử lí lấy giá hiện tại và giá 1 phút trước
    useEffect(() => {
        const getPrices = async () => {
            const priceCurrent = await GetCryptoInfo(cryptoName);
            const current = parseFloat(priceCurrent.data.lastPrice);

            const priceOneMinute = await GetPrice1MinuteAgo(cryptoName);
            const oneMinuteAgo = parseFloat(priceOneMinute?.toString() ?? "0");
            SetPrices({ current, oneMinuteAgo });
        };
        getPrices();
    }, [show, cryptoName]);

    //Hàm xử lí hiển thị giá hiện tại và giá 1 phút trước
    const handlePrice = () => {
        setShow(!show);
    };

    //hàm xử lí chuyển đổi giao diện sáng tối
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // hàm xử lí mở và đóng menu nav khi ở chế độ mobile
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };
    return (
        <div
            className={`w-full min-h-screen flex flex-col lg:flex-row p-3 sm:p-4 lg:p-5 gap-4 transition-colors duration-300 ${
                darkMode ? "bg-black text-amber-50" : "bg-white text-black"
            }`}
        >
            {/* Phần bên trái */}
            <div className="w-full lg:w-3/4 xl:w-4/5 flex gap-2 flex-col">
                <div
                    className={`px-3 py-4 sm:py-3 w-full flex flex-wrap justify-between items-center gap-3
                    ${darkMode ? "bg-[#131722]" : "bg-[#F1F5F9]"}
                    rounded-t-lg shadow-sm transition-colors duration-300`}
                >
                    <strong className="text-lg sm:text-xl font-bold">{cryptoName}</strong>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2.5 rounded-md transition-colors duration-200 ${
                                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {darkMode ? <FaMoon size={18} /> : <FaSun size={18} />}
                        </button>
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={`p-2.5 w-32 rounded-md border-2 hover:border-gray-400 focus:outline-none transition-all duration-200 ${
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

                {/* biểu đồ chart */}
                <ChartSection chartContainer={chartContainer} datas={datas} darkMode={darkMode} />
            </div>

            {/* Phần thanh bên phải */}
            <SideBar
                cryptoCoins={cryptoCoins}
                cryptoName={cryptoName}
                setCryptoName={setCrytoName}
                darkMode={darkMode}
                isNavOpen={isNavOpen}
                toggleNav={toggleNav}
                handlePrice={handlePrice}
                show={show}
                prices={prices}
            />
        </div>
    );
}
