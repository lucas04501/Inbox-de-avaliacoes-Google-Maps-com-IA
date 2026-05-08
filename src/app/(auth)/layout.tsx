export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            ReputaçãoAI
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sua reputação online, potencializada por IA.
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
