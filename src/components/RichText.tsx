import { Fragment, type ReactNode } from "react";

/**
 * Minimal inline formatting for admin-editable copy.
 *
 * The design leans on italic accent phrases inside headings ("a *Unique* take
 * on…"), and on hard line breaks. Rather than expose HTML to the admin — which
 * would mean trusting stored markup — copy uses two safe conventions:
 *
 *   *asterisks*  → <em> accent text
 *   line breaks  → <br />
 *   blank line   → new paragraph (see `Paragraphs`)
 *
 * Everything else is rendered as plain text, so nothing typed in the admin can
 * inject markup.
 */

const emphasise = (line: string, keyPrefix: string): ReactNode[] =>
  line.split(/(\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });

/** One block of text: `*accents*` become <em>, newlines become <br />. */
export const RichText = ({ text }: { text: string | undefined }) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {emphasise(line, String(i))}
        </Fragment>
      ))}
    </>
  );
};

/**
 * Body copy split into paragraphs on blank lines. Each paragraph gets
 * `className`, so callers keep full control of typography.
 */
export const Paragraphs = ({
  text,
  className,
}: {
  text: string | undefined;
  className?: string;
}) => {
  if (!text) return null;
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => (
        <p key={i} className={className}>
          <RichText text={block} />
        </p>
      ))}
    </>
  );
};

export default RichText;
