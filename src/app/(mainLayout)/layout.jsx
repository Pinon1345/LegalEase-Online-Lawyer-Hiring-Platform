import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function RootLayout({ children }) {
    return (
        <div>

            <Navbar></Navbar>

            <main>
                {children}
            </main>

            <Footer></Footer>

        </div>
    );
}
