"use client";
import { type ReactNode } from "react";
import { motion } from "motion/react";

interface ToggleGroupItem {
    value: string;
    label: string;
    icon: ReactNode;
}

interface ToggleGroupProps {
    items: ToggleGroupItem[];
    value: string;
    onChange: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void;
    layoutId?: string;
}

export default function ToggleGroup({ items, value, onChange, layoutId = "toggle-indicator" }: ToggleGroupProps) {
    return (
        <div
            role="radiogroup"
            className="relative flex h-5 items-center gap-0.5 rounded-lg border border-border bg-border/50 px-0.5 dark:bg-surface"
        >
            {items.map((item) => {
                const isActive = value === item.value;
                return (
                    <button
                        key={item.value}
                        role="radio"
                        aria-checked={isActive}
                        aria-label={item.label}
                        onClick={(e) => onChange(item.value, e)}
                        className="relative z-10 rounded-md px-1 py-0.5 transition-colors"
                    >
                        <span
                            className={
                                isActive
                                    ? "text-text-primary"
                                    : "text-text-secondary hover:text-text-primary"
                            }
                        >
                            {item.icon}
                        </span>
                        {isActive && (
                            <motion.span
                                layoutId={layoutId}
                                className="absolute inset-0 rounded-md bg-background shadow-sm"
                                style={{ zIndex: -1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 35,
                                }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
