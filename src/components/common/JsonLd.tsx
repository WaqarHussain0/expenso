/**
 * Renders schema.org structured data. `<` is escaped so content can never
 * close the script tag. Data blocks (non-JS `type`) aren't executed, so the
 * strict CSP doesn't need a nonce for them.
 */
const JsonLd: React.FC<{ data: Record<string, unknown> }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
);

export default JsonLd;
