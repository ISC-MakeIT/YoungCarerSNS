"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SelectionCard } from "@/components/ui/selection-card"
import { StepContainer } from "@/components/ui/step-container"
import { Moon, Star, Cloud, Sun, Sparkles, ArrowRight, ArrowLeft, RefreshCw, HandHeart, MessageCircle, X } from "lucide-react"
import type { HelpTopicMaster } from "@/features/profile/types"
import { getPseudoMatchingProfiles } from "@/features/matching/actions/get-pseudo-matching-profiles"
import { Avatar } from "@/components/ui/avatar"
import { AvatarWithStatus } from "@/components/ui/avatar-with-status"
import { Badge } from "@/components/ui/badge"

type FormValues = {
  practical: string
  care: string
  emotional: string
  others: string
  duration: string
  weekly_hours: string
  time_impact: string
  wants_support: string
  selected_topics: string[]
}

const BASE_QUESTIONS = [
  {
    id: "practical",
    title: "1. 家の中での実用的なサポート",
    description: "料理、掃除、生活をまわしていくための作業を助けるなど",
    options: [
      { label: "よくしている", value: "5" },
      { label: "している", value: "4" },
      { label: "たまにする", value: "3" },
      { label: "ほとんどしていない", value: "2" },
      { label: "していない", value: "0" },
    ],
  },
  {
    id: "care",
    title: "2. 介助タイプのサポート",
    description: "入浴や着替えの介助、薬を飲ませる、移動介助など",
    options: [
      { label: "よくしている", value: "10" },
      { label: "している", value: "8" },
      { label: "たまにする", value: "6" },
      { label: "ほとんどしていない", value: "4" },
      { label: "していない", value: "0" },
    ],
  },
  {
    id: "emotional",
    title: "3. 感情面でのサポート",
    description: "そばにいる、相手を笑わせようとする、元気づける、問題を話すなど",
    options: [
      { label: "よくしている", value: "8" },
      { label: "している", value: "6" },
      { label: "たまにする", value: "4" },
      { label: "ほとんどしていない", value: "2" },
      { label: "していない", value: "0" },
    ],
  },
  {
    id: "others",
    title: "4. 家族をサポートしている人は他にいますか？",
    description: "一人だけの負担か、複数人で分担しているか",
    options: [
      { label: "はい", value: "2" },
      { label: "いいえ", value: "1" },
      { label: "わからない", value: "0" },
    ],
  },
  {
    id: "duration",
    title: "5. これまでどれぐらいの期間、家族のケアをしてきましたか？",
    description: "",
    options: [
      { label: "10年以上", value: "20" },
      { label: "7年以上", value: "18" },
      { label: "5年以上", value: "16" },
      { label: "3年以上", value: "14" },
      { label: "1年以上", value: "12" },
      { label: "1年以内", value: "10" },
      { label: "していない", value: "0" },
    ],
  },
  {
    id: "weekly_hours",
    title: "6. 一週間にだいたい何時間ぐらい、ケアに使っていますか？",
    description: "",
    options: [
      { label: "42時間以上", value: "20" },
      { label: "30時間以上", value: "16" },
      { label: "18時間以上", value: "12" },
      { label: "6時間以上", value: "8" },
      { label: "6時間以内", value: "4" },
      { label: "していない", value: "0" },
    ],
  },
  {
    id: "time_impact",
    title: "7. 自分のために使う時間への影響はありましたか？",
    description: "学校、宿題、友達と過ごす、趣味など",
    options: [
      { label: "すごく影響した", value: "20" },
      { label: "影響した", value: "15" },
      { label: "どちらでもない", value: "10" },
      { label: "ほとんど影響していない", value: "5" },
      { label: "影響していない", value: "0" },
    ],
  },
  {
    id: "wants_support",
    title: "8. あなたがしてほしいと思うサポートや手助けはありますか？",
    description: "",
    options: [
      { label: "はい", value: "15" },
      { label: "いいえ", value: "0" },
    ],
  },
]

interface ReflectionFormProps {
  helpTopics?: HelpTopicMaster[];
  userId?: string;
}

export const ReflectionForm = ({ helpTopics = [], userId }: ReflectionFormProps) => {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<number | null>(null)
  const [matchingProfiles, setMatchingProfiles] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      practical: "",
      care: "",
      emotional: "",
      others: "",
      duration: "",
      weekly_hours: "",
      time_impact: "",
      wants_support: "",
      selected_topics: [],
    }
  })

  const QUESTIONS = BASE_QUESTIONS
  const currentQuestion = QUESTIONS[step]
  const isLastStep = step === QUESTIONS.length - 1
  const watchedValue = watch(currentQuestion?.id as keyof FormValues)
  const watchedWantsSupport = watch("wants_support")
  const selectedTopics = watch("selected_topics")

  const toggleTopic = (id: string) => {
    const current = selectedTopics || [];
    const next = current.includes(id)
      ? current.filter(t => t !== id)
      : [...current, id];
    setValue("selected_topics", next);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { selected_topics, ...scores } = data
      const totalScore = Object.values(scores).reduce((acc, val) => acc + (Number(val) || 0), 0)
      
      setResult(totalScore)

      if (data.wants_support === "15" && selected_topics.length > 0) {
        const profiles = await getPseudoMatchingProfiles(selected_topics);
        setMatchingProfiles(profiles);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const nextStep = () => {
    if (watchedValue && watchedValue.length !== 0) {
      setStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setStep(prev => prev - 1)
  }

  const handleReset = () => {
    reset()
    setStep(0)
    setResult(null)
    setMatchingProfiles([])
  }

  const getHelpTopicLabel = (tagId: string) => {
    const topic = helpTopics.find(t => t.id === tagId);
    return topic ? topic.supporterLabel : tagId; // Result shows supporter's label if possible, or carer's? Usually carer sees what they can get.
    // In matching client it uses role-based. Here we show supporter's topics.
  };

  if (result !== null) {
    let MarkIcon = Sparkles
    let markText = "✨ きらきらマーク"
    let colorClass = "text-pink-500"
    let feedback = "ケアと自分の時間のバランスを保てているようです。今の調子で自分も大切にしていきましょう。"

    if (result >= 90) {
      MarkIcon = Moon
      markText = "🌙 月マーク"
      colorClass = "text-yellow-600"
      feedback = "あなたは非常に多くのケアを担っている可能性があります。一人で抱え込まず、周りの大人や専門機関に相談してみるのも一つの手です。"
    } else if (result >= 70) {
      MarkIcon = Star
      markText = "⭐ 星マーク"
      colorClass = "text-yellow-400"
      feedback = "かなりのケアを担っていますね。頑張りすぎていませんか？誰かに話を聞いてもらうだけでも、少し楽になるかもしれません。"
    } else if (result >= 50) {
      MarkIcon = Cloud
      markText = "☁️ 曇りマーク"
      colorClass = "text-gray-400"
      feedback = "定期的にケアを行っているようです。大変な時は無理をせず、休みを取ることも考えてくださいね。"
    } else if (result >= 30) {
      MarkIcon = Sun
      markText = "☀️ 晴れマーク"
      colorClass = "text-orange-400"
      feedback = "あなたは家事やお家のことをお手伝いしている優しい方ですね。自分自身の時間も大切にしてください。"
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto p-8 text-center space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100 relative">
          <button 
            onClick={() => router.back()}
            className="absolute top-6 left-6 flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">戻る</span>
          </button>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">結果</h2>
            <div className={`p-8 bg-gray-50 rounded-full w-48 h-48 mx-auto flex items-center justify-center border-4 border-current ${colorClass}`}>
              <MarkIcon size={80} strokeWidth={1.5} />
            </div>
            <div className={`text-3xl font-black ${colorClass}`}>{markText}</div>
          </div>
          
          <p className="text-lg text-gray-700 leading-relaxed bg-blue-50 p-6 rounded-xl border border-blue-100">
            {feedback}
          </p>

          {matchingProfiles.length > 0 && (
            <div className="space-y-4 pt-4 text-left">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <HandHeart className="text-pink-500" />
                あなたをサポートできるかもしれない人
              </h3>
              <div className="grid gap-3">
                {matchingProfiles.map((profile) => {
                  const lastActiveAt = (profile.user_activity as any)?.last_active_at || 
                                      (Array.isArray(profile.user_activity) ? profile.user_activity[0]?.last_active_at : null);
                  
                  return (
                    <div key={profile.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <Link 
                          href={userId ? `/profile/${profile.id}` : `/register`}
                          className="flex items-center gap-4 flex-1 hover:opacity-75 transition-opacity"
                        >
                          {userId ? (
                            <AvatarWithStatus 
                              userId={profile.id} 
                              initialLastActiveAt={lastActiveAt}
                              src={profile.icon_url}
                              className="w-12 h-12 flex-shrink-0"
                            />
                          ) : (
                            <Avatar 
                              src={profile.icon_url}
                              className="w-12 h-12 flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 text-left">
                            <div className="font-bold text-gray-900">{profile.display_name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{profile.bio}</div>
                          </div>
                        </Link>
                        <Link 
                          href={userId ? `/profile/${profile.id}` : `/register`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <MessageCircle size={20} />
                        </Link>
                      </div>
                      {(profile.help_topics?.length > 0 || profile.help_topic_other) && (
                      <div className="flex flex-wrap gap-1">
                        {profile.help_topics?.map((tag: string) => (
                          <Badge key={tag} className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] py-0 px-2">
                            {getHelpTopicLabel(tag)}
                          </Badge>
                        ))}
                        {profile.help_topic_other && (
                          <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] py-0 px-2">
                            {profile.help_topic_other}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {!userId && (
                <p className="text-sm text-gray-500 text-center">
                  会員登録をすると、このようなサポーターの方々に相談することができます。
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 w-full py-4 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold"
          >
            <RefreshCw size={20} />
            もう一度診断する
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto p-8 space-y-8 bg-white rounded-2xl shadow-2xl border border-gray-100 min-h-[500px] flex flex-col relative">
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">中断する</span>
        </button>
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">リフレクション</h1>
          <p className="text-gray-600">
            ふだんの生活の中での家族のサポートについて、いくつかの質問に答えてみましょう。
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Step {step + 1} / {QUESTIONS.length}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between">
          <StepContainer description={currentQuestion.description}>
            <div className="min-h-[400px]">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{currentQuestion.title}</h3>
              <div className="grid gap-3">
                {currentQuestion.options.map((option) => (
                  <SelectionCard
                    key={option.value}
                    type="radio"
                    name={currentQuestion.id}
                    value={option.value}
                    register={register}
                    title={option.label}
                  />
                ))}
              </div>

              {currentQuestion.id === "wants_support" && watchedWantsSupport === "15" && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <HandHeart size={20} />
                    <span>近いものがあれば選択してください（複数選択可）</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {helpTopics.map((topic) => {
                      const isSelected = selectedTopics?.includes(topic.id);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => toggleTopic(topic.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                              : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                          }`}
                        >
                          {topic.carerLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </StepContainer>

          <div className="flex gap-4 mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowLeft size={20} />
                戻る
              </button>
            )}
            {isLastStep ? (
              <button
                type="submit"
                disabled={isSubmitting || !watchedValue}
                className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {isSubmitting ? "診断中..." : "診断結果を見る"}
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                disabled={!watchedValue}
                className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                次へ
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
