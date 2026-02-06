import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ログイン済みの場合、アクティビティを更新
  if (user) {
    const lastUpdate = request.cookies.get('last-activity-update')?.value
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000

    if (!lastUpdate || now - parseInt(lastUpdate) > fiveMinutes) {
      // 非同期で実行（レスポンスを待たせないことも検討できるが、確実性を優先）
      await supabase
        .from('user_activity')
        .upsert({ user_id: user.id, last_active_at: new Date().toISOString() })
      
      supabaseResponse.cookies.set('last-activity-update', now.toString(), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }
  }

  const url = request.nextUrl.clone()

  // 1. ログインしていない場合、(auth) 配下のページへのアクセスを /login にリダイレクト
  const protectedPaths = ['/home', '/matching', '/chat', '/board', '/profile'] 
  const isProtectedPath = protectedPaths.some(path => url.pathname.startsWith(path))

  if (!user && isProtectedPath) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. 既にログインしている場合、/login または /register へのアクセスを /home にリダイレクト
  const authPaths = ['/login', '/register']
  const isAuthPath = authPaths.some(path => url.pathname === path)

  if (user && isAuthPath) {
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
