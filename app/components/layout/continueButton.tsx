"use client";

type ContinueButtonProps = {
    onClick?: () => void;
    targetId?: string;
};

export default function ContinueButton({ onClick, targetId }: ContinueButtonProps) {
    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }

        if (targetId) {
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }
        }

        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
        });
    };

    return (
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <button
                type="button"
                onClick={handleClick}
                className="pointer-events-auto z-50 rounded-t-xl bg-slate-100 px-3 py-2 font-medium text-slate-900 transition-[padding] duration-200 ease-out hover:pb-10 active:pb-8"
            >
                Learn more about me
            </button>
        </div>
    );
}