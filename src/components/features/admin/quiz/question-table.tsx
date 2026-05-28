"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { DifficultyBadge, FormatBadge } from "./quiz-badges";

type DifficultyLevel = "EASY" | "NORMAL" | "HARD";
type FormatType = "SINGLE_PICK_LIST" | "MULTI_PICK_GRID" | "IMAGE_RECOGNITION" | "TRUE_FALSE";

interface Question {
  id: string;
  prompt: string;
  level: DifficultyLevel;
  pattern: FormatType;
  optionsCount: number;
  createdAt: Date | string;
}

interface QuestionTableProps {
  questions: Question[];
}

export default function QuestionTable({ questions }: QuestionTableProps) {
  const [filterLevel, setFilterLevel] = useState<DifficultyLevel | "ALL">("ALL");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST">("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 8;

  const formatDate = (dateInput: Date | string) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Reset to first page when filters change
  const handleFilterChange = (level: DifficultyLevel | "ALL") => {
    setFilterLevel(level);
    setCurrentPage(1);
  };

  const filteredAndSortedQuestions = useMemo(() => {
    let result = [...questions];

    // Filter by level
    if (filterLevel !== "ALL") {
      result = result.filter((q) => q.level === filterLevel);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "NEWEST" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [questions, filterLevel, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedQuestions.length / ROWS_PER_PAGE);
  const paginatedQuestions = useMemo(() => {
    return filteredAndSortedQuestions.slice(
      (currentPage - 1) * ROWS_PER_PAGE,
      currentPage * ROWS_PER_PAGE
    );
  }, [filteredAndSortedQuestions, currentPage]);

  const startIdx = (currentPage - 1) * ROWS_PER_PAGE + 1;
  const endIdx = Math.min(currentPage * ROWS_PER_PAGE, filteredAndSortedQuestions.length);

  return (
    <div className="bg-white border border-[#c2c9bb] rounded-2xl shadow-[0_4px_6px_-1px_rgba(26,28,25,0.04)] overflow-hidden flex flex-col">
      {/* Filter Bar */}
      <div className="px-4 py-3 border-b border-[#e3e3de] flex items-center justify-between bg-[#f4f4ef]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#72796e]">filter_alt</span>
            <select
              value={filterLevel}
              onChange={(e) => handleFilterChange(e.target.value as any)}
              className="bg-white border border-[#c2c9bb] rounded-lg px-3 py-1.5 text-xs font-semibold font-['Manrope'] focus:outline-none focus:ring-1 focus:ring-[#2d5a27] cursor-pointer"
            >
              <option value="ALL">All Difficulty</option>
              <option value="EASY">Easy</option>
              <option value="NORMAL">Normal</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSortOrder(sortOrder === "NEWEST" ? "OLDEST" : "NEWEST");
              setCurrentPage(1);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c2c9bb] bg-white text-[#1a1c19] text-xs font-semibold font-['Manrope'] hover:bg-[#eeeee9] transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">
              {sortOrder === "NEWEST" ? "arrow_downward" : "arrow_upward"}
            </span>
            {sortOrder === "NEWEST" ? "Newest First" : "Oldest First"}
          </button>
        </div>

        <span className="text-[10px] font-bold text-[#72796e] uppercase tracking-wider">
          Total: {filteredAndSortedQuestions.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[#e3e3de]">
              <th className="text-xs font-semibold text-[#42493e] uppercase tracking-wider py-3 px-5 w-[35%] font-['Manrope']">
                Question Text
              </th>
              <th className="text-xs font-semibold text-[#42493e] uppercase tracking-wider py-3 px-5 font-['Manrope']">
                Difficulty
              </th>
              <th className="text-xs font-semibold text-[#42493e] uppercase tracking-wider py-3 px-5 font-['Manrope']">
                Format
              </th>
              <th className="text-xs font-semibold text-[#42493e] uppercase tracking-wider py-3 px-5 font-['Manrope']">
                Created At
              </th>
              <th className="text-xs font-semibold text-[#42493e] uppercase tracking-wider py-3 px-5 text-right font-['Manrope']">
                Options
              </th>
              <th className="text-xs font-semibold text-[#42493e] uppercase tracking-wider py-3 px-5 text-center w-20 font-['Manrope']">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e3de]">
            {paginatedQuestions.length > 0 ? (
              paginatedQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-[#f4f4ef] transition-colors group text-[#1a1c19]">
                  <td className="py-4 px-5">
                    <p className="text-sm font-medium font-['Plus_Jakarta_Sans'] line-clamp-1">
                      {q.prompt}
                    </p>
                  </td>
                  <td className="py-4 px-5">
                    <DifficultyBadge level={q.level} />
                  </td>
                  <td className="py-4 px-5">
                    <FormatBadge pattern={q.pattern} />
                  </td>
                  <td className="py-4 px-5 text-xs text-[#72796e] font-['Manrope'] whitespace-nowrap">
                    {formatDate(q.createdAt)}
                  </td>
                  <td className="py-4 px-5 text-right text-sm text-[#42493e] font-['Manrope'] tabular-nums">
                    {q.optionsCount}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/quiz/edit/${q.id}`}
                        className="p-1.5 rounded-lg text-[#72796e] hover:text-[#2d5a27] hover:bg-[#bcf0ae]/30 transition-colors"
                        title="Edit question"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Link>
                      <button className="p-1.5 rounded-lg text-[#72796e] hover:text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors" title="Delete question">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#72796e] text-sm italic font-['Manrope'] bg-[#fafaf5]">
                  No questions found matching your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3 border-t border-[#e3e3de] bg-white flex items-center justify-between">
        <span className="text-xs text-[#42493e] font-['Manrope']">
          {filteredAndSortedQuestions.length > 0 ? (
            `Showing ${startIdx}–${endIdx} of ${filteredAndSortedQuestions.length} questions`
          ) : (
            "No questions to show"
          )}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1 text-[#72796e] hover:text-[#1a1c19] hover:bg-[#eeeee9] rounded-lg transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <div className="flex items-center px-3 gap-1">
            <span className="text-xs font-bold text-[#1a1c19] font-['Manrope']">{currentPage}</span>
            <span className="text-xs text-[#72796e] font-['Manrope']">/</span>
            <span className="text-xs text-[#72796e] font-['Manrope']">{totalPages || 1}</span>
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 text-[#72796e] hover:text-[#1a1c19] hover:bg-[#eeeee9] rounded-lg transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
