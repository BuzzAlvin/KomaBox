import { FaInstagram, FaDiscord, FaChartLine } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-2.5 p-2">
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
        <FaDiscord className="text-lg sm:text-xl md:text-2xl" />
        <FaInstagram className="text-lg sm:text-xl md:text-2xl" />
        <FaChartLine className="text-lg sm:text-xl md:text-2xl" />
      </div>
      <span className="text-xs sm:text-sm  text-text-secondary">
        © KomaBox {year}
      </span>
      <a href="#" className="text-xs sm:text-sm hover:underline text-text-secondary">Terms & Policies</a>
    </div>
  );
};

export default Footer;
