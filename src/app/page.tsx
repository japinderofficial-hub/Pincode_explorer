'use client';

import { FormEvent, useMemo, useState, useTransition } from 'react';
import { lookupBangalorePincodes, type LookupMode, type LookupResult } from '@/lib/lookup';

type ApiResponse = {
  query: string;
  mode: LookupMode;
  count: number;
  results: LookupResult[];
};

const quickSearches = [
  { label: 'MG Road', value: 'MG Road', mode: 'area' as const },
  { label: 'Indiranagar', value: 'Indiranagar', mode: 'area' as const },
  { label: '560038', value: '560038', mode: 'pincode' as const },
  { label: 'Koramangala', value: 'Koramangala', mode: 'area' as const }
];

export default function Home() {
  const [query, setQuery] = useState('560001');
  const [mode, setMode] = useState<LookupMode>('pincode');
  const [results, setResults] = useState<LookupResult[]>(lookupBangalorePincodes('560001'));
  const [summary, setSummary] = useState('Showing Bangalore GPO and nearby central locality matches.');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const exampleHints = useMemo(
    () => ({
      pincode: 'Try 560038, 560034, or 560070',
      area: 'Try Indiranagar, HSR Layout, or Whitefield'
    }),
    []
  );

  const runLookup = async (nextQuery = query, nextMode = mode) => {
    const trimmed = nextQuery.trim();

    if (!trimmed) {
      setError('Enter a pincode or area name first.');
      setResults([]);
      setSummary('Waiting for a search term.');
      return;
    }

    setError('');

    const response = await fetch(`/api/lookup?q=${encodeURIComponent(trimmed)}&mode=${nextMode}`);
    const data = (await response.json()) as ApiResponse;

    setResults(data.results);
    setSummary(
      data.count > 0
        ? `Found ${data.count} match${data.count === 1 ? '' : 'es'} for ${trimmed}.`
        : `No Bangalore postal matches found for ${trimmed}.`
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      void runLookup();
    });
  };

  const handleQuickSearch = (value: string, quickMode: LookupMode) => {
    setQuery(value);
    setMode(quickMode);
    startTransition(() => {
      void runLookup(value, quickMode);
    });
  };

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Bangalore postal atlas</span>
          <h1>Bangalore Pincode Explorer</h1>
          <p>
            Search by pincode or area name and get a curated view of Bangalore postal matches,
            backed by a server API and tuned for fast lookups.
          </p>
        </div>

        <div className="search-card">
          <form className="search-form" onSubmit={handleSubmit}>
            <label className="visually-hidden" htmlFor="query">
              Search query
            </label>
            <input
              id="query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={mode === 'pincode' ? exampleHints.pincode : exampleHints.area}
              inputMode={mode === 'pincode' ? 'numeric' : 'text'}
            />
            <div className="mode-switch" role="radiogroup" aria-label="Lookup mode">
              <button
                type="button"
                className={mode === 'pincode' ? 'active' : ''}
                onClick={() => setMode('pincode')}
              >
                Pincode
              </button>
              <button
                type="button"
                className={mode === 'area' ? 'active' : ''}
                onClick={() => setMode('area')}
              >
                Area
              </button>
            </div>
            <button type="submit" className="primary" disabled={isPending}>
              {isPending ? 'Searching...' : 'Explore'}
            </button>
          </form>

          <div className="quick-picks">
            {quickSearches.map((item) => (
              <button key={item.value} type="button" onClick={() => handleQuickSearch(item.value, item.mode)}>
                {item.label}
              </button>
            ))}
          </div>

          <p className="summary">{summary}</p>
          {error ? <p className="error">{error}</p> : null}
        </div>
      </section>

      <section className="results-panel">
        <div className="panel-header">
          <h2>Results</h2>
          <span>{results.length} records</span>
        </div>

        {results.length > 0 ? (
          <div className="result-grid">
            {results.map((result) => (
              <article className="result-card" key={result.pincode}>
                <div className="pincode">{result.pincode}</div>
                <ul>
                  {result.areas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No matches yet</h3>
            <p>{mode === 'pincode' ? 'Try a nearby central Bangalore pincode.' : 'Try a locality name from the sample chips above.'}</p>
          </div>
        )}
      </section>
    </main>
  );
}
