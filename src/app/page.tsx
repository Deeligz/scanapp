import UpcScanner from '@/components/UpcScanner';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Scanny
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Enter a UPC code to get started
        </p>
        <UpcScanner />
      </div>
    </main>
  );
}
