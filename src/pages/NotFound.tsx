import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-4 pt-20">
    <div className="text-center space-y-4">
      <h1 className="text-6xl font-serif text-[#c9a84c]">404</h1>
      <h2 className="text-2xl font-serif text-[#1a1208]">Page Not Found</h2>
      <p className="text-[#1a1208]/60 text-sm">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-[#1a1208] text-[#fdf9f0] text-sm font-medium rounded-full mt-4"
      >
        Back to Home &rarr;
      </Link>
    </div>
  </div>
);

export default NotFound;
