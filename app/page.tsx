// app/page.tsx
"use client";

import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
    const [numDigits, setNumDigits] = useState<string>("7");
    const [minValue, setMinValue] = useState<string>("0");
    const [maxValue, setMaxValue] = useState<string>("9");
    const [duplicateOption, setDuplicateOption] = useState<string>('allow_duplicates');
    const [generatedOutput, setGeneratedOutput] = useState<string>("Tekan 'Generate Angka' untuk memulai");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showTopRightCopy, setShowTopRightCopy] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const isErrorMessage = [
            "Tekan 'Generate Angka' untuk memulai",
            "Jumlah angka yang digenerate harus lebih dari 0.",
            "Nilai minimum tidak boleh lebih besar dari nilai maksimum.",
            "Input tidak valid. Harap masukkan angka untuk semua field.",
            "Tidak bisa menghasilkan angka unik sebanyak itu. Rentang terlalu kecil."
        ].includes(generatedOutput.trim());
        setShowTopRightCopy(!isErrorMessage);

        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme === 'dark') {
                setIsDarkMode(true);
                document.documentElement.classList.add('dark');
            } else if (storedTheme === 'light') {
                setIsDarkMode(false);
                document.documentElement.classList.remove('dark');
            } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setIsDarkMode(true);
                document.documentElement.classList.add('dark');
            }
        }
    }, [generatedOutput]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

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
        let copiedSuccessfully = false;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
                copiedSuccessfully = true;
            } else {
                throw new Error("Clipboard API tidak tersedia.");
            }
        } catch (_err) {
            console.warn("Gagal menyalin menggunakan Clipboard API, mencoba fallback:", _err);
            try {
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();

                copiedSuccessfully = document.execCommand('copy');
                document.body.removeChild(textarea);
            } catch (fallbackErr) {
                console.error("Gagal menyalin menggunakan metode fallback:", fallbackErr);
                alert('Gagal menyalin angka. Silakan salin manual.');
            }
        }

        if (copiedSuccessfully) {
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
        <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: 'var(--background)', color: 'var(--foreground)'}}>
            <Head>
                <title>Generator Angka</title>
                <link rel="icon" href="data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23f9f9f9'/%3E%3Cg fill='%23374151'%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3Ccircle cx='70' cy='70' r='10'/%3E%3C/g%3E%3C/svg%3E" type="image/svg+xml" />
            </Head>

            <div className="fixed-dark-mode-switch">
                <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer relative">
                    <input
                        type="checkbox"
                        id="darkModeToggle"
                        className="sr-only"
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                    />
                    <div className="toggle-bg relative bg-gray-300 w-14 h-8 rounded-full shadow-inner transition-colors duration-300 ease-in-out">
                        <div className="toggle-circle absolute w-6 h-6 bg-white rounded-full shadow inset-y-1 left-1 flex items-center justify-center transition-transform duration-300 ease-in-out">
                            <svg className="h-4 w-4 text-gray-700 moon-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
                            </svg>
                            <svg className="h-4 w-4 text-yellow-500 sun-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h1M3 12H2m8.003-7.5l-.707.707M19.003 19.003l-.707-.707M3.75 4.75l.707-.707M20.25 19.25l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </label>
            </div>

            <div className="p-8 rounded-lg shadow-md w-full max-w-2xl" style={{backgroundColor: 'var(--card-background)', borderColor: 'var(--card-border)'}}>
                <h1 className="text-2xl font-bold text-center mb-6" style={{color: 'var(--text-primary)'}}>Generator Angka Acak</h1>

                <form onSubmit={generateNumbers} className="space-y-4">
                    <div>
                        <label htmlFor="num_digits" className="block text-sm font-medium mb-1" style={{color: 'var(--text-primary)'}}>Jumlah Angka yang Dihasilkan:</label>
                        <input
                            type="number"
                            id="num_digits"
                            name="num_digits"
                            min="1"
                            required
                            value={numDigits}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumDigits(e.target.value)}
                            className="py-2 px-3 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            style={{
                                borderColor: 'var(--input-border)',
                                color: 'var(--input-text)',
                                backgroundColor: 'var(--card-background)'
                            }}
                        />
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                        <span className="block text-sm font-medium" style={{color: 'var(--text-primary)'}}>Tipe Angka:</span>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="allow_duplicates"
                                name="duplicate_option"
                                value="allow_duplicates"
                                checked={duplicateOption === 'allow_duplicates'}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuplicateOption(e.target.value)}
                                className="shrink-0 mt-0.5 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                style={{
                                    borderColor: 'var(--input-border)'
                                }}
                            />
                            <label htmlFor="allow_duplicates" className="text-sm ms-2" style={{color: 'var(--text-primary)'}}>Izinkan Duplikat</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="unique_numbers"
                                name="duplicate_option"
                                value="unique_numbers"
                                checked={duplicateOption === 'unique_numbers'}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuplicateOption(e.target.value)}
                                className="shrink-0 mt-0.5 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                style={{
                                    borderColor: 'var(--input-border)'
                                }}
                            />
                            <label htmlFor="unique_numbers" className="text-sm ms-2" style={{color: 'var(--text-primary)'}}>Angka Unik</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="min_value" className="block text-sm font-medium mb-1" style={{color: 'var(--text-primary)'}}>Nilai Minimum per Angka:</label>
                            <input
                                type="number"
                                id="min_value"
                                name="min_value"
                                required
                                value={minValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinValue(e.target.value)}
                                className="py-2 px-3 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                style={{
                                    borderColor: 'var(--input-border)',
                                    color: 'var(--input-text)',
                                    backgroundColor: 'var(--card-background)'
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="max_value" className="block text-sm font-medium mb-1" style={{color: 'var(--text-primary)'}}>Nilai Maksimum per Angka:</label>
                            <input
                                type="number"
                                id="max_value"
                                name="max_value"
                                required
                                value={maxValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxValue(e.target.value)}
                                className="py-2 px-3 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                style={{
                                    borderColor: 'var(--input-border)',
                                    color: 'var(--input-text)',
                                    backgroundColor: 'var(--card-background)'
                                }}
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

                <div className="mt-6 p-4 rounded-lg text-center relative"
                    style={{
                        backgroundColor: 'var(--blue-bg-light)',
                        borderColor: 'var(--blue-border-light)',
                        color: 'var(--blue-text-dark)'
                    }}>
                    <h2 className="text-xl font-semibold mb-2">Angka Dihasilkan:</h2>
                    <p id="generatedNumberDisplay" className="text-3xl font-extrabold mb-4" style={{color: 'var(--blue-text-super-dark)'}}>
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
                        className={`py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent hover:bg-gray-300 cursor-pointer ${isCopyButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{
                            backgroundColor: 'var(--gray-button-bg)',
                            color: 'var(--gray-button-text)'
                        }}
                    >
                        Salin Angka
                    </button>
                </div>
            </div>
            <Analytics />
            <SpeedInsights />
        </div>
    );
}