/**
 * Content Normalization & WordPress Cleaning Helpers for Blogs, Posts, and Commentaires.
 * Handles Visual Composer / WPBakery shortcodes, <style> tags, raw .vc_custom CSS blocks,
 * social icon stripping, WordPress REST API objects ({ rendered: '...' }),
 * MongoDB schemas, and curated Rajasthan travel image fallbacks.
 */

const CURATED_RAJASTHAN_IMAGES = [
  'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', // Mehrangarh Fort Jodhpur
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', // Jodhpur Blue City
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', // Taj Mahal / Palace
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', // Desert / Jaisalmer Camel
  'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80', // Varanasi Ghats
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Goa / Heritage
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', // Agra Fort
  'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80', // Jaipur Hawa Mahal
];

/**
 * Checks if an image URL is a valid photography cover image and NOT a social icon or tiny logo
 */
const isValidCoverImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  if (!lower.startsWith('http')) return false;
  if (lower.includes('undefined') || lower.includes('null')) return false;

  // Blacklist social icons and tiny asset logos imported by mistake from WP headers
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

/**
 * Cleans WordPress Visual Composer shortcodes, inline style tags, raw CSS, and unreadable colors
 */
export const cleanWordPressHtml = (rawHtml, fallbackExcerpt = '') => {
  if (!rawHtml && !fallbackExcerpt) return '';
  let html = String(rawHtml || '');

  // 1. Remove style and script tags entirely along with their content
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // 2. Remove raw .vc_custom CSS rule snippets like .vc_custom_1754630077768{margin-bottom: 5px !important;}
  html = html.replace(/\.vc_custom_[^{]+\{[^}]+\}/gi, '');
  html = html.replace(/\[\/?vc_[^\]]*\]/gi, '');
  html = html.replace(/\[\/?(gallery|contact-form-7|embed|caption)[^\]]*\]/gi, '');

  // 3. Remove standalone social-links header widgets
  html = html.replace(/<div class=["']social-links[^"']*["']>[\s\S]*?<\/div>/gi, '');

  // 4. Convert common Visual Composer headings
  html = html.replace(/\[vc_custom_heading[^\]]*text=["']([^"']+)["'][^\]]*\]/gi, '<h3 class="text-base font-bold text-slate-900 my-2">$1</h3>');

  // 5. Fix unreadable white/invisible inline colors
  html = html.replace(/color:\s*#(fff|ffffff|fafafa|f8fafc)/gi, 'color: #0f172a');
  html = html.replace(/color:\s*rgb\(255,\s*255,\s*255\)/gi, 'color: #0f172a');

  // 6. Remove empty tags and whitespace
  html = html.replace(/<p>\s*(&nbsp;|\s)*<\/p>/gi, '');
  html = html.replace(/<div>\s*(&nbsp;|\s)*<\/div>/gi, '');
  html = html.trim();

  // 7. Check if meaningful visible text remains (exclude just <img> tags for social icons)
  const plainCheck = html.replace(/<[^>]*>/g, '').trim();

  // If no text remains in content, use fallbackExcerpt!
  if (!plainCheck && fallbackExcerpt) {
    const cleanExcerpt = String(fallbackExcerpt)
      .replace(/\.vc_custom_[^{]+\{[^}]+\}/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
    if (cleanExcerpt) {
      return `<p class="leading-relaxed text-slate-700 text-sm">${cleanExcerpt}</p>`;
    }
  }

  // If after cleaning there are no HTML tags but plain text, wrap in paragraphs
  if (html && !/<[a-z][\s\S]*>/i.test(html)) {
    html = html
      .split(/\n\s*\n/)
      .filter((p) => p.trim())
      .map((para) => `<p class="leading-relaxed text-slate-700 text-sm mb-3">${para.trim().replace(/\n/g, '<br/>')}</p>`)
      .join('');
  }

  return html;
};

/**
 * Extracts and cleans HTML content from various item schemas (WordPress, MongoDB, REST)
 */
export const extractHtmlContent = (item) => {
  if (!item) return '';

  let raw = '';
  let fallbackExcerpt = '';

  if (typeof item === 'string') {
    raw = item;
  } else if (typeof item === 'object') {
    // Extract fallback excerpt if available
    if (item.excerpt) {
      fallbackExcerpt = typeof item.excerpt === 'object'
        ? (item.excerpt.rendered || item.excerpt.raw || '')
        : String(item.excerpt);
    }

    if (item.rendered && typeof item.rendered === 'string') raw = item.rendered;
    else if (item.raw && typeof item.raw === 'string') raw = item.raw;
    else if (item.text && typeof item.text === 'string') raw = item.text;
    else if (item.html && typeof item.html === 'string') raw = item.html;
    else {
      const candidates = [
        item.content,
        item.post_content,
        item.comment,
        item.comment_content,
        item.message,
        item.review,
        item.description,
        item.body,
        item.details,
        item.text,
        item.summary,
      ];

      for (const cand of candidates) {
        if (!cand) continue;
        if (typeof cand === 'string' && cand.trim() !== '') {
          raw = cand;
          break;
        }
        if (typeof cand === 'object') {
          const nested = cand.rendered || cand.raw || cand.text || cand.html || '';
          if (typeof nested === 'string' && nested.trim() !== '') {
            raw = nested;
            break;
          }
        }
      }
    }
  }

  return cleanWordPressHtml(raw, fallbackExcerpt);
};

export const extractTitle = (titleOrItem, fallback = 'Untitled') => {
  if (!titleOrItem) return fallback;
  if (typeof titleOrItem === 'string') return titleOrItem;
  if (typeof titleOrItem === 'object') {
    if (titleOrItem.rendered && typeof titleOrItem.rendered === 'string') return titleOrItem.rendered;
    if (titleOrItem.title) return extractTitle(titleOrItem.title, fallback);
    if (titleOrItem.name) return String(titleOrItem.name);
    if (titleOrItem.tourName) return String(titleOrItem.tourName);
    if (titleOrItem.subject) return String(titleOrItem.subject);
  }
  return fallback;
};

/**
 * Returns a valid photographic cover image, filtering out social icons and logos
 */
export const extractCoverImage = (item, index = 0) => {
  const fallback = CURATED_RAJASTHAN_IMAGES[Math.abs(index) % CURATED_RAJASTHAN_IMAGES.length];
  if (!item) return fallback;

  if (typeof item === 'object') {
    const candidates = [
      item.coverImage,
      item.featuredImage,
      item.featured_image,
      item.jetpack_featured_media_url,
      item.thumbnail,
      item.image,
      item.banner,
      item.img,
    ];

    for (const cand of candidates) {
      if (!cand) continue;
      if (typeof cand === 'string' && isValidCoverImageUrl(cand)) {
        return cand.trim();
      }
      if (typeof cand === 'object') {
        const nested = cand.url || cand.src || cand.source_url || cand.link || '';
        if (typeof nested === 'string' && isValidCoverImageUrl(nested)) {
          return nested.trim();
        }
      }
    }

    // Try extracting from content HTML (<img src="...">) if valid
    const rawContent = item.content || item.post_content || item.body || '';
    if (typeof rawContent === 'string' && rawContent.includes('<img')) {
      const matches = rawContent.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
      for (const m of matches) {
        if (m && m[1] && isValidCoverImageUrl(m[1])) {
          return m[1];
        }
      }
    }
  }

  if (typeof item === 'string' && isValidCoverImageUrl(item)) {
    return item.trim();
  }

  return fallback;
};

export const extractAuthorName = (author, fallback = 'Jodhpur Voyage') => {
  if (!author) return fallback;
  if (typeof author === 'string') return author;
  if (typeof author === 'object') {
    return author.name || author.username || author.email || author.author_name || fallback;
  }
  return String(author);
};

export const extractPlainText = (htmlOrText, maxLength = 160) => {
  if (!htmlOrText) return '';
  let raw = typeof htmlOrText === 'object' ? extractHtmlContent(htmlOrText) : String(htmlOrText);

  // 1. Remove style and script tags with their inner contents
  raw = raw.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ');
  raw = raw.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ');

  // 2. Remove raw .vc_custom CSS rule snippets
  raw = raw.replace(/\.vc_custom_[^{]+\{[^}]+\}/gi, ' ');

  // 3. Strip Visual Composer shortcodes [vc_...]
  raw = raw.replace(/\[\/?vc_[^\]]*\]/gi, ' ');
  raw = raw.replace(/\[\/?(gallery|contact-form-7|embed|caption)[^\]]*\]/gi, ' ');

  // 4. Strip HTML tags
  raw = raw.replace(/<[^>]*>/g, ' ');

  // 5. Decode common HTML entities
  const plain = raw
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

  if (maxLength && plain.length > maxLength) {
    return plain.slice(0, maxLength) + '...';
  }
  return plain;
};

