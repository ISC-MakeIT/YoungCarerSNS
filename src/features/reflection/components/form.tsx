"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { SelectionCard } from "@/components/ui/selection-card"
import { StepContainer } from "@/components/ui/step-container"
import { Moon, Star, Cloud, Sun, Sparkles, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react"

type FormValues = {
  practical: string
  care: string
  emotional: string
  others: string
  duration: string
  weekly_hours: string
  time_impact: string
  wants_support: string
}

const QUESTIONS = [
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

export const ReflectionForm = () => {
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<number | null>(null)
  
  const { register, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      practical: "",
      care: "",
      emotional: "",
      others: "",
      duration: "",
      weekly_hours: "",
      time_impact: "",
      wants_support: "",
    }
  })

  const currentQuestion = QUESTIONS[step]
  const isLastStep = step === QUESTIONS.length - 1
  const watchedValue = watch(currentQuestion?.id as keyof FormValues)

  const onSubmit = (data: FormValues) => {
    const totalScore = Object.values(data).reduce((acc, val) => acc + (Number(val) || 0), 0)
    setResult(totalScore)
  }

  const nextStep = () => {
    if (watchedValue) {
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
  }

  if (result !== null) {
    let MarkIcon = Sparkles
    let markText = "✨ きらきらマーク"
    let colorClass = "text-pink-500"
    let feedback = "あなたは家事やお家のことをお手伝いしている優しい方ですね。自分自身の時間も大切にしてください。"

    if (result >= 90) {
      MarkIcon = Moon
      markText = "🌕 月マーク"
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
      feedback = "ケアと自分の時間のバランスを保てているようです。今の調子で自分も大切にしていきましょう。"
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto p-8 text-center space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">結果</h2>
            <div className={`p-8 bg-gray-50 rounded-full w-48 h-48 mx-auto flex items-center justify-center border-4 border-current ${colorClass}`}>
              <MarkIcon size={80} strokeWidth={1.5} />
            </div>
            <div className={`text-3xl font-black ${colorClass}`}>{markText}</div>
            <div className="text-5xl font-bold text-gray-900">{result} <span className="text-xl">点</span></div>
          </div>
          
          <p className="text-lg text-gray-700 leading-relaxed bg-blue-50 p-6 rounded-xl border border-blue-100">
            {feedback}
          </p>

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
      <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8 bg-white rounded-2xl shadow-2xl border border-gray-100 min-h-[500px] flex flex-col">
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
            </div>
          </StepContainer>

          <div className="flex gap-4 mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
              >
                <ArrowLeft size={20} />
                戻る
              </button>
            )}
            {isLastStep ? (
              <button
                type="submit"
                disabled={!watchedValue}
                className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                診断結果を見る
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
