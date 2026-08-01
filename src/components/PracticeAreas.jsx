import React from "react";
import Link from "next/link";
import {
    FaScaleBalanced,
    FaBriefcase,
    FaDiagramProject,
    FaHouseChimney,
    FaGavel,
    FaUserGroup,
    FaBuildingColumns
} from "react-icons/fa6";
import { FaFileContract, FaFileInvoiceDollar, FaLightbulb, FaPassport, FaUserTie } from "react-icons/fa";

const practiceAreas = [
    { title: "Criminal Law", icon: FaScaleBalanced, href: "/lawyers?area=criminal" },
    { title: "Corporate", icon: FaBriefcase, href: "/lawyers?area=corporate" },
    { title: "Family Law", icon: FaDiagramProject, href: "/lawyers?area=family" },
    { title: "Real Estate", icon: FaHouseChimney, href: "/lawyers?area=realestate" },
    { title: "Civil Rights", icon: FaGavel, href: "/lawyers?area=civil" },
    { title: "Personal Injury", icon: FaUserGroup, href: "/lawyers?area=injury" },
    { title: "Contracts", icon: FaFileContract, href: "/lawyers?area=contracts" },
    { title: "Immigration", icon: FaPassport, href: "/lawyers?area=immigration" },
    { title: "Tax Law", icon: FaFileInvoiceDollar, href: "/lawyers?area=tax" },
    { title: "Employment", icon: FaUserTie, href: "/lawyers?area=employment" },
    { title: "Intellectual Property", icon: FaLightbulb, href: "/lawyers?area=ip" },
    { title: "Bankruptcy", icon: FaBuildingColumns, href: "/lawyers?area=bankruptcy" },
];

const PracticeAreas = () => {
    return (
        <section className="bg-surface py-16 px-6 md:px-16 transition-colors duration-300 border-y border-border">
            <div className="mx-auto max-w-6xl">

                {/* Header with Gold Underline matching wireframe */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-text tracking-wide">
                        Practice Areas
                    </h2>
                    <div className="mt-2.5 h-1 w-16 bg-secondary mx-auto rounded-full" />
                </div>

                {/* Clean Grid Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {practiceAreas.map((area, index) => {
                        const Icon = area.icon;
                        return (
                            <Link
                                key={index}
                                href={area.href}
                                className="group card-hover flex flex-col items-center justify-center rounded-2xl bg-background border border-border p-6 text-center transition-all duration-300 hover:border-secondary hover:shadow-xl"
                            >
                                <div className="mb-4 text-text group-hover:text-secondary group-hover:scale-115 transition-all duration-300">
                                    <Icon size={36} />
                                </div>

                                <span className="text-sm font-bold text-text group-hover:text-secondary transition-colors duration-300 leading-tight">
                                    {area.title}
                                </span>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default PracticeAreas;