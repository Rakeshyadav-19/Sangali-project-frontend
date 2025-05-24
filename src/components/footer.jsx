import { FaYoutube, FaInstagram, FaTwitter } from "react-icons/fa";

// Professional footer component for the website
export default function Footer() {
  return (
    <footer className="text-white text-center py-4 w-full">
      <div className="bg-gradient-to-r from-[#006494] to-[#00A6FB] flex flex-col md:flex-row items-center justify-center w-11/12 mx-auto rounded-lg py-10">
        <div className="flex-1 text-center">
          <h3 className="text-lg font-bold tracking-wide mb-4">FOR OURIES</h3>
          <button className="px-4 py-2 bg-white text-black font-bold rounded-full transition duration-300 hover:bg-gray-300">
            CONTACT
          </button>
        </div>
        <div className="hidden md:block w-px h-28 bg-white mx-6"></div>
        <div className="flex-1 text-center mt-6 md:mt-0">
          <h3 className="text-lg font-bold tracking-wide mb-4">FOLLOW US ON</h3>
          <div className="flex justify-center gap-6">
            <a href="https://www.instagram.com/">
              <FaInstagram className="text-white w-6 h-6 hover:opacity-70 transition duration-300" />
            </a>
            <a href="https://www.youtube.com/">
              <FaYoutube className="text-white w-6 h-6 hover:opacity-70 transition duration-300" />
            </a>
            <a href="https://www.twitter.com/">
              <FaTwitter className="text-white w-6 h-6 hover:opacity-70 transition duration-300" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 my-4">
        <a href="/" className="text-black hover:underline">
          Home
        </a>
        <a href="#" className="text-black hover:underline">
          About
        </a>
        <a href="/#events" className="text-black hover:underline">
          Events
        </a>
      </div>

      <div className="bg-gradient-to-r from-[#006494] to-[#00A6FB] w-11/12 mx-auto py-2 rounded-lg">
        <p className="text-sm font-bold">
          MAIL: <span className="font-bold">kupwadrollerskating@gmail.com</span>
        </p>
      </div>

      <p className="text-xs text-gray-500 mt-6">
        &copy; 2025 by Rakesh & Prabhu{" "}
        <a href="#" className="text-blue-500 hover:underline">
          CONTACT
        </a>
      </p>
    </footer>
  );
}
