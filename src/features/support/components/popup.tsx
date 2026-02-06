"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createSupport } from "../actions/create-support";

interface RequestPopupProps {
  onClose: () => void;
  supporterName: string;
  roomId: string;
  carerId: string;
  supporterId: string;
}

type Step = "input" | "confirm";

export function RequestPopup({ onClose, supporterName, roomId, carerId, supporterId }: RequestPopupProps) {
  const [step, setStep] = useState<Step>("input");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    startTime: "",
    endTime: "",
    note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.content && formData.startTime && formData.endTime;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setStep("confirm");
    }
  };

  const handleSend = async () => {
    setIsSubmitting(true);
    try {
      await createSupport({
        roomId,
        carerId,
        supporterId,
        content: formData.content,
        startTime: formData.startTime,
        endTime: formData.endTime,
        note: formData.note,
      });
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="font-bold text-gray-900">
            {step === "input" ? "依頼" : "確認画面"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === "input" ? (
            <form onSubmit={handleNext} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  お願いしたい内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="例：買い物代行、話し相手など"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  時間 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 mb-1">開始日時</span>
                    <input
                      type="datetime-local"
                      name="startTime"
                      required
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="text-center text-gray-400">～</div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 mb-1">終了日時</span>
                    <input
                      type="datetime-local"
                      name="endTime"
                      required
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  ひとこと (任意)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="メッセージがあれば入力してください"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-4"
              >
                確認画面へ
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-gray-600 border-b pb-2">
                以下の内容で {supporterName} さんにサポートを依頼します。
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">お願いしたい内容</h4>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">{formData.content}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">希望時間</h4>
                  <p className="text-gray-900 mt-1">
                    {new Date(formData.startTime).toLocaleString()} ～ <br />
                    {new Date(formData.endTime).toLocaleString()}
                  </p>
                </div>
                {formData.note && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">ひとこと</h4>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">{formData.note}</p>
                  </div>
                )}
              </div>

              <div className="pt-6 space-y-3">
                <button
                  onClick={handleSend}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      送信中...
                    </>
                  ) : (
                    "送信する"
                  )}
                </button>
                <button
                  onClick={() => setStep("input")}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  修正する
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
