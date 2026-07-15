import { LayoutControlBlock } from "@/components/features/admin/shared/layout-control-block";
import { MediaLayoutOptions } from "@/lib/media-utils";
import { CreateQuizQuestionInput } from "@/lib/validations/quiz.schema";

interface QuestionPreviewControlsProps {
  mediaUrl: string | null | undefined;
  isMatchup: boolean;
  options: CreateQuizQuestionInput["options"];
  onClose: () => void;
  handleApply: () => void;
  handleUpdateMainMedia: (newOptions: MediaLayoutOptions) => void;
  handleUpdateOptionMedia: (index: number, newOptions: MediaLayoutOptions) => void;
  handleUpdateMatchupMedia: (index: number, side: "left" | "right", newOptions: MediaLayoutOptions) => void;
}

export function QuestionPreviewControls({
  mediaUrl,
  isMatchup,
  options,
  onClose,
  handleApply,
  handleUpdateMainMedia,
  handleUpdateOptionMedia,
  handleUpdateMatchupMedia,
}: QuestionPreviewControlsProps) {
  return (
    <div className="w-[400px] bg-white flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10 shrink-0">
      <div className="p-6 border-b border-[#e3e3de]">
        <h2 className="text-xl font-bold text-[#1a1c19] font-serif">Image Layout Editor</h2>
        <p className="text-sm text-[#72796e] mt-1 font-sans">Adjust how images fit within their containers.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
        {mediaUrl && (
          <LayoutControlBlock
            title="Question Media"
            url={mediaUrl}
            onChange={handleUpdateMainMedia}
          />
        )}

        {isMatchup ? (
          options.map((opt, index) => {
            const [leftLabel, rightLabel] = (opt.label || "").split("|");
            const [leftImg, rightImg] = (opt.media_url || "").split("|");

            const leftImgTrim = (leftImg || "").trim();
            const rightImgTrim = (rightImg || "").trim();

            if (!leftImgTrim && !rightImgTrim) return null;

            return (
              <div key={`opt-ctrl-matchup-${index}`} className="flex flex-col gap-6 border-b border-[#e3e3de] pb-6 last:border-b-0 last:pb-0">
                {leftImgTrim && (
                  <LayoutControlBlock
                    title={`Pair ${index + 1} - Left: ${leftLabel || "Left"}`}
                    url={leftImgTrim}
                    onChange={(opts) => handleUpdateMatchupMedia(index, "left", opts)}
                  />
                )}
                {rightImgTrim && (
                  <LayoutControlBlock
                    title={`Pair ${index + 1} - Right: ${rightLabel || "Right"}`}
                    url={rightImgTrim}
                    onChange={(opts) => handleUpdateMatchupMedia(index, "right", opts)}
                  />
                )}
              </div>
            );
          })
        ) : (
          options.map((opt, index) => {
            if (!opt.media_url) return null;
            return (
              <LayoutControlBlock
                key={`opt-ctrl-${index}`}
                title={`Option: ${opt.label || `Option ${index + 1}`}`}
                url={opt.media_url}
                onChange={(opts) => handleUpdateOptionMedia(index, opts)}
              />
            );
          })
        )}

        {!mediaUrl && !options.some((o) => o.media_url) && (
          <div className="text-center text-[#72796e] p-8 bg-[#fafaf5] rounded-xl border border-[#c2c9bb]">
            No images to arrange for this question.
          </div>
        )}
      </div>

      <div className="p-6 border-t border-[#e3e3de] flex gap-3 bg-[#fafaf5]">
        <button
          onClick={onClose}
          className="flex-1 py-3 px-4 rounded-xl border border-[#c2c9bb] text-[#42493e] font-bold text-sm hover:bg-[#e3e3de] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-3 px-4 rounded-xl bg-[#2d5a27] text-white font-bold text-sm shadow-md hover:bg-[#154212] transition-colors"
        >
          Apply Layout
        </button>
      </div>
    </div>
  );
}