import Link from "next/link";
import { Heart, Users, MessageCircle, ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FFFEFC]">
            {/* Hero Section */}
            <header className="relative bg-gradient-to-b from-blue-50/50 to-white px-6 pt-24 pb-32 text-center overflow-hidden">
                <div className="absolute top-10 left-10 text-blue-100 animate-pulse">
                    <Sparkles size={48} />
                </div>
                <div className="absolute bottom-10 right-10 text-orange-100 animate-bounce">
                    <Heart size={48} />
                </div>

                <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                    <div className="inline-flex items-center space-x-2 bg-white border border-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                        <Heart size={16} className="fill-slate-400 text-slate-400" />
                        <span>日々の暮らしのなかの、ひと息つける場所に</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                        家族のために頑張る、<br className="md:hidden" />
                        あなたのための。
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        安心できる誰かと、日々のことや気持ちを共有する。<br className="hidden md:block" />
                        必要なときに、少しだけ話を聞いてもらう。そんな、静かな場所です。
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link 
                            href="/register" 
                            className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center active:scale-95"
                        >
                            はじめる
                            <ArrowRight size={20} className="ml-2" />
                        </Link>
                        <Link 
                            href="/login" 
                            className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                        >
                            ログイン
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features section */}
            <section className="px-6 py-24 bg-white">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-left">
                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                        <div className="w-14 h-14 bg-white text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center">
                            <Users size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">誰かと話してみる</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            状況が似ている誰かと、日々の悩みや何気ない言葉を交わせます。一人きりではないと感じられるかもしれません。
                        </p>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                        <div className="w-14 h-14 bg-white text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center">
                            <MessageCircle size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">助力を求める</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            自分だけでは解決が難しいとき、経験のある人に尋ねたり、掲示板で意見を聞いたりできます。
                        </p>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                        <div className="w-14 h-14 bg-white text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center">
                            <Sparkles size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">今の状態を知る</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            「振り返り」を記録することで、客観的に今の自分の状態を整理できます。静かに自分と向き合う時間を作ります。
                        </p>
                    </div>
                </div>
            </section>

            {/* Sub feature links / Quick Action */}
            <section className="pb-24 flex justify-center px-6">
                <Link 
                    href="/reflection" 
                    className="group max-w-2xl w-full flex flex-col md:flex-row items-center justify-between p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-blue-50/50 hover:border-blue-100"
                >
                    <div className="flex-1 text-center md:text-left space-y-2 mb-6 md:mb-0">
                        <div className="flex items-center justify-center md:justify-start space-x-2 text-blue-600 mb-1">
                            <Sparkles size={18} />
                            <span className="text-xs font-bold tracking-wider uppercase">振り返り機能</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">
                            自分の状態と向き合う。
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            登録不要。静かな場所で自分と向き合う時間を作ります。
                        </p>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-400 group-hover:text-blue-600 font-bold transition-colors">
                        <span className="text-sm">はじめる</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </section>

            {/* Supporter recruit */}
            <section className="px-6 py-24 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800">サポーターとして参加する</h2>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            家族のケアと向き合う若い世代を支えたい、学生サポーターを募集しています。元ケアラーの方や専門的に学んでいる方はもちろん、「自分にできることがあれば」という気持ちのある方も歓迎しています。
                        </p>
                        <div className="pt-2">
                            <Link 
                                href="/register?role=supporter" 
                                className="inline-flex items-center text-blue-600 font-bold hover:underline group"
                            >
                                <span>サポーターとして登録する</span>
                                <ArrowRight size={16} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 text-center text-slate-400 text-sm bg-white">
                <p>&copy; 2026 Family Care Connect</p>
            </footer>
        </div>
    )
}
