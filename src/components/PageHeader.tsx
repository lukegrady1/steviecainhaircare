/* Title block for inner pages. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-12">
        <p className="t-eyebrow text-sage">{eyebrow}</p>
        <h1 className="t-display mt-3 max-w-3xl text-4xl text-ink sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
