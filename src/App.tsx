import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Module: {
      ccall: (name: string, returnType: string, argTypes: string[], args: any[]) => any;
    };
  }
}

function App() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('z');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/algorithms.js';
    script.async = true;
    script.onload = () => setIsLoading(false);
    script.onerror = () => setError('Failed to load WebAssembly module');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const runAlgorithm = () => {
    if (isLoading) return;

    try {
      let result;
      switch (algorithm) {
        case 'z':
          result = window.Module.ccall('z_algorithm', 'string', ['string'], [input]);
          break;
        case 'manacher':
          result = window.Module.ccall('manacher', 'string', ['string'], [input]);
          break;
        case 'kmp':
          const [text, pattern] = input.split(',').map(s => s.trim());
          result = window.Module.ccall('kmp', 'string', ['string', 'string'], [text, pattern]);
          break;
        case 'lcs':
          const [s1, s2] = input.split(',').map(s => s.trim());
          result = window.Module.ccall('lcs', 'string', ['string', 'string'], [s1, s2]);
          break;
        default:
          setError('Invalid algorithm selected');
          return;
      }
      setResult(result);
      setError('');
    } catch (err) {
      setError('Error running algorithm: ' + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">C++ Algorithms with WebAssembly</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Select Algorithm</label>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  >
                    <option value="z">Z Algorithm</option>
                    <option value="manacher">Manacher's Algorithm</option>
                    <option value="kmp">KMP Algorithm</option>
                    <option value="lcs">LCS Algorithm</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Input</label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={algorithm === 'kmp' || algorithm === 'lcs' ? "text, pattern" : "Enter string"}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={runAlgorithm}
                    disabled={isLoading}
                    className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                  >
                    {isLoading ? 'Loading...' : 'Run Algorithm'}
                  </button>
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-red-500">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}
                {result && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900">Result:</h3>
                    <p className="mt-2 text-sm text-gray-500">{result}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;