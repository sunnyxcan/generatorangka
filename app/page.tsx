// app/page.tsx
'use client'; // This directive marks it as a Client Component

import { useState } from 'react';
import { FaCopy, FaSpinner } from 'react-icons/fa'; // Install react-icons: npm install react-icons

export default function Home() {
  const [numDigits, setNumDigits] = useState<number>(7);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(9);
  const [duplicateOption, setDuplicateOption] = useState<string>('allow_duplicates');
  const [generatedOutput, setGeneratedOutput] = useState<string>("Tekan 'Generate Angka' untuk memulai");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [topRightCopyStatus, setTopRightCopyStatus] = useState<'idle' | 'copied'>('idle');

  const isErrorMessage = [
    "Tekan 'Generate Angka' untuk memulai",
    "Jumlah angka yang digenerate harus lebih dari 0.",
    "Nilai minimum tidak boleh lebih besar dari nilai maksimum.",
    "Input tidak valid. Harap masukkan angka untuk semua field.",
    "Tidak bisa menghasilkan angka unik sebanyak itu. Rentang terlalu kecil."
  ].includes(generatedOutput.trim());

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedOutput("Memproses..."); // Show loading message immediately
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num_digits: numDigits,
          min_value: minValue,
          max_value: maxValue,
          duplicate_option: duplicateOption,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedOutput(data.generated_output);
      } else {
        setGeneratedOutput(data.error || "Terjadi kesalahan yang tidak diketahui.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setGeneratedOutput("Gagal menghubungi server. Periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyTextToClipboard = (textToCopy: string, type: 'main' | 'topRight') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          if (type === 'main') {
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
          } else {
            setTopRightCopyStatus('copied');
            setTimeout(() => setTopRightCopyStatus('idle'), 2000);
          }
        })
        .catch(_err => {
          alert('Gagal menyalin angka. Silakan salin manual.');
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      alert('Angka berhasil disalin! (Fallback)');
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Generator Angka Acak</h1>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label htmlFor="num_digits" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Angka yang Dihasilkan:</label>
            <input
              type="number"
              id="num_digits"
              name="num_digits"
              min="1"
              required
              value={numDigits}
              onChange={(e) => setNumDigits(parseInt(e.target.value, 10))}
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
                onChange={(e) => setDuplicateOption(e.target.value)}
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
                onChange={(e) => setDuplicateOption(e.target.value)}
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
                onChange={(e) => setMinValue(parseInt(e.target.value, 10))}
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
                onChange={(e) => setMaxValue(parseInt(e.target.value, 10))}
                className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none hs-dark-mode-active:bg-slate-900 hs-dark-mode-active:border-gray-700 hs-dark-mode-active:text-gray-400 hs-dark-mode-active:placeholder:text-gray-500 hs-dark-mode-active:focus:ring-gray-600"
              />
            </div>
          </div>

          <button
            type="submit"
            id="generateButton"
            disabled={isLoading}
            className={`w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span id="buttonText">{isLoading ? 'Memproses...' : 'Generate Angka'}</span>
            {isLoading && (
              <span id="loadingSpinner">
                <FaSpinner className="animate-spin h-5 w-5 text-white" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-center relative">
          <h2 className="text-xl font-semibold mb-2">Angka Dihasilkan:</h2>
          <p id="generatedNumberDisplay" className="text-3xl font-extrabold text-blue-900 mb-4">
            {generatedOutput}
          </p>

          {!isErrorMessage && generatedOutput !== "Memproses..." && (
            <button
              id="topRightCopyButton"
              className={`absolute top-2 right-2 p-2 rounded-md bg-transparent text-gray-600 hover:bg-gray-100 hover:text-blue-700 transition ${
                topRightCopyStatus === 'copied' ? 'text-green-500' : ''
              }`}
              onClick={() => copyTextToClipboard(generatedOutput.trim(), 'topRight')}
              aria-label="Salin Angka"
            >
              <FaCopy className="w-5 h-5" />
              <span className={`absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 transition-opacity duration-150 ${topRightCopyStatus === 'copied' ? 'opacity-100' : ''}`}>
                {topRightCopyStatus === 'copied' ? 'Disalin!' : 'Salin Angka'}
              </span>
            </button>
          )}
          
          <button
            id="copyButton"
            disabled={isErrorMessage || generatedOutput === "Memproses..."}
            onClick={() => copyTextToClipboard(generatedOutput.trim(), 'main')}
            className={`py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300 ${
              isErrorMessage || generatedOutput === "Memproses..." ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {copyStatus === 'copied' ? 'Berhasil Disalin!' : 'Salin Angka'}
          </button>
        </div>
      </div>
    </div>
  );
}