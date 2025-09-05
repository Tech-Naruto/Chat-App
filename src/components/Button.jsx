import { Loading } from "./index";
import { AnimatePresence, motion } from "motion/react";
export default function Button({
  className = "",
  icon,
  text = "",
  type = "button",
  loading = false,
  ...props
}) {
  return (
    <AnimatePresence>
      <div>
        {loading ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Loading /></motion.div>
        ) : (
          <button
            type={type}
            disabled={loading}
            className={`${
              loading ? "pointer-events-none bg-gray-300" : className
            }  px-2 py-1 md:px-3 rounded-full font-semibold cursor-pointer transition-all duration-300`}
            {...props}
          >
            <span className="hidden md:inline">{text}</span>
            {icon ? <i className={`${icon} md:pl-2`}></i> : null}
          </button>
        )}
      </div>
    </AnimatePresence>
  );
}
