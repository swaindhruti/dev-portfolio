/** The `$ command ........ status` line that sits under the header on every inner page. */
export function CommandBar({
  children,
  aside,
  className = "",
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto box-border w-full max-w-[1180px] flex-none px-4 pt-6 pb-5 sm:px-8 sm:pt-9 ${className}`}>
      {/* First thing to arrive on every page: slot 0 of the entry stagger. */}
      <div className="rise flex flex-wrap justify-between gap-x-8 gap-y-2 leading-5 text-dim">
        <span>{children}</span>
        {aside != null && <span>{aside}</span>}
      </div>
    </div>
  );
}
