import Link from "next/link";

type ProjectShelfProps = {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    thumbnail: string;
    duration: string;
};

export default function ProjectShelf(data: ProjectShelfProps) {
    return (
        <Link
            href={`/portfolio/${data.slug}`}
            className="
                group
                h-120
                relative
                overflow-hidden"
        >
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${data.thumbnail})` }}
            />
            <div className="absolute -inset-px bg-black/50 backdrop-blur-md transition-all duration-300 ease-out group-hover:bg-black/20 group-hover:backdrop-blur-sm" />

            <div className="relative h-full shadow-md transition-shadow duration-300 group-hover:shadow-xl">
                {/* Project Preview */}
                <div className={`h-48 relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <div className="text-center px-4">
                            <h3 className="text-2xl font-bold text-slate-100 mb-2">
                                {data.title}
                            </h3>
                            <p className="text-slate-100">
                                {data.subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                    <p className="text-slate-100 mb-4 line-clamp-3">
                        {data.description}
                    </p>

                    {/* Duration */}
                    <div className="mb-4">
                        <p className="label mb-1">Duration</p>
                        <p className="text-sm font-medium text-slate-100">
                            {data.duration}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}