'use client';

import { useState, useEffect, useRef } from 'react';

export default function UpcScanner() {
    const [upcCode, setUpcCode] = useState('');
    const [scannedCodes, setScannedCodes] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const scanBufferRef = useRef('');
    const MAX_CODES = 5;

    // Auto-focus input field on component mount and handle scanner input
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Only process if we haven't reached max codes
            if (scannedCodes.length >= MAX_CODES) return;

            // If it's a number, add it to the buffer
            if (/^\d$/.test(e.key)) {
                scanBufferRef.current += e.key;
                setUpcCode(scanBufferRef.current);
            }
            // If it's Enter, process the buffer
            else if (e.key === 'Enter' && scanBufferRef.current) {
                e.preventDefault();
                const code = scanBufferRef.current;
                if (!scannedCodes.includes(code)) {
                    setScannedCodes(prev => [...prev, code]);
                }
                scanBufferRef.current = '';
                setUpcCode('');
            }
        };

        // Add the event listener
        window.addEventListener('keydown', handleKeyPress);
        inputRef.current?.focus();

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [scannedCodes]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (scannedCodes.length === MAX_CODES) {
            console.log('Submitting codes:', scannedCodes);
            // TODO: Handle submission of all codes
            setScannedCodes([]); // Clear the list after submission
            scanBufferRef.current = '';
            setUpcCode('');
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
                        readOnly
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