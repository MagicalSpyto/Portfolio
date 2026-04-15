"use client";

import React, { useEffect, useRef, useState } from "react";
import ProjectShelf from "@/app/components/layout/projectShelf";

type RowState = {
    // Normalized progress used for any in-view interpolation logic.
    // 0 means still below trigger, 1 means fully phased in.
    progress: number;
    // Final Y translation (in px) applied to the moving inner container.
    y: number;
};

type ProjectEntry = {
    slug: string;
};

type ProjectDataMap = Record<string, {
    title: string;
    subtitle: string;
    description: string;
    thumbnail: string;
    duration: string;
}>;

type RowModel = {
    id: number;
    order: number;
    projects: ProjectEntry[];
};

// Clamp helper to keep values inside a range.
// Default range is [0, 1], useful for normalized progress values.
function clamp(v: number, min = 0, max = 1) {
    return Math.min(max, Math.max(min, v));
}


// Encapsulates all viewport-driven row motion logic.
// Returns a ref (for measurement) and derived motion state (progress/y).
function useRowMotion(rowOrder: number, totalRows: number, yBag: React.MutableRefObject<number[]>) {
    // Ref points to the row wrapper that we measure every frame.
    const ref = useRef<HTMLDivElement | null>(null);
    // Start hidden below until first measurement runs.
    const [state, setState] = useState<RowState>({ progress: 0, y: 1200 });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let raf = 0;

        const updatePosition = () => {
            const rect = element.getBoundingClientRect();
            const vh = window.innerHeight || 1;
            // Phase-in threshold as a percent of viewport height from the top.
            // Example: 0.65 means the row phases in once its top reaches 65% viewport height.
            // Lower value => phases in earlier (higher on the screen).
            // Higher value => phases in later (lower on the screen).
            const PHASE_IN_TRIGGER_FROM_TOP = 0.6;
            const phaseInTriggerY = vh * PHASE_IN_TRIGGER_FROM_TOP;
            const elementTopY = rect.top;
            // 1 = element just entered the screen from the bottom, 0 = element reached the trigger line.
            const progress = 1 - clamp((vh - elementTopY) / Math.max(vh - phaseInTriggerY, 1), 0, 1);
            // Derive trigger spacing from the created rows rather than a fixed magic step.
            let y = 0;

            if (elementTopY > phaseInTriggerY) {
                y = (-rect.height + (rowOrder > 0 ? (yBag.current[rowOrder - 1] ?? 0) : 0)) * progress;
            } else {
                y = 0;
            }

            // Write resolved y so the next row can read it this frame.
            yBag.current[rowOrder] = y;

            setState((s) =>
                s.y === y && s.progress === progress
                    ? s
                    : { ...s, y, progress }
            );

            raf = requestAnimationFrame(updatePosition);
        };

        raf = requestAnimationFrame(updatePosition);

        return () => {
            cancelAnimationFrame(raf);
        };
    }, [rowOrder, totalRows, yBag]);

    return { ref, state };
}


function PortfolioRowItem({ row, totalRows, projectDataMap, yBag }: { row: RowModel; totalRows: number; projectDataMap: ProjectDataMap; yBag: React.MutableRefObject<number[]> }) {
    // Hook provides row reference and continuously updated motion state.
    const { ref, state } = useRowMotion(row.order, totalRows, yBag);

    // Keep upper rows visually above lower rows when transformed content overlaps.
    const z = 1000 - row.order;

    return (
        <div
            // Outer wrapper is not transformed; it is used for viewport measurements.
            ref={ref}
            style={{
                zIndex: z,
                overflowAnchor: "none",
            }}
            key={row.id}
            className="relative overflow-visible"
        >
            <div
                style={{
                    // Move only the inner layer so layout slot remains stable.
                    transform: `translateY(${state.y}px) scale(${((4 - (state.progress)) / 4)})`,
                    opacity: 1 - state.progress,
                    // Keep transform/opacity motion plus grid-column hover expansion animated.
                    transition: "transform 220ms ease-out, opacity 220ms ease-out, grid-template-columns 300ms ease-in-out",
                    // Hint browser to optimize transform-heavy updates.
                    willChange: "transform",
                }}
                className="grid grid-cols-1 gap-8 pb-0
              md:grid-cols-[1fr_1fr]
              md:[&:has(>a:last-child:hover)]:grid-cols-[1fr_2fr]
              md:[&:has(>a:first-child:hover)]:grid-cols-[2fr_1fr]
            "
            >
                {row.projects.map((project) => {
                    // Resolve detail data for each project slug.
                    const data = projectDataMap[project.slug as keyof typeof projectDataMap];
                    // Skip unknown slugs gracefully.
                    if (!data) return null;

                    return (
                        // Shelf card consumes slug plus mapped content fields.
                        <ProjectShelf key={project.slug} slug={project.slug} {...data} />
                    );
                })}
            </div>
        </div>
    );
}

export default function PortfolioRow({ projects, projectDataMap }: { projects: ProjectEntry[]; projectDataMap: ProjectDataMap }) {
    const rowCount = Math.ceil(projects.length / 2);
    const rows: RowModel[] = Array.from({ length: rowCount }).map((_, rowIndex) => ({
        id: rowIndex,
        order: rowIndex,
        projects: projects.slice(rowIndex * 2, rowIndex * 2 + 2),
    }));

    // Shared bag so each row can read its predecessor's resolved y every RAF frame.
    const yBag = useRef<number[]>([]);

    return (
        <>
            {rows.map((row) => (
                <PortfolioRowItem
                    key={row.id}
                    row={row}
                    totalRows={rows.length}
                    projectDataMap={projectDataMap}
                    yBag={yBag}
                />
            ))}
        </>
    );
}