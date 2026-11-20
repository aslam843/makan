import { ArrowRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SmartImage } from '../components/SmartImage';
import { formatDateReadable, usePageSEO } from '../lib/formatters';
import type { BlogPost } from '../shared/types';

const BLOG_CATEGORIES = [
  'All',
  'Buying Guides',
  'Market Updates',
  'Legal Documentation',
  'Home Loans',
  'Location Analysis',
  'Investment Insights',
] as const;

export function BlogListPage() {
  usePageSEO(
    'Knowledge Hub & Home Buying Guides | MAKANI',
    'Research-backed Indian real estate guides covering carpet area loading, RERA legal checklists, home loan spreads, and Bengaluru & Mumbai micro-market updates.'
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (q.trim()) params.set('q', q.trim());
    setSearchParams(params, { replace: true });

    setLoading(true);
    fetch(`/api/blogs?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d.posts) ? d.posts : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [category, q, setSearchParams]);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-[#4B5563] mb-1.5">MAKANI Knowledge Hub</p>
              <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-slate-950">
                Research, Guides &amp; Market Intelligence
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                Practical playbooks authored by our architects, real estate lawyers, and mortgage
                analysts—written in plain English with real registered numbers.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search RERA, carpet area, Powai..."
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#4B5563]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  category === cat
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-slate-200 h-96 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <h2 className="font-editorial text-2xl font-semibold text-slate-950">No articles found</h2>
            <button
              type="button"
              onClick={() => {
                setCategory('All');
                setQ('');
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-slate-950 rounded-lg cursor-pointer"
            >
              Show all articles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 overflow-hidden flex flex-col transition-colors"
              >
                <Link to={`/blog/${post.slug}`} className="block aspect-[4/3] overflow-hidden bg-slate-100">
                  <SmartImage
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </Link>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-[#4B5563]">{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDateReadable(post.publishedAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTimeMinutes} min read</span>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block font-editorial text-xl font-semibold text-slate-950 group-hover:text-[#4B5563] transition-colors leading-snug"
                    >
                      {post.title}
                    </Link>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{post.authorName}</div>
                      <div className="text-slate-500">{post.authorRole}</div>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-[#4B5563]"
                    >
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
