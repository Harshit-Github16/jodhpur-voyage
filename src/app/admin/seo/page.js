'use client';

import React, { useState, useMemo } from 'react';
import { useCities } from '@/context/CityContext';
import { useTours } from '@/context/TourContext';
import { useBlogs } from '@/context/BlogContext';
import {
  Globe,
  Search,
  Copy,
  Download,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Edit2,
  FileCode,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export default function SeoAndSitemapPage() {
  const { cities } = useCities();
  const { tours } = useTours();
  const { blogs } = useBlogs();

  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All'); // 'All' | 'Destination' | 'Tour Package' | 'Blog' | 'Static Page'

  const baseUrl = 'https://jodhpurvoyage.com';

  // Build full inventory of indexable pages
  const allIndexedPages = useMemo(() => {
    const list = [
      {
        type: 'Static Page',
        title: 'Home Page — Jodhpur Voyage',
        url: `${baseUrl}/`,
        slug: '/',
        priority: '1.0',
        changefreq: 'daily',
        metaTitle: 'Jodhpur Voyage — Royal Rajasthan Tours & Desert Safaris',
        metaDescription: 'Experience royal forts, blue city heritage walks, and starlit Thar desert camping in Jodhpur.',
      },
      {
        type: 'Static Page',
        title: 'All Tour Packages',
        url: `${baseUrl}/packages`,
        slug: '/packages',
        priority: '0.9',
        changefreq: 'daily',
        metaTitle: 'Rajasthan Tour Packages & Guided Fort Walks',
        metaDescription: 'Explore curated royal Rajasthan tours, desert camping, and heritage city sightseeing.',
      },
      {
        type: 'Static Page',
        title: 'Travel Blogs & Guides',
        url: `${baseUrl}/blogs`,
        slug: '/blogs',
        priority: '0.8',
        changefreq: 'weekly',
        metaTitle: 'Rajasthan Travel Guides & Blue City Insider Stories',
        metaDescription: 'Expert tips on Jodhpur street food, Osian desert safaris, and photography spots.',
      },
      {
        type: 'Static Page',
        title: 'Contact & Custom Inquiries',
        url: `${baseUrl}/contact`,
        slug: '/contact',
        priority: '0.8',
        changefreq: 'monthly',
        metaTitle: 'Contact Jodhpur Voyage — Plan Your Royal Rajasthan Tour',
        metaDescription: 'Get in touch with local tour experts for custom private itineraries and group bookings.',
      },
    ];

    // Destinations
    cities.forEach((c) => {
      list.push({
        type: 'Destination',
        title: c.name,
        url: `${baseUrl}/destinations/${c.slug || c.name.toLowerCase()}`,
        slug: `/destinations/${c.slug || c.name.toLowerCase()}`,
        priority: '0.9',
        changefreq: 'weekly',
        metaTitle: c.metaTitle || `${c.name} Tour Packages & Sightseeing Guide`,
        metaDescription: c.metaDescription || c.tagline || `Explore top attractions in ${c.name}.`,
      });
    });

    // Tour Packages
    tours.forEach((t) => {
      list.push({
        type: 'Tour Package',
        title: t.title,
        url: `${baseUrl}/packages/${t.slug || t.id}`,
        slug: `/packages/${t.slug || t.id}`,
        priority: '0.95',
        changefreq: 'daily',
        metaTitle: t.seo?.metaTitle || t.title,
        metaDescription: t.seo?.metaDescription || t.description?.slice(0, 150) || 'Book now.',
      });
    });

    // Blogs
    blogs.forEach((b) => {
      list.push({
        type: 'Blog',
        title: b.title,
        url: `${baseUrl}/blogs/${b.slug || b.id}`,
        slug: `/blogs/${b.slug || b.id}`,
        priority: '0.7',
        changefreq: 'monthly',
        metaTitle: b.seo?.metaTitle || b.title,
        metaDescription: b.seo?.metaDescription || b.excerpt || 'Read travel story.',
      });
    });

    return list;
  }, [cities, tours, blogs]);

  // Generate XML String
  const xmlSitemapContent = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const urls = allIndexedPages
      .map(
        (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }, [allIndexedPages]);

  const handleCopyXML = () => {
    navigator.clipboard.writeText(xmlSitemapContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadXML = () => {
    const blob = new Blob([xmlSitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredPages = allIndexedPages.filter((item) => {
    const matchesFilter = selectedFilter === 'All' || item.type === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      item.metaTitle.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              SEO & Dynamic Sitemap.xml Generator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              {allIndexedPages.length} Indexed URLs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time XML sitemap generation, Google Search Console ready, URL slug manager, and meta tag auditor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyXML}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Sitemap XML'}</span>
          </button>
          <button
            onClick={handleDownloadXML}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download sitemap.xml</span>
          </button>
        </div>
      </div>

      {/* SEO Health Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Indexable URLs</p>
          <p className="text-xl font-black text-slate-900 mt-1">{allIndexedPages.length}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Crawlable</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tour Package Pages</p>
          <p className="text-xl font-black text-slate-900 mt-1">{tours.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Priority 0.95</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination Hubs</p>
          <p className="text-xl font-black text-slate-900 mt-1">{cities.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Priority 0.90</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Travel Articles</p>
          <p className="text-xl font-black text-slate-900 mt-1">{blogs.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Priority 0.70</p>
        </div>
      </div>

      {/* Live Sitemap XML Code Viewer */}
      <div className="bg-[#0b1120] text-slate-200 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-white">Live sitemap.xml Preview</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Standard 0.9 Protocol</span>
        </div>
        <div className="max-h-48 overflow-y-auto bg-[#070b14] p-4 rounded-xl font-mono text-[11px] text-amber-200/90 leading-relaxed border border-slate-800/80 custom-scrollbar">
          <pre>{xmlSitemapContent}</pre>
        </div>
      </div>

      {/* URL Slugs & Meta Tags Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">URL Slug & Meta Tag Audit Table</h3>
            <p className="text-xs text-slate-400">Review all active URL paths, meta titles, and descriptions</p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Page Types</option>
              <option value="Static Page">Static Pages</option>
              <option value="Destination">Destinations</option>
              <option value="Tour Package">Tour Packages</option>
              <option value="Blog">Travel Blogs</option>
            </select>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter slugs / titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Page Type</th>
                <th className="py-3 px-4">Resource Title</th>
                <th className="py-3 px-4">URL Slug</th>
                <th className="py-3 px-4">Meta Title & Description</th>
                <th className="py-3 px-4 text-center">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPages.map((page, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 align-top">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        page.type === 'Tour Package'
                          ? 'bg-amber-100 text-amber-900'
                          : page.type === 'Destination'
                          ? 'bg-blue-100 text-blue-900'
                          : page.type === 'Blog'
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {page.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 align-top font-bold text-slate-900 max-w-[160px] truncate">
                    {page.title}
                  </td>
                  <td className="py-3 px-4 align-top font-mono text-[11px] text-amber-800 max-w-[200px] truncate">
                    {page.slug}
                  </td>
                  <td className="py-3 px-4 align-top max-w-[280px]">
                    <div className="font-semibold text-slate-800 line-clamp-1">{page.metaTitle}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{page.metaDescription}</div>
                  </td>
                  <td className="py-3 px-4 align-top text-center font-mono font-bold text-slate-700">
                    {page.priority}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
