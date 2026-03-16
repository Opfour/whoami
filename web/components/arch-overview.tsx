import { ClaudeCodeMini } from "@/components/claude-code-mini";
import { WikiBrowserMini } from "@/components/wiki-browser-mini";

function Dock() {
  const icons = [
    "bg-blue-500 rounded-[22%]", // Finder
    "bg-orange-400 rounded-[22%]", // Settings
    "bg-green-500 rounded-[22%]", // Messages
    "bg-sky-500 rounded-[22%]", // Mail
    "bg-purple-500 rounded-[22%]", // Music
    "bg-red-400 rounded-[22%]", // Photos
    "bg-yellow-400 rounded-[22%]", // Notes
    "bg-indigo-500 rounded-[22%]", // Calendar
  ];
  return (
    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-end gap-0.5 sm:gap-1 px-0.5 sm:px-1 py-0.5 sm:py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/30">
      {icons.map((cls, i) => (
        <div key={i} className={`w-2.5 h-2.5 sm:w-4 sm:h-4 ${cls}`} />
      ))}
    </div>
  );
}

function MenuBar() {
  return (
    <div className="absolute top-0 left-0 right-0 h-4 sm:h-5 bg-black/20 backdrop-blur-md flex items-center px-2 sm:px-3 gap-2 sm:gap-3">
      <div className="h-1.5 bg-white/70 rounded-full w-3" />
      <div className="h-1 bg-white/50 rounded-full w-6" />
      <div className="h-1 bg-white/40 rounded-full w-4" />
      <div className="h-1 bg-white/40 rounded-full w-5" />
      <div className="h-1 bg-white/40 rounded-full w-3" />
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="h-1 bg-white/40 rounded-full w-3" />
        <div className="h-1 bg-white/40 rounded-full w-4" />
        <div className="h-1 bg-white/50 rounded-full w-8" />
      </div>
    </div>
  );
}

export function ArchOverview() {
  return (
    <div
      className="relative w-full rounded-xl px-6 sm:px-10 aspect-[16/10] flex items-center justify-center gap-3 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/wallpaper.webp')" }}
    >
      <MenuBar />
      <div className="w-full flex items-end justify-center gap-3">
        <div className="w-[50%] shrink-0 flex flex-col items-center gap-1.5">
          <WikiBrowserMini />
          <span className="text-[10px] sm:text-xs text-white font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">
            Desktop App + CLI
          </span>
        </div>
        <div className="w-[36%] shrink-0 flex flex-col items-center gap-1.5">
          <ClaudeCodeMini />
          <span className="text-[10px] sm:text-xs text-white font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap">
            Agent Harness + Extension
          </span>
        </div>
      </div>
      <Dock />
    </div>
  );
}
