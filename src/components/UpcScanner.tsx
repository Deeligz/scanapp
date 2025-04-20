'use client';

import { useState, useEffect, useRef } from 'react';

export default function UpcScanner() {
    const [upcCode, setUpcCode] = useState('');
    const [scannedCodes, setScannedCodes] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const MAX_CODES = 5;

    // Auto-focus input field on component mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Keep focus on input field after each scan
    useEffect(() => {
        inputRef.current?.focus();
    }, [scannedCodes]);

    // Process input changes with debounce
    useEffect(() => {
        if (upcCode && /^\d+$/.test(upcCode)) {
            const timer = setTimeout(() => {
                processScannedCode(upcCode);
            }, 100); // Short delay to ensure we have the complete code

            return () => clearTimeout(timer);
        }
    }, [upcCode]);

    const processScannedCode = (code: string) => {
        if (code && scannedCodes.length < MAX_CODES && !scannedCodes.includes(code)) {
            setScannedCodes(prev => [...prev, code]);
            setUpcCode(''); // Clear input field after successful scan
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (scannedCodes.length === MAX_CODES) {
            console.log('Submitting codes:', scannedCodes);
            // TODO: Handle submission of all codes
            setScannedCodes([]); // Clear the list after submission
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Only allow digits
            setUpcCode(value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (upcCode) {
                processScannedCode(upcCode);
            }
        }
    };

    const removeCode = (index: number) => {
        setScannedCodes(prev => prev.filter((_, i) => i !== index));
        inputRef.current?.focus(); // Refocus input after removing a code
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label 
                        htmlFor="upc-input" 
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Scan UPC Code ({scannedCodes.length}/{MAX_CODES})
                    </label>
                    <input
                        ref={inputRef}
                        id="upc-input"
                        type="text"
                        value={upcCode}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Scan UPC code..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        autoComplete="off"
                    />
                </div>

                {/* List of scanned codes */}
                <div className="space-y-2">
                    {scannedCodes.map((code, index) => (
                        <div 
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                            <span className="font-mono">{code}</span>
                            <button
                                type="button"
                                onClick={() => removeCode(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={scannedCodes.length < MAX_CODES}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit {scannedCodes.length} Code{scannedCodes.length !== 1 ? 's' : ''}
                </button>
            </form>
        </div>
    );
} 