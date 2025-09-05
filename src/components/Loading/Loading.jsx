import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="relative w-[25px] aspect-square grid place-items-center">
      {/* Outer spinning border */}
      <div className={`absolute inset-0 rounded-full border-[2px] border-red-600 border-t-transparent animate-spin`} />

      {/* Middle reverse spinning border */}
      <div className={`absolute inset-[4px] rounded-full border-[2px] border-gray-800 border-t-transparent animate-reverse-spin`} />

      {/* Inner static ring */}
      <div className={`absolute inset-[8px] rounded-full border-[2px] border-red-600 border-t-transparent animate-spin`} />
    </div>
  );
}
