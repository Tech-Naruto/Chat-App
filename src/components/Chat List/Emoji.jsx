import { EmojiPicker } from "frimousse";
import {  motion } from "motion/react";

export default function MyEmojiPicker({ onEmojiClick, emojiRef }) {
  const popupVariants = {
    "hidden" : { opacity: 0, scale: 0, y: -40, x: 20 },
    "visible" : { opacity: 1, scale: 1, y: 0, x: 0 }
  } 
  return (
    <motion.div
    variants={popupVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="absolute bottom-0 will-change-[transform,opacity]"
    >
      <EmojiPicker.Root
        className="isolate flex h-[368px] w-fit flex-col bg-white dark:bg-neutral-900 rounded-xl absolute bottom-12 left-2"
        onEmojiSelect={onEmojiClick}
        ref={emojiRef}
      >
        <EmojiPicker.Search className="z-10 mx-2 mt-2 appearance-none rounded-md text-gray-300 focus:text-white focus:ring focus:ring-[#077dc1] bg-neutral-100 px-2.5 py-2 text-sm dark:bg-neutral-800 focus:outline-none" />
        <EmojiPicker.Viewport className="relative flex-1 outline-hidden">
          <EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
            Loading…
          </EmojiPicker.Loading>
          <EmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
            No emoji found.
          </EmojiPicker.Empty>
          <EmojiPicker.List
            className="select-none pb-1.5"
            components={{
              CategoryHeader: ({ category, ...props }) => (
                <div
                  className="bg-white px-3 pt-3 pb-1.5 font-medium text-neutral-600 text-xs dark:bg-neutral-900 dark:text-neutral-400"
                  {...props}
                >
                  {category.label}
                </div>
              ),
              Row: ({ children, ...props }) => (
                <div className="scroll-my-1.5 px-1.5" {...props}>
                  {children}
                </div>
              ),
              Emoji: ({ emoji, ...props }) => (
                <button
                  className="flex size-8 items-center justify-center rounded-md text-lg data-[active]:bg-neutral-100 dark:data-[active]:bg-neutral-800"
                  {...props}
                >
                  {emoji.emoji}
                </button>
              ),
            }}
          />
        </EmojiPicker.Viewport>
      </EmojiPicker.Root>
    </motion.div>
  );
}
