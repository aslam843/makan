import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SmartImage } from '../components/SmartImage';
import { useAppContext } from '../context/AppContext';
import { formatDateReadable, usePageSEO } from '../lib/formatters';
import type { BlogPost } from '../shared/types';

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { openLeadModal } = useAppContext();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`/api/blogs/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((d) => {
        setPost(d.post);
        setRelated(Array.isArray(d.related) ? d.related : []);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const articleSchema = useMemo(() => {
    if (!post) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      author: {
        '@type': 'Person',
        name: post.authorName,
      },
    };
  }, [post]);

  usePageSEO(
    post ? `${post.title} | MAKANI Knowledge Hub` : 'Article | MAKANI',
    post ? post.excerpt : 'Real estate research and home buying guides by MAKANI.',
    articleSchema
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-5">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-12 bg-slate-200 rounded w-3/4" />
        <div className="aspect-[16/9] bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-editorial text-3xl font-semibold text-slate-950">Article Not Found</h1>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-950 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Knowledge Hub
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white pb-24">
      <div className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-950"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Knowledge Hub Guides
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-[#4B5563]">{post.category}</span>
            <span>·</span>
            <span>{formatDateReadable(post.publishedAt)}</span>
            <span>·</span>
            <span>{post.readTimeMinutes} min read</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-950 leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">{post.excerpt}</p>

          <div className="pt-2 text-sm">
            <span className="font-semibold text-slate-950">{post.authorName}</span>
            <span className="text-slate-500"> · {post.authorRole}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
          <SmartImage
            src={post.coverImage}
            alt={post.title}
            priority
            className="w-full h-full object-cover"
          />
        </div>

        {/* Key Takeaways Box (hairline border, no thick left stripe) */}
        <div className="p-6 sm:p-7 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <h2 className="text-sm font-semibold text-slate-950">Key Takeaways</h2>
          <ul className="space-y-2.5 text-sm text-slate-700">
            {post.keyTakeaways.map((kt) => (
              <li key={kt} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#4B5563] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{kt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Editorial Body Sections */}
        <div className="space-y-8">
          {post.sections.map((sec) => (
            <section key={sec.heading} className="space-y-3">
              <h2 className="font-editorial text-2xl font-semibold text-slate-950">
                {sec.heading}
              </h2>
              <p className="text-base text-slate-700 leading-[1.75]">{sec.body}</p>
            </section>
          ))}
        </div>

        {/* Contextual Advisory CTA */}
        <div className="p-7 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h3 className="font-editorial text-2xl font-semibold">
              Want an architect to audit your shortlisted home?
            </h3>
            <p className="text-sm text-slate-300">
              Speak with our Bengaluru or Mumbai advisory desk for free—no spam, no obligations.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              openLeadModal({
                title: 'Speak With Our Research Desk',
                defaultRequirements: `Read guide: ${post.title}`,
              })
            }
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#4B5563] hover:bg-[#374151] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            Book a Free Call
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="pt-10 border-t border-slate-200 space-y-5">
            <h2 className="font-editorial text-2xl font-semibold text-slate-950">
              Continue Reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/blog/${item.slug}`}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-2"
                >
                  <div className="text-xs text-[#4B5563] font-medium">{item.category}</div>
                  <div className="font-semibold text-sm text-slate-950 line-clamp-2">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500">{item.readTimeMinutes} min read</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
