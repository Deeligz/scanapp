'use client';

import { useState, useEffect } from 'react';

export default function UpcScanner() {
    const [upcCode, setUpcCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scannedCodes, setScannedCodes] = useState<string[]>([]);
    const MAX_CODES = 5;

    useEffect(() => {
        let scanBuffer = '';
        let scanTimeout: NodeJS.Timeout;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent handling if we're in an input field
            if (e.target instanceof HTMLInputElement) {
                return;
            }

            // Start collecting scan data
            if (!isScanning) {
                setIsScanning(true);
            }

            // Clear the timeout on each keypress
            clearTimeout(scanTimeout);

            // Add character to buffer
            scanBuffer += e.key;

            // Set timeout to process the scan
            scanTimeout = setTimeout(() => {
                if (scanBuffer) {
                    // Process only if the buffer contains numbers
                    if (/^\d+$/.test(scanBuffer)) {
                        handleScan(scanBuffer);
                    }
                    scanBuffer = '';
                }
                setIsScanning(false);
            }, 50); // 50ms timeout assumes end of scan
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(scanTimeout);
        };
    }, [isScanning]);

    const handleScan = (scannedCode: string) => {
        if (scannedCodes.length < MAX_CODES && !scannedCodes.includes(scannedCode)) {
            setScannedCodes(prev => [...prev, scannedCode]);
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

    const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Only allow digits
            setUpcCode(value);
        }
    };

    const handleManualAdd = () => {
        if (upcCode && scannedCodes.length < MAX_CODES && !scannedCodes.includes(upcCode)) {
            setScannedCodes(prev => [...prev, upcCode]);
            setUpcCode(''); // Clear input field after adding
        }
    };

    const removeCode = (index: number) => {
        setScannedCodes(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label 
                        htmlFor="upc-input" 
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Enter UPC Code ({scannedCodes.length}/{MAX_CODES})
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="upc-input"
                            type="text"
                            value={upcCode}
                            onChange={handleManualInput}
                            placeholder="Scan or enter UPC code..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            pattern="[0-9]*"
                            inputMode="numeric"
                        />
                        <button
                            type="button"
                            onClick={handleManualAdd}
                            disabled={!upcCode || scannedCodes.length >= MAX_CODES}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {isScanning && (
                    <div className="text-sm text-blue-600 animate-pulse">
                        Scanning...
                    </div>
                )}

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