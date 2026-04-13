import Link from "next/link"

export default function PortfolioHeader(){
    return(
    <header className="absolute top-0 left-0 z-50 w-full px-6 py-4 bg-gradient-to-b from-slate-950/90 to-slate-900/0 hover:from-slate-100 transition-colors hover:mix-blend-difference">
        <nav className="flex space-x-6">
            <Link href="/" className="text-slate-100 font-medium hover:scale-120 transition-transform ">
                Home
            </Link>
            <Link href="/portfolio" className="text-slate-100 font-medium hover:scale-120 transition-transform">
                Portfolio
            </Link>
        </nav>
    </header>
    );
}