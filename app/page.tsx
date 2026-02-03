
import BgRemoverApp from '@/components/bg-remover-app';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white flex flex-col items-center justify-center p-4">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <main className="w-full relative z-10">
        <BgRemoverApp />
      </main>

      <footer className="mt-12 text-center text-slate-400 text-sm relative z-10">
        <p>© {new Date().getFullYear()} AI Background Remover. Powered by Remove.bg.</p>
      </footer>
    </div>
  );
}
