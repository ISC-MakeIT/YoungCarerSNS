import Link from "next/link";

export default function LandingPage() {
    return (
        <main>
            <h1>This is a Landing Page</h1>
            <ul>
            <li><Link href="login">ログインする</Link></li>
            <li><Link href="register">初めての方はこちら</Link></li>
            <li><Link href="reflection">振り返る</Link></li>
            <li><Link href="register?role=supporter">サポートを始める</Link></li>
            </ul>
        </main>
    )
}