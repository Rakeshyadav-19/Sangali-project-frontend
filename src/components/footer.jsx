// Professional footer component for the website
export default function Footer() {
  return (
    <footer className="bg-[#003554] text-[#00A6FB] py-6 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h5 className="text-lg font-bold">Sports Event Registration</h5>
            <p className="text-sm text-[#ffffff]">
              Making sports accessible for everyone.
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-[#ffffff] hover:text-[#00A6FB] transition duration-300"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-[#ffffff] hover:text-[#00A6FB] transition duration-300"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-[#ffffff] hover:text-[#00A6FB] transition duration-300"
            >
              Privacy Policy
            </a>
          </div>
        </div>
        <div className="mt-6 border-t border-[#006494] pt-4 text-center">
          <p className="text-sm text-[#ffffff]">
            &copy; {new Date().getFullYear()} Sports Event Registration. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
