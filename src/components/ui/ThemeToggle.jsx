"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const isClient = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );

    const { resolvedTheme, setTheme } = useTheme();

    if (!isClient) {
        return (
            <div className="h-11 w-20 animate-pulse rounded-full bg-content2" />
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <motion.button
            aria-label="Toggle Theme"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
            }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="
        relative
        flex
        h-10
        w-20
        items-center
        rounded-full
        border
        border-default-200
        bg-content1/80
        backdrop-blur-xl
        shadow-lg
        overflow-hidden
      "
        >
            {/* Background Glow */}
            <motion.div
                animate={{
                    opacity: isDark ? 1 : 0,
                }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-primary/10"
            />

            {/* Icons */}
            <div className="flex w-full justify-between px-3 z-10">
                <Sun
                    size={18}
                    className={`transition-all duration-300 ${isDark
                            ? "text-default-400 scale-75"
                            : "text-amber-500 scale-100"
                        }`}
                />

                <Moon
                    size={18}
                    className={`transition-all duration-300 ${isDark
                            ? "text-sky-300 scale-100"
                            : "text-default-400 scale-75"
                        }`}
                />
            </div>

            {/* Sliding Knob */}
            <motion.div
                animate={{
                    x: isDark ? 40 : 2,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                }}
                className="
          absolute
          left-0
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-primary
          shadow-xl
        "
            >
                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 180, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Moon
                                size={18}
                                className="text-white"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ rotate: 180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -180, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Sun
                                size={18}
                                className="text-white"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.button>
    );
}