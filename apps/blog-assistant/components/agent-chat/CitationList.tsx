import type { Citation } from "@/lib/citations";

type Props = {
  items: Citation[];
};

export function CitationList({ items }: Props) {
  if (!items.length) return null;

  return (
    <div className="citations" aria-label="引用来源">
      <p className="citations-label">引用来源</p>
      <ul className="citations-list">
        {items.map((item) => (
          <li key={`${item.url}-${item.index}`}>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              className="citation-link"
            >
              [{item.index}] {item.title}
              {item.heading ? ` · ${item.heading}` : ""}
            </a>
            {item.preview && (
              <p className="citation-preview">{item.preview}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
