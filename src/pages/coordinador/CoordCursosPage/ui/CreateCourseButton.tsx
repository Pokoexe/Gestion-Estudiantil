import { PlusCircle } from "lucide-react";

export function CreateCourseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full justify-center inline-flex items-center gap-2 px-[18px] py-2.5 rounded-edu-control text-sm font-semibold bg-edu-primary text-white hover:bg-edu-primary-hover border-none cursor-pointer"
    >
      <PlusCircle className="w-4 h-4" />
      Crear curso
    </button>
  );
}
