"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { HelpTopicMaster, ChatStanceMaster } from "../../profile/types";

interface MatchingSearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: { 
    topics: string[]; 
    stances: string[]; 
    q: string;
    role: "carer" | "supporter" | "all";
  }) => void;
  helpTopicMaster: HelpTopicMaster[];
  chatStanceMaster: ChatStanceMaster[];
  initialFilters: { 
    topics: string[]; 
    stances: string[]; 
    q: string;
    role: "carer" | "supporter" | "all";
  };
  currentUserRole: "carer" | "supporter" | null;
}

export default function MatchingSearchSheet({
  isOpen,
  onClose,
  onSearch,
  helpTopicMaster,
  chatStanceMaster,
  initialFilters,
  currentUserRole: roleFromAuth,
}: MatchingSearchSheetProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialFilters.topics);
  const [selectedStances, setSelectedStances] = useState<string[]>(initialFilters.stances);
  const [searchQuery, setSearchQuery] = useState(initialFilters.q);
  const [selectedRole, setSelectedRole] = useState<"carer" | "supporter" | "all">(initialFilters.role);

  if (!isOpen) return null;

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleStance = (id: string) => {
    setSelectedStances((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    onSearch({
        topics: selectedTopics,
        stances: selectedStances,
        q: searchQuery,
        role: selectedRole,
    });
    onClose();
  };

  const clearFilters = () => {
    setSelectedTopics([]);
    setSelectedStances([]);
    setSearchQuery("");
    setSelectedRole("all");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center justify-between">
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
          <h2 className="text-lg font-bold">検索</h2>
          <button 
            onClick={clearFilters}
            className="text-sm text-gray-500 font-medium hover:text-blue-600"
          >
            解除
          </button>
        </div>

        <div className="p-6 space-y-8 pb-32">
          {/* ロール選択 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">役割</label>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setSelectedRole("all")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedRole === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setSelectedRole("carer")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedRole === "carer" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
                }`}
              >
                一般
              </button>
              <button
                onClick={() => setSelectedRole("supporter")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedRole === "supporter" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
                }`}
              >
                サポーター
              </button>
            </div>
          </div>

          {/* テキスト検索 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              キーワード
              <span className="ml-2 text-[10px] font-normal text-gray-400">表示名・自己紹介など</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="気になるキーワードを入力"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* 相談したいこと / サポートできること */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">
              {roleFromAuth === "supporter" ? "相談したいこと" : "相談に乗れること"}
            </label>
            <div className="flex flex-wrap gap-2">
              {helpTopicMaster.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                const label = roleFromAuth === "supporter" ? topic.carerLabel : topic.supporterLabel;
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                        : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* チャットのスタンス */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">チャットの雰囲気</label>
            <div className="flex flex-wrap gap-2">
              {chatStanceMaster.map((stance) => {
                const isSelected = selectedStances.includes(stance.id);
                const label = roleFromAuth === "supporter" ? stance.carerLabel : stance.supporterLabel;
                return (
                  <button
                    key={stance.id}
                    onClick={() => toggleStance(stance.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      isSelected
                        ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-100"
                        : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 検索実行ボタン */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleSearch}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center"
          >
            <Search size={20} className="mr-2" />
            この条件で検索
          </button>
        </div>
      </div>
    </div>
  );
}
