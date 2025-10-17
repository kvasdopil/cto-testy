export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold sm:text-5xl">Hello, world</h1>
        <p className="text-lg text-base-content/80 sm:text-xl">
          This Next.js starter is configured with Tailwind CSS, daisyUI, ESLint, Prettier, and
          JSCPD so you can build accessible, beautiful interfaces faster.
        </p>
        <button type="button" className="btn btn-primary">
          Explore components
        </button>
      </div>
    </main>
  );
}
