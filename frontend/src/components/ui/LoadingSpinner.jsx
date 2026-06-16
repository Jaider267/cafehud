import { Coffee } from "lucide-react";

const LoadingSpinner = ({ message = "Preparando tu café..." }) => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-24 h-24 mb-10">
      <div
        className="absolute inset-0 border-[6px] border-brand-light/40 dark:border-white/20 border-t-brand-dark dark:border-t-white rounded-full animate-spin"
        style={{ animationDuration: "1s" }}
      ></div>
      <div
        className="absolute inset-4 border-[6px] border-brand-light/25 dark:border-white/10 border-b-brand-medium dark:border-b-white/40 rounded-full animate-spin"
        style={{ animationDuration: "1.8s" }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Coffee className="w-11 h-11 text-brand-dark dark:text-[#8B5E3C]" strokeWidth={2.75} />
      </div>
    </div>
    <p className="text-brand-dark font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">{message}</p>
  </div>
);

export default LoadingSpinner;
