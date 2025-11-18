export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-webifyd-gray-light">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-webifyd-navy mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-webifyd-blue mb-4">
          Page Not Found
        </h2>
        <p className="text-webifyd-gray-medium mb-8">
          The page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="bg-webifyd-blue hover:bg-webifyd-blue-bright text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
