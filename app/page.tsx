// app/page.tsx
"use client";

import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react" // Impor Analytics
import { SpeedInsights } from "@vercel/speed-insights/next" // Impor SpeedInsights

export default function Home() {
    const [numDigits, setNumDigits] = useState<string>("7");
    const [minValue, setMinValue] = useState<string>("0");
    const [maxValue, setMaxValue] = useState<string>("9");
    const [duplicateOption, setDuplicateOption] = useState<string>('allow_duplicates');
    const [generatedOutput, setGeneratedOutput] = useState<string>("Tekan 'Generate Angka' untuk memulai");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showTopRightCopy, setShowTopRightCopy] = useState<boolean>(false);

    useEffect(() => {
        const isErrorMessage = [
            "Tekan 'Generate Angka' untuk memulai",
            "Jumlah angka yang digenerate harus lebih dari 0.",
            "Nilai minimum tidak boleh lebih besar dari nilai maksimum.",
            "Input tidak valid. Harap masukkan angka untuk semua field.",
            "Tidak bisa menghasilkan angka unik sebanyak itu. Rentang terlalu kecil."
        ].includes(generatedOutput.trim());
        setShowTopRightCopy(!isErrorMessage);
    }, [generatedOutput]);

    const generateNumbers = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setGeneratedOutput("");

        setTimeout(() => {
            try {
                const count = parseInt(numDigits);
                const min = parseInt(minValue);
                const max = parseInt(maxValue);

                if (isNaN(count) || isNaN(min) || isNaN(max)) {
                    setGeneratedOutput("Input tidak valid. Harap masukkan angka untuk semua field.");
                    return;
                }

                if (count <= 0) {
                    setGeneratedOutput("Jumlah angka yang digenerate harus lebih dari 0.");
                    return;
                }

                if (min > max) {
                    setGeneratedOutput("Nilai minimum tidak boleh lebih besar dari nilai maksimum.");
                    return;
                }

                const numbers: number[] = [];
                if (duplicateOption === 'allow_duplicates') {
                    for (let i = 0; i < count; i++) {
                        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
                    }
                } else {
                    if (count > (max - min + 1)) {
                        setGeneratedOutput(`Tidak bisa menghasilkan ${count} angka unik dalam rentang ${min}-${max}. Rentang terlalu kecil.`);
                        return;
                    }
                    const possibleNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
                    while (numbers.length < count) {
                        const randomIndex = Math.floor(Math.random() * possibleNumbers.length);
                        const selectedNumber = possibleNumbers.splice(randomIndex, 1)[0];
                        numbers.push(selectedNumber);
                    }
                }

                let outputString: string;
                if (max > 9 || min < 0) {
                    outputString = numbers.join(" ");
                } else {
                    outputString = numbers.join("");
                }
                setGeneratedOutput(outputString);

            } catch (_error) {
                setGeneratedOutput("Terjadi kesalahan saat menghasilkan angka.");
                console.error("Error saat menghasilkan angka:", _error);
            } finally {
                setIsLoading(false);
            }
        }, 300);
    };

    const copyTextToClipboard = async (textToCopy: string, targetButtonId: string) => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            if (targetButtonId === 'copyButton') {
                const button = document.getElementById('copyButton') as HTMLElement;
                if (button) {
                    button.textContent = 'Berhasil Disalin!';
                    setTimeout(() => {
                        button.textContent = 'Salin Angka';
                    }, 2000);
                }
            } else if (targetButtonId === 'topRightCopyButton') {
                const button = document.getElementById('topRightCopyButton') as HTMLElement;
                if (button) {
                    button.classList.add('copied');
                    const tooltip = button.querySelector('.copy-tooltip') as HTMLElement;
                    if (tooltip) {
                        tooltip.textContent = 'Disalin!';
                        tooltip.style.opacity = '1';
                    }
                    setTimeout(() => {
                        button.classList.remove('copied');
                        if (tooltip) {
                            tooltip.textContent = 'Salin Angka';
                            tooltip.style.opacity = '0';
                        }
                    }, 2000);
                }
            }
        } catch (_err) {
            alert('Gagal menyalin angka. Silakan salin manual.');
        }
    };

    const isCopyButtonDisabled = [
        "Tekan 'Generate Angka' untuk memulai",
        "Jumlah angka yang digenerate harus lebih dari 0.",
        "Nilai minimum tidak boleh lebih besar dari nilai maksimum.",
        "Input tidak valid. Harap masukkan angka untuk semua field.",
        "Tidak bisa menghasilkan angka unik sebanyak itu. Rentang terlalu kecil."
    ].includes(generatedOutput.trim());

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <Head>
                <title>Generator Angka</title>
                <link rel="icon" href="data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23f9f9f9'/%3E%3Cg fill='%23374151'%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3Ccircle cx='70' cy='70' r='10'/%3E%3C/g%3E%3C/svg%3E" type="image/svg+xml" />
            </Head>

            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h1 className="text-2xl font-bold text-center mb-6">Generator Angka Acak</h1>

                <form onSubmit={generateNumbers} className="space-y-4">
                    <div>
                        <label htmlFor="num_digits" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Angka yang Dihasilkan:</label>
                        <input
                            type="number"
                            id="num_digits"
                            name="num_digits"
                            min="1"
                            required
                            value={numDigits}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumDigits(e.target.value)}
                            className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none hs-dark-mode-active:bg-slate-900 hs-dark-mode-active:border-gray-700 hs-dark-mode-active:text-gray-400 hs-dark-mode-active:placeholder:text-gray-500 hs-dark-mode-active:focus:ring-gray-600"
                        />
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                        <span className="block text-sm font-medium text-gray-700">Tipe Angka:</span>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="allow_duplicates"
                                name="duplicate_option"
                                value="allow_duplicates"
                                checked={duplicateOption === 'allow_duplicates'}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuplicateOption(e.target.value)}
                                className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none hs-dark-mode-active:bg-slate-900 hs-dark-mode-active:border-gray-700 hs-dark-mode-active:checked:bg-blue-500 hs-dark-mode-active:checked:border-blue-500 hs-dark-mode-active:focus:ring-offset-gray-800"
                            />
                            <label htmlFor="allow_duplicates" className="text-sm text-gray-700 ms-2">Izinkan Duplikat</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="unique_numbers"
                                name="duplicate_option"
                                value="unique_numbers"
                                checked={duplicateOption === 'unique_numbers'}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuplicateOption(e.target.value)}
                                className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none hs-dark-mode-active:bg-slate-900 hs-dark-mode-active:border-gray-700 hs-dark-mode-active:checked:bg-blue-500 hs-dark-mode-active:checked:border-blue-500 hs-dark-mode-active:focus:ring-offset-gray-800"
                            />
                            <label htmlFor="unique_numbers" className="text-sm text-gray-700 ms-2">Angka Unik</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="min_value" className="block text-sm font-medium text-gray-700 mb-1">Nilai Minimum per Angka:</label>
                            <input
                                type="number"
                                id="min_value"
                                name="min_value"
                                required
                                value={minValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinValue(e.target.value)}
                                className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none hs-dark-mode-active:bg-slate-900 hs-dark-mode-active:border-gray-700 hs-dark-mode-active:text-gray-400 hs-dark-mode-active:placeholder:text-gray-500 hs-dark-mode-active:focus:ring-gray-600"
                            />
                        </div>
                        <div>
                            <label htmlFor="max_value" className="block text-sm font-medium text-gray-700 mb-1">Nilai Maksimum per Angka:</label>
                            <input
                                type="number"
                                id="max_value"
                                name="max_value"
                                required
                                value={maxValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxValue(e.target.value)}
                                className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none hs-dark-mode-active:bg-slate-900 hs-dark-mode-active:border-gray-700 hs-dark-mode-active:text-gray-400 hs-dark-mode-active:placeholder:text-gray-500 hs-dark-mode-active:focus:ring-gray-600"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        id="generateButton"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span id="buttonText">{isLoading ? 'Memproses...' : 'Generate Angka'}</span>
                        {isLoading && (
                            <span id="loadingSpinner">
                                <svg className="animate-spin-slow h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-center relative">
                    <h2 className="text-xl font-semibold mb-2">Angka Dihasilkan:</h2>
                    <p id="generatedNumberDisplay" className="text-3xl font-extrabold text-blue-900 mb-4">
                        {isLoading ? (
                            <span>Memproses...</span>
                        ) : (
                            generatedOutput
                        )}
                    </p>

                    {showTopRightCopy && (
                        <button id="topRightCopyButton" className="top-right-copy-button cursor-pointer" onClick={() => copyTextToClipboard(generatedOutput, 'topRightCopyButton')}>
                            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7 4a2 2 0 012-2h6a2 2 0 012 2v1H7V4zm-2 2a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-1h2a2 2 0 002-2V8a2 2 0 00-2-2H9v1H5V6zm0 2h10v10H5V8zm2 0h6v6H7V8z" clipRule="evenodd" />
                            </svg>
                            <span className="copy-tooltip">Salin Angka</span>
                        </button>
                    )}

                    <button
                        id="copyButton"
                        onClick={() => copyTextToClipboard(generatedOutput, 'copyButton')}
                        disabled={isCopyButtonDisabled}
                        className={`py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer ${isCopyButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Salin Angka
                    </button>
                </div>
            </div>
            {/* Tambahkan komponen Analytics dan SpeedInsights di sini */}
            <Analytics />
            <SpeedInsights />
        </div>
    );
}