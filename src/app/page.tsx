import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-screen bg-black">
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="mb-10 max-w-screen-sm text-center">
          <h1 className="text-2xl font-bold text-stone-200">
            Oi, Bibi, meu amorzinho 🥹❤️
          </h1>
          <p className="mt-5 text-stone-400">
            Fiz esse pra que você cuide da sua saúde e se mantenha hidratada
            🥹❤️
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/login"
            className="text-stone-400 underline transition-all hover:text-stone-200"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-stone-400 underline transition-all hover:text-stone-200"
          >
            Cadastro
          </Link>
        </div>
      </div>
    </div>
  );
}
