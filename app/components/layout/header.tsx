import Link from "next/link"

export default function PortfolioHeader(){
    return(
    <header className="border-b border-white/10 px-6 py-4">
        <nav className="flex space-x-6">
            <Link href="./" className="text-gray-800 font-medium">
                Home
            </Link>
            <Link href="./portfolio" className="text-gray-800 font-medium">
                Portfolio
            </Link>
        </nav>
    </header>
    );
}