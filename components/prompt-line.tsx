/**
 * A finished-session prompt line: visible as `svf@porfolio:~$ <cmd>`,
 * announced to assistive tech (and heading outlines) as `label`.
 */
export function PromptLine({
  cmd,
  label,
  as: Tag = "h2",
}: {
  cmd: string;
  label: string;
  as?: "h2" | "p";
}) {
  return (
    <Tag className="text-sm">
      <span aria-hidden="true">
        <span className="text-[var(--muted)]">svf@porfolio:~$</span> {cmd}
      </span>
      <span className="sr-only">{label}</span>
    </Tag>
  );
}
