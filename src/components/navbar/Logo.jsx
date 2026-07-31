import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link
            href="/"
            className="group flex items-center gap-2 py-2"
        >
            <Image
                src="/justice-final-logo.png"
                alt="LegalEase Logo"
                width={80}
                height={80}
                priority
                className="h-20 w-20 logo-premium"
            />

            <Image
                src="/justice-text-final-logo.png"
                alt="LegalEase"
                width={180}
                height={180}
                priority
                className="hidden sm:block h-22 w-60 shine-text"
            />
        </Link>
    );
}