import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-950/80 backdrop-blur">
        <h1 className="text-xl font-bold tracking-wide">
          CourseStack
        </h1>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm rounded-lg border border-gray-700 hover:bg-gray-800 transition"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* HERO */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Welcome to <span className="text-blue-500">CourseStack</span>
          </h2>

          <p className="mt-4 text-gray-400 text-lg">
            Learn modern web development, AI, machine learning and real-world
            skills with structured courses. Build your future with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
            >
              Sign In
            </Link>
          </div>

          {/* Small note */}
          <p className="mt-6 text-sm text-gray-500">
            Free & Pro courses available • Learn at your own pace
          </p>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-400">

          <p>© {new Date().getFullYear()} CourseStack. All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>

            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>

            <a
              href="https://github.com/"
              target="_blank"
              className="hover:text-white"
            >
              GitHub
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}