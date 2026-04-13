import Link from "next/link"

export default function PortfolioHeader(){
    return(
    <header className="absolute top-0 left-0 z-30 w-full px-6 py-4 bg-gradient-to-b from-slate-900/90 to-slate-900/0">
        <nav className="flex space-x-6">
            <Link href="/" className="text-slate-50 font-medium">
                Home
            </Link>
            <Link href="/portfolio" className="text-slate-50 font-medium">
                Portfolio
            </Link>
        </nav>
    </header>
    );
}