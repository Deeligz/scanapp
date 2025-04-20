'use client';

import { useState, useEffect } from 'react';

export default function UpcScanner() {
    const [upcCode, setUpcCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);

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
                        setUpcCode(scanBuffer);
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
    }, [isScanning]); // Only re-run if isScanning changes

    const handleScan = (scannedCode: string) => {
        console.log('Scanned code:', scannedCode);
        // TODO: Handle the scanned code (e.g., API call, state update, etc.)
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleScan(upcCode);
    };

    const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Only allow digits
            setUpcCode(value);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label 
                        htmlFor="upc-input" 
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Enter UPC Code
                    </label>
                    <input
                        id="upc-input"
                        type="text"
                        value={upcCode}
                        onChange={handleManualInput}
                        placeholder="Scan or enter UPC code..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        pattern="[0-9]*"
                        inputMode="numeric"
                    />
                </div>
                {isScanning && (
                    <div className="text-sm text-blue-600 animate-pulse">
                        Scanning...
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Submit Code
                </button>
            </form>
        </div>
    );
} 