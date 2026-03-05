"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: string;
}

export default function BottomSheet({
  open,
  onClose,
  children,
  title,
  height = "auto",
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="bottom-sheet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white z-50"
            style={{
              borderRadius: "22px 22px 0 0",
              maxHeight: "92dvh",
              paddingBottom: "env(safe-area-inset-bottom, 16px)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Drag handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="drag-handle" />
            </div>

            {title && (
              <div className="px-5 pb-3">
                <h2 className="text-base font-bold text-center" style={{ color: "#1C1C1E" }}>
                  {title}
                </h2>
              </div>
            )}

            <div
              className="overflow-y-auto"
              style={{ maxHeight: height === "auto" ? "80dvh" : height }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
