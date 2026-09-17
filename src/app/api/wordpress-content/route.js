import { NextResponse } from 'next/server';

/**
 * API Route: /api/wordpress-content
 * Fetches the full original article content and images directly from the WordPress website
 * when the MongoDB record only contains truncated headers / social widgets.
 */

const isValidCoverImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  if (!lower.startsWith('http')) return false;
  if (lower.includes('undefined') || lower.includes('null')) return false;

  const badPatterns = [
    'tripad-icon',
    'trustpilot-icon',
    'instagram',
    'facebook',
    'twitter',
    'social-icon',
    'untitled-2',
    'untitled-3',
    'icon.png',
    'icon.svg',
    'favicon',
    'logo.png',
    'logo.svg',
    'avatar',
  ];

  return !badPatterns.some((pattern) => lower.includes(pattern));
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');
  const slug = searchParams.get('slug');
  const type = searchParams.get('type') || 'blog'; // 'blog' | 'post' | 'commentaire'

  if (!rawUrl && !slug) {
    return NextResponse.json({ success: false, message: 'Missing url or slug parameter' }, { status: 400 });
  }

  // Construct possible candidate URLs to fetch
  const urlsToTry = [];
  if (rawUrl && rawUrl.startsWith('http')) {
    urlsToTry.push(rawUrl);
  }
  if (slug) {
    if (type === 'blog') {
      urlsToTry.push(`https://www.jodhpurvoyage.com/blog/${slug}/`);
      urlsToTry.push(`https://www.jodhpurvoyage.com/${slug}/`);
    } else if (type === 'commentaire') {
      urlsToTry.push(`https://www.jodhpurvoyage.com/commentaire/${slug}/`);
      urlsToTry.push(`https://www.jodhpurvoyage.com/${slug}/`);
    } else {
      urlsToTry.push(`https://www.jodhpurvoyage.com/${slug}/`);
      urlsToTry.push(`https://www.jodhpurvoyage.com/blog/${slug}/`);
    }
  }

  let html = null;
  let successUrl = null;

  for (const targetUrl of urlsToTry) {
    try {
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        next: { revalidate: 3600 }, // cache for 1 hour
      });

      if (res.ok) {
        const text = await res.text();
        if (text && text.includes('entry-content') || text.includes('single-post') || text.includes('<article')) {
          html = text;
          successUrl = targetUrl;
          break;
        }
      }
    } catch (e) {
      console.warn(`Failed fetching ${targetUrl}:`, e.message);
    }
  }

  if (!html) {
    return NextResponse.json(
      { success: false, message: 'Could not fetch full article content from WordPress' },
      { status: 404 }
    );
  }

  // 1. Extract Main Article Body
  let extractedContent = '';
  const entryMatch =
    html.match(/<div class=["']entry-content["'][^>]*>([\s\S]*?)<\/div>\s*<!--/i) ||
    html.match(/<div class=["']entry-content["'][^>]*>([\s\S]*?)<\/div>/i) ||
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);

  if (entryMatch) {
    extractedContent = entryMatch[1];
  } else {
    const singlePostMatch = html.match(/<div id=["']content["'][^>]*>([\s\S]*?)<\/div>/i);
    if (singlePostMatch) {
      extractedContent = singlePostMatch[1];
    }
  }

  // 2. Clean Forms, Scripts, Styles, VC shortcodes, and header widgets
  if (extractedContent) {
    extractedContent = extractedContent
      .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')
      .replace(/<div class=["']request-block["'][^>]*>[\s\S]*?<\/div>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/\.vc_custom_[^{]+\{[^}]+\}/gi, '')
      .replace(/\[\/?vc_[^\]]*\]/gi, '')
      .replace(/\[\/?(gallery|contact-form-7|embed|caption)[^\]]*\]/gi, '')
      .replace(/<div class=["']social-links[^"']*["']>[\s\S]*?<\/div>/gi, '')
      .replace(/<span id=["']more-\d+["']><\/span>/gi, '')
      .replace(/color:\s*#(fff|ffffff|fafafa|f8fafc)/gi, 'color: #0f172a')
      .replace(/color:\s*rgb\(255,\s*255,\s*255\)/gi, 'color: #0f172a')
      .trim();
  }

  // 3. Extract Real Cover / Featured Image
  let extractedCoverImage = null;

  // Try from JSON-LD schema
  const jsonLdMatch = html.match(/"image":\s*\{\s*"@type":\s*"ImageObject",\s*"url":\s*"([^"]+)"/i);
  if (jsonLdMatch && isValidCoverImageUrl(jsonLdMatch[1])) {
    extractedCoverImage = jsonLdMatch[1];
  }

  // Try from OpenGraph
  if (!extractedCoverImage) {
    const ogMatch =
      html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
    if (ogMatch && isValidCoverImageUrl(ogMatch[1])) {
      extractedCoverImage = ogMatch[1];
    }
  }

  // Try from first valid <img> in article body
  if (!extractedCoverImage && extractedContent) {
    const imgMatches = extractedContent.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
    for (const m of imgMatches) {
      if (m && m[1] && isValidCoverImageUrl(m[1])) {
        extractedCoverImage = m[1];
        break;
      }
    }
  }

  return NextResponse.json({
    success: true,
    url: successUrl,
    content: extractedContent,
    coverImage: extractedCoverImage,
  });
}
