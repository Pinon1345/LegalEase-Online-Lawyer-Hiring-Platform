"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="hidden lg:flex flex-1 max-w-md xl:max-w-lg mx-8">
            <div
                className="glass group flex w-full items-center gap-3 rounded-full border border-border bg-surface/80 px-4 py-2.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-secondary focus-within:border-secondary focus-within:shadow-lg focus-within:shadow-secondary/20"
            >
                <Search
                    size={18}
                    className="text-text-secondary transition-colors duration-300 group-focus-within:text-secondary"
                />

                <input
                    type="text"
                    placeholder="Search lawyers by name or specialization..."
                    className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
                />
            </div>
        </div>
    );
}