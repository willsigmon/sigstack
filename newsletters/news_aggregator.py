#!/usr/bin/env python3
"""
SigStack News Aggregator
Fetches RSS feeds and sends curated news@sigstack.dev newsletter
Premium table-based design with images and contextual insights
"""

import json
import os
import re
import requests
import feedparser
import anthropic
from datetime import datetime, timedelta, timezone
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from email.utils import parsedate_to_datetime
import time

# AI curation client
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
ai_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

# Bookmark context integration
from bookmark_context import load_bookmark_context, score_item_with_bookmarks, get_bookmark_reminders

# Resend API config
RESEND_API_KEY = "re_Czsz1gQW_Dz4H2a9dH8tTjgteeDCjVujF"
RESEND_API_URL = "https://api.resend.com/emails"

# Load feeds config
FEEDS_PATH = Path(__file__).parent / "feeds.json"

# Section configuration with emojis, colors, and fallback image keywords
SECTION_CONFIG = {
    "ai_tech": {"title": "AI & Tech", "emoji": "&#x1F916;", "color": "#a78bfa", "fallback_img": "artificial+intelligence+neural+network"},
    "tech_apple": {"title": "Apple", "emoji": "&#x1F4F1;", "color": "#60a5fa", "fallback_img": "apple+technology+devices"},
    "news": {"title": "Breaking News", "emoji": "&#x1F4E2;", "color": "#ef4444", "fallback_img": "breaking+news+headline"},
    "dev_tools": {"title": "Dev Tools", "emoji": "&#x1F6E0;", "color": "#4ade80", "fallback_img": "code+programming+developer"},
    "podcasts": {"title": "Podcasts", "emoji": "&#x1F3A7;", "color": "#f472b6", "fallback_img": "podcast+microphone+audio"},
    "local_nc": {"title": "Local NC", "emoji": "&#x1F3D8;", "color": "#fbbf24", "fallback_img": "north+carolina+raleigh"},
    "food": {"title": "Food & Dining", "emoji": "&#x1F37D;", "color": "#fb7185", "fallback_img": "food+restaurant+dining"},
    "disney": {"title": "Disney & Parks", "emoji": "&#x1F3F0;", "color": "#818cf8", "fallback_img": "theme+park+disney"},
    "bookmarks": {"title": "From Your Bookmarks", "emoji": "&#x1F516;", "color": "#38bdf8", "fallback_img": "bookmarks+reading"},
}


def get_fallback_image(category, title=""):
    """Generate an AI image URL for stories without images using Pollinations.ai"""
    # Extract first 3 meaningful words from title for prompt
    stop_words = {"the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for", "of", "and", "or", "but", "with", "from", "by", "how", "why", "what", "when"}
    words = [w for w in re.sub(r'[^\w\s]', '', title.lower()).split() if w not in stop_words][:4]
    title_keywords = "+".join(words) if words else ""

    config = SECTION_CONFIG.get(category, {})
    category_keywords = config.get("fallback_img", "technology")

    prompt = f"{title_keywords}+{category_keywords}+editorial+photography" if title_keywords else f"{category_keywords}+editorial+photography"
    # Pollinations.ai generates free AI images from URL - no API key needed
    return f"https://image.pollinations.ai/prompt/{prompt}?width=600&height=320&nologo=true"


def clean_summary_html(raw_html):
    """Clean RSS summary HTML, preserving useful formatting (lists, bold, paragraphs).
    Returns email-safe HTML with no truncation."""
    if not raw_html:
        return ""

    # Allowed tags for email-safe formatting
    allowed_tags = {'p', 'br', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a'}

    # Remove script/style blocks entirely
    text = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', raw_html, flags=re.DOTALL | re.IGNORECASE)

    # Remove images (we handle those separately)
    text = re.sub(r'<img[^>]*/?>', '', text, flags=re.IGNORECASE)

    # Remove divs/spans but keep their content
    text = re.sub(r'</?(?:div|span|section|article|header|footer|figure|figcaption|blockquote)[^>]*>', '', text, flags=re.IGNORECASE)

    # Strip tags that aren't in allowed list
    def strip_tag(match):
        tag_full = match.group(0)
        tag_name = re.match(r'</?(\w+)', tag_full)
        if tag_name and tag_name.group(1).lower() in allowed_tags:
            return tag_full
        return ''

    text = re.sub(r'<[^>]+>', strip_tag, text)

    # Clean up whitespace
    text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)
    text = text.strip()

    # If after cleaning there's no HTML structure, convert newlines to <br>
    if '<' not in text and '\n' in text:
        text = text.replace('\n', '<br>')

    # Style list items for email (inline styles since email has no CSS)
    text = text.replace('<ul>', '<ul style="margin: 8px 0; padding-left: 20px;">')
    text = text.replace('<ol>', '<ol style="margin: 8px 0; padding-left: 20px;">')
    text = text.replace('<li>', '<li style="margin-bottom: 4px; color: #c0c0c0;">')
    text = text.replace('<a ', '<a style="color: #ff6b35; text-decoration: none;" ')

    return text


def curate_stories(items, category_key):
    """Use Claude Haiku to score, filter, and rewrite summaries for a batch of stories.
    Returns enriched items with AI summaries and worthiness scores."""
    if not ai_client or not items:
        return items

    config = SECTION_CONFIG.get(category_key, {})
    category_name = config.get("title", category_key)

    # Build compact batch payload - just title + raw summary text
    stories_payload = []
    for i, item in enumerate(items):
        # Strip HTML from summary for the AI prompt
        raw_text = re.sub(r'<[^>]+>', ' ', item.get("summary", ""))
        raw_text = re.sub(r'\s+', ' ', raw_text).strip()
        stories_payload.append({
            "id": i,
            "title": item.get("title", ""),
            "source": item.get("source", ""),
            "summary_text": raw_text
        })

    prompt = f"""You are the editor-in-chief for "The SigStack," a daily briefing for a tech-savvy software developer, Apple/AI enthusiast, and entrepreneur in Raleigh NC.

Category: {category_name}

For each story below, do THREE things:

1. SCORE it 1-10 for this reader. Consider newsworthiness, relevance to developers/AI/tech/Apple, and signal-to-noise. Filter out listicles, SEO bait, rehashed takes, and fluff.

2. REWRITE THE TITLE in a clear, direct, no-BS editorial voice. Make it immediately tell the reader what happened. No clickbait, no questions, no "you won't believe" energy. Just the news, stated plainly and compellingly.
   - Bad: "This new feature might change everything"
   - Good: "GitHub Copilot now writes entire pull requests autonomously"
   - Bad: "Why an M5 MacBook Pro launch in March keeps the M6 OLED dream alive"
   - Good: "M5 MacBook Pro likely coming in March — M6 OLED still on track"

3. WRITE A SUMMARY (2-4 sentences) covering:
   - What happened (the news, clearly stated)
   - Why it matters (the insight — what should this reader care about?)
   Write with confidence. No fluff. No "In this article..." or "According to reports..." openers. Get straight to the point.

Stories:
{json.dumps(stories_payload, indent=2)}

Return ONLY valid JSON - an array of objects with these exact keys:
[
  {{"id": 0, "score": 8, "title": "Your rewritten headline", "summary": "Your 2-4 sentence editorial summary."}},
  ...
]

Include ALL stories. No text outside the JSON array."""

    try:
        response = ai_client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )

        # Parse response
        response_text = response.content[0].text.strip()
        # Handle potential markdown code fences
        if response_text.startswith("```"):
            response_text = re.sub(r'^```(?:json)?\s*', '', response_text)
            response_text = re.sub(r'\s*```$', '', response_text)

        curated = json.loads(response_text)

        # Apply scores, rewritten titles, and AI summaries back to items
        curated_map = {c["id"]: c for c in curated}
        for i, item in enumerate(items):
            if i in curated_map:
                item["ai_score"] = curated_map[i].get("score", 5)
                # Rewritten title
                ai_title = curated_map[i].get("title", "")
                if ai_title:
                    item["title"] = ai_title
                # AI summary
                ai_summary = curated_map[i].get("summary", "")
                if ai_summary:
                    item["summary"] = f'<p style="margin: 0; line-height: 1.65;">{ai_summary}</p>'

        print(f"    AI curated {len(items)} stories in {category_name}")
        return items

    except Exception as e:
        print(f"    AI curation failed for {category_name}: {e}")
        # Return items unchanged on failure
        return items


def filter_and_enrich(sections_data):
    """Run AI curation across all categories, filter low-quality stories.
    Modifies sections_data in place. Returns stats."""
    if not ai_client:
        print("  No AI client available - skipping curation")
        return {"curated": False}

    total_before = sum(len(v) for v in sections_data.values())
    min_score = 3  # Include stories scoring 3+

    for category_key, items in sections_data.items():
        if not items:
            continue

        # Run AI curation
        curated_items = curate_stories(items, category_key)

        # Filter by score
        filtered = [item for item in curated_items if item.get("ai_score", 5) >= min_score]

        # Sort by score descending, then by date
        filtered.sort(
            key=lambda x: (
                x.get("ai_score", 5),
                x.get("published_parsed") or datetime.min.replace(tzinfo=timezone.utc)
            ),
            reverse=True
        )

        sections_data[category_key] = filtered

    total_after = sum(len(v) for v in sections_data.values())
    print(f"\n  AI Curation: {total_before} stories -> {total_after} (filtered {total_before - total_after} low-quality)")
    return {"curated": True, "before": total_before, "after": total_after}


# Newsletter type configurations
NEWSLETTER_TYPES = {
    "ai": {
        "categories": ["ai_tech", "dev_tools"],
        "subject_prefix": "AI News Digest",
        "intro": "The latest in AI, machine learning, and developer tools — only stories from the last 24 hours."
    },
    "personal": {
        "categories": ["tech_apple", "news", "podcasts", "food", "local_nc", "disney"],
        "subject_prefix": "The SigStack",
        "intro": "Here's what caught our attention today — the stories shaping tech, entertainment, and life."
    },
    "all": {
        "categories": None,  # All categories
        "subject_prefix": "The SigStack",
        "intro": "Here's what caught our attention today — the stories shaping tech, AI, and the tools we use to build."
    }
}

# Freshness threshold (hours)
FRESHNESS_HOURS = 24


def parse_date(date_str):
    """Parse various date formats from RSS feeds into datetime"""
    if not date_str:
        return None

    # Try RFC 2822 format (most common in RSS)
    try:
        return parsedate_to_datetime(date_str)
    except:
        pass

    # Try ISO 8601 formats
    iso_formats = [
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S.%f%z",
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    ]

    for fmt in iso_formats:
        try:
            dt = datetime.strptime(date_str.strip(), fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except:
            continue

    # Try feedparser's parsed time tuple if available
    return None


def is_fresh(date_str, hours=FRESHNESS_HOURS):
    """Check if a story is within the freshness window"""
    if not date_str:
        return False  # No date = not fresh (skip it)

    parsed = parse_date(date_str)
    if not parsed:
        return False

    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=hours)

    return parsed >= cutoff


def get_age_label(date_str):
    """Get a human-readable age label for a story"""
    if not date_str:
        return ""

    parsed = parse_date(date_str)
    if not parsed:
        return ""

    now = datetime.now(timezone.utc)
    delta = now - parsed

    hours = delta.total_seconds() / 3600

    if hours < 1:
        minutes = int(delta.total_seconds() / 60)
        return f"{minutes}m ago"
    elif hours < 24:
        return f"{int(hours)}h ago"
    else:
        days = int(hours / 24)
        return f"{days}d ago"


def load_feeds():
    """Load feeds from config file"""
    with open(FEEDS_PATH, 'r') as f:
        return json.load(f)


def extract_image_from_entry(entry):
    """Try to extract an image URL from an RSS entry"""
    # Check media:content
    if hasattr(entry, 'media_content') and entry.media_content:
        for media in entry.media_content:
            if media.get('medium') == 'image' or media.get('type', '').startswith('image'):
                return media.get('url', '')

    # Check media:thumbnail
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        return entry.media_thumbnail[0].get('url', '')

    # Check enclosures
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enc in entry.enclosures:
            if enc.get('type', '').startswith('image'):
                return enc.get('href', enc.get('url', ''))

    # Check for image in content
    if hasattr(entry, 'content') and entry.content:
        content = entry.content[0].get('value', '')
        img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', content)
        if img_match:
            return img_match.group(1)

    # Check summary for images
    if hasattr(entry, 'summary'):
        img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', entry.summary)
        if img_match:
            return img_match.group(1)

    return ""


def fetch_feed(feed_info):
    """Fetch and parse a single RSS feed, filtering for freshness"""
    try:
        response = requests.get(feed_info["url"], timeout=10, headers={
            "User-Agent": "SigStack News Aggregator/1.0"
        })
        parsed = feedparser.parse(response.content)

        items = []
        for entry in parsed.entries[:15]:  # Check more entries to find fresh ones
            # Get published date
            pub_date = entry.get("published", entry.get("updated", ""))

            # Skip stale content
            if not is_fresh(pub_date):
                continue

            # Rich summary - keep HTML formatting (bullets, bold, paragraphs)
            raw_summary = entry.get("summary", entry.get("description", ""))
            summary = clean_summary_html(raw_summary)

            # Get age label
            age = get_age_label(pub_date)

            items.append({
                "title": entry.get("title", "No title"),
                "link": entry.get("link", "#"),
                "summary": summary,
                "published": pub_date,
                "published_parsed": parse_date(pub_date),
                "age": age,
                "source": feed_info["title"],
                "image": extract_image_from_entry(entry)
            })

        return items
    except Exception as e:
        print(f"Error fetching {feed_info['title']}: {e}")
        return []


def fetch_category(category_name, feeds, bookmark_context=None):
    """Fetch all feeds in a category in parallel, with optional bookmark scoring"""
    all_items = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_feed, feed): feed for feed in feeds}
        for future in as_completed(futures):
            items = future.result()
            all_items.extend(items)

    # Dedupe by title
    seen_titles = set()
    unique_items = []
    for item in all_items:
        if item["title"] not in seen_titles:
            seen_titles.add(item["title"])
            unique_items.append(item)

    # Apply bookmark scoring if context available
    if bookmark_context:
        for item in unique_items:
            item["bookmark_boost"] = score_item_with_bookmarks(item, bookmark_context)
        # Sort by boost (desc), then by date (desc)
        unique_items.sort(
            key=lambda x: (
                x.get("bookmark_boost", 1.0),
                x.get("published_parsed") or datetime.min.replace(tzinfo=timezone.utc)
            ),
            reverse=True
        )
    else:
        # Sort by published date (newest first)
        unique_items.sort(
            key=lambda x: x.get("published_parsed") or datetime.min.replace(tzinfo=timezone.utc),
            reverse=True
        )

    return unique_items[:15]


def strip_links_from_html(html_text):
    """Remove all <a> tags from HTML, keeping their inner text. No URLs in output."""
    if not html_text:
        return ""
    # Replace <a href="...">text</a> with just text
    return re.sub(r'<a\s[^>]*>(.*?)</a>', r'\1', html_text, flags=re.DOTALL | re.IGNORECASE)


def build_story_html(item, accent_color, category_key="", compact=False):
    """Build HTML for a single story - big, bold, visual with fat summaries.
    compact=True returns a half-width card suitable for 2-column grid."""
    age_label = item.get("age", "")
    age_html = f'<span style="color: {accent_color}; font-weight: 800;">{age_label}</span>' if age_label else ""
    source_html = f'<span style="color: #a3a3a3;">{item.get("source", "")}</span>'
    meta_parts = [x for x in [source_html, age_html] if x]
    meta_html = ' &middot; '.join(meta_parts)

    # Strip any remaining links from summary text
    summary = strip_links_from_html(item.get("summary", ""))

    # Get image - use AI fallback if none from RSS
    image_url = item.get("image") or get_fallback_image(category_key, item.get("title", ""))

    if compact:
        # Compact card for 2-column grid - shorter image, smaller title, full summary
        plain_summary = re.sub(r'<[^>]+>', ' ', summary).strip()
        return f'''
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#161616" style="background-color: #161616; border-radius: 10px; overflow: hidden;">
              <tr>
                <td>
                  <a href="{item["link"]}" style="text-decoration: none;">
                    <img src="{image_url}" alt="" width="270" height="150" style="width: 100%; height: 150px; object-fit: cover; display: block; border-radius: 10px 10px 0 0;" />
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 14px 16px 16px 16px;">
                  <a href="{item["link"]}" style="text-decoration: none;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #ffffff; font-weight: 800; line-height: 1.3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">{item["title"]}</h3>
                  </a>
                  <p style="margin: 0 0 10px 0; font-size: 13px; color: #b0b0b0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">{plain_summary}</p>
                  <p style="margin: 0; font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">{meta_html}</p>
                </td>
              </tr>
            </table>
            '''

    # Full-width image card with big title and rich summary
    return f'''
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#161616" style="background-color: #161616; border-radius: 12px; margin-bottom: 18px; overflow: hidden;">
          <tr>
            <td>
              <a href="{item["link"]}" style="text-decoration: none;">
                <img src="{image_url}" alt="" width="100%" height="220" style="width: 100%; height: 220px; object-fit: cover; display: block; border-radius: 12px 12px 0 0;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 22px 24px 24px 24px;">
              <a href="{item["link"]}" style="text-decoration: none;">
                <h3 style="margin: 0 0 14px 0; font-size: 22px; color: #ffffff; font-weight: 800; line-height: 1.25; letter-spacing: -0.3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">{item["title"]}</h3>
              </a>
              <div style="margin: 0 0 16px 0; font-size: 15px; color: #d0d0d0; line-height: 1.65; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">{summary}</div>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">{meta_html}</p>
                  </td>
                  <td align="right">
                    <a href="{item["link"]}" style="display: inline-block; background-color: {accent_color}; color: #ffffff; padding: 7px 16px; border-radius: 6px; font-size: 12px; text-decoration: none; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Read more &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        '''


def build_two_col_grid(items, accent_color, category_key):
    """Build a 2-column grid of compact story cards using table layout for email."""
    if not items:
        return ""

    rows_html = ""
    for i in range(0, len(items), 2):
        left = build_story_html(items[i], accent_color, category_key, compact=True)
        right = build_story_html(items[i + 1], accent_color, category_key, compact=True) if i + 1 < len(items) else ""

        right_cell = f'<td width="48%" valign="top" style="padding-left: 8px;">{right}</td>' if right else '<td width="48%"></td>'

        rows_html += f'''
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 14px;">
          <tr>
            <td width="48%" valign="top" style="padding-right: 8px;">
              {left}
            </td>
            {right_cell}
          </tr>
        </table>
        '''

    return rows_html


def build_section_html(key, items):
    """Build HTML for a news section - bold visual headers with mixed layouts.
    1 story: full-width card
    2 stories: 2-column grid
    3+ stories: 1 full-width hero + 2-column grid for the rest
    """
    if not items:
        return ""

    config = SECTION_CONFIG.get(key, {"title": key, "emoji": "&#x1F4F0;", "color": "#737373"})

    # Mixed layout: first story full-width, rest in 2-col grid
    stories_html = ""
    display_items = items[:8]  # cap at 8 per section

    if len(display_items) == 1:
        # Single story: full-width
        stories_html = build_story_html(display_items[0], config["color"], key)
    elif len(display_items) == 2:
        # Two stories: 2-column grid
        stories_html = build_two_col_grid(display_items, config["color"], key)
    else:
        # 3+: hero card + 2-col grid
        stories_html = build_story_html(display_items[0], config["color"], key)
        stories_html += build_two_col_grid(display_items[1:], config["color"], key)

    # Section header with colored gradient backdrop
    return f'''
    <!-- Section: {config["title"]} -->
    <tr><td height="14" bgcolor="#050505"></td></tr>
    <tr>
      <td>
        <!-- Section Header - full-width colored banner -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="{config["color"]}" style="background: linear-gradient(135deg, {config["color"]}, #1a1a1a); border-radius: 14px 14px 0 0;">
          <tr>
            <td style="padding: 22px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <h2 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">
                      {config["emoji"]} {config["title"]}
                    </h2>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-size: 14px; color: rgba(255,255,255,0.7); font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">{len(items)} stories</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <!-- Stories -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#0d0d0d" style="background-color: #0d0d0d; border-radius: 0 0 14px 14px; border: 1px solid #1a1a1a; border-top: none;">
          <tr>
            <td style="padding: 20px 20px 8px 20px;">
              {stories_html}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    '''


def build_bookmarks_section_html(bookmarks):
    """Build HTML for the 'From Your Bookmarks' section"""
    if not bookmarks:
        return ""

    config = SECTION_CONFIG["bookmarks"]
    items_html = ""

    for bookmark in bookmarks[:3]:
        text = bookmark.get("text", "")
        author = bookmark.get("author", "")
        url = bookmark.get("url", "#")

        items_html += f'''
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#141414" style="background-color: #141414; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid {config["color"]};">
          <tr>
            <td style="padding: 14px 16px;">
              <a href="{url}" style="text-decoration: none;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #e5e5e5; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">{text}</p>
              </a>
              <p style="margin: 0; font-size: 11px; color: #525252; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                {author} &middot; <span style="color: {config["color"]}; font-weight: 700;">Bookmarked</span>
              </p>
            </td>
          </tr>
        </table>
        '''

    return f'''
    <tr><td height="6" bgcolor="#0a0a0a"></td></tr>
    <tr>
      <td bgcolor="#0c1929" style="background-color: #0c1929; border-radius: 12px; padding: 24px; border: 1px solid #1e3a5f;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
          <tr>
            <td bgcolor="{config["color"]}" style="padding: 5px 14px; border-radius: 6px;">
              <span style="color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">{config["emoji"]} {config["title"]}</span>
            </td>
          </tr>
        </table>
        {items_html}
      </td>
    </tr>
    '''


def build_newsletter_html(sections_data, bookmark_reminders=None):
    """Build the full newsletter HTML - The Verge-inspired bold visual design"""
    date_str = datetime.now().strftime("%A, %B %-d, %Y")
    bookmark_reminders = bookmark_reminders or []

    # Find top story (first item from priority feeds with image preferred)
    top_story = None
    for category in ["news", "ai_tech", "tech_apple"]:
        if category in sections_data and sections_data[category]:
            for item in sections_data[category]:
                if item.get("image"):
                    top_story = item
                    break
            if not top_story:
                top_story = sections_data[category][0]
            break

    if not top_story:
        top_story = {"title": "No top story", "summary": "", "link": "#", "image": "", "source": "", "age": ""}

    # Count total stories
    total_stories = sum(len(v) for v in sections_data.values())
    active_sections = sum(1 for v in sections_data.values() if v)

    # Hero image with text overlay (Verge-style)
    # Uses background-image on td for text-on-image effect
    if top_story.get("image"):
        hero_html = f'''
          <!-- HERO: Text overlaid on image -->
          <tr>
            <td background="{top_story["image"]}" bgcolor="#1a1a1a" width="100%" height="380" valign="bottom" style="background-image: url({top_story["image"]}); background-size: cover; background-position: center; background-color: #1a1a1a; border-radius: 14px; overflow: hidden;">
              <!--[if gte mso 9]>
              <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:100%;height:380px;">
              <v:fill type="frame" src="{top_story["image"]}" />
              <v:textbox inset="0,0,0,0">
              <![endif]-->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" height="380">
                <tr>
                  <td valign="bottom" style="padding: 0;">
                    <!-- Gradient overlay simulation -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#000000" style="background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%); border-radius: 0 0 14px 14px;">
                      <tr>
                        <td style="padding: 120px 28px 28px 28px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 14px;">
                            <tr>
                              <td bgcolor="#dc2626" style="padding: 4px 12px; border-radius: 4px;">
                                <span style="color: #ffffff; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">&#x26A1; Breaking</span>
                              </td>
                              <td style="padding-left: 10px;">
                                <span style="color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">{top_story.get("source", "")} &middot; {top_story.get("age", "")}</span>
                              </td>
                            </tr>
                          </table>
                          <a href="{top_story["link"]}" style="text-decoration: none;">
                            <h2 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.2; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">
                              {top_story["title"]}
                            </h2>
                          </a>
                          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: rgba(255,255,255,0.8); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                            {strip_links_from_html(top_story.get("summary", ""))}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!--[if gte mso 9]>
              </v:textbox>
              </v:rect>
              <![endif]-->
            </td>
          </tr>
        '''
    else:
        # No image fallback - bold text card
        hero_html = f'''
          <tr>
            <td bgcolor="#dc2626" style="background-color: #dc2626; border-radius: 14px; padding: 36px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 14px;">
                <tr>
                  <td bgcolor="#ffffff" style="padding: 4px 12px; border-radius: 4px;">
                    <span style="color: #dc2626; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">&#x26A1; Breaking</span>
                  </td>
                </tr>
              </table>
              <a href="{top_story["link"]}" style="text-decoration: none;">
                <h2 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.2; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                  {top_story["title"]}
                </h2>
              </a>
              <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.85); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.5;">
                {top_story.get("summary", "")}
              </p>
            </td>
          </tr>
        '''

    # Build bookmarks section
    bookmarks_section_html = build_bookmarks_section_html(bookmark_reminders)

    # Build all category sections
    sections_html = ""
    section_order = ["ai_tech", "tech_apple", "dev_tools", "news", "podcasts", "food", "local_nc", "disney"]
    for key in section_order:
        if key in sections_data and sections_data[key]:
            filtered_items = [i for i in sections_data[key] if i["title"] != top_story.get("title")]
            if filtered_items:
                sections_html += build_section_html(key, filtered_items)

    html = f'''<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>The SigStack</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {{font-family: Arial, sans-serif !important;}}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #f0f0f0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">

  <!-- Preheader -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    {top_story["title"][:100]} &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#050505" style="background-color: #050505;">
    <tr>
      <td align="center" style="padding: 0;">

        <!-- Top accent bar - bright gradient -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td height="4" style="font-size: 1px; line-height: 1px; background: linear-gradient(90deg, #ff6b35, #a78bfa, #4ade80, #60a5fa);">&nbsp;</td>
          </tr>
        </table>

        <!-- Main Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 900px; width: 100%;">

          <!-- Branded Header with image backdrop -->
          <tr>
            <td background="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=200&fit=crop&auto=format" bgcolor="#0a0a2e" style="background-image: url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=200&fit=crop&auto=format); background-size: cover; background-position: center; background-color: #0a0a2e;">
              <!--[if gte mso 9]>
              <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:100%;height:160px;">
              <v:fill type="frame" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=200&fit=crop&auto=format" />
              <v:textbox inset="0,0,0,0">
              <![endif]-->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" height="160" style="background: linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.85) 100%);">
                <tr>
                  <td valign="bottom" style="padding: 0 28px 24px 28px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td>
                          <h1 style="margin: 0; font-size: 38px; font-weight: 900; color: #ffffff; letter-spacing: -1px; line-height: 1; text-shadow: 0 2px 12px rgba(0,0,0,0.6);">
                            The SigStack<span style="color: #ff6b35;">.</span>
                          </h1>
                          <p style="margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 600; text-shadow: 0 1px 4px rgba(0,0,0,0.5);">
                            Your daily briefing &middot; {date_str}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!--[if gte mso 9]>
              </v:textbox>
              </v:rect>
              <![endif]-->
            </td>
          </tr>

          <!-- Stats bar - brighter -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" bgcolor="#111111" style="background-color: #111111; border-radius: 10px; border: 1px solid #222222;" width="100%">
                <tr>
                  <td style="padding: 12px 18px;">
                    <span style="font-size: 13px; color: #b0b0b0; font-weight: 600;">&#x1F4E1; {total_stories} stories across {active_sections} topics &middot; Fresh from the last 24h</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding: 0 28px 12px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                {hero_html}
              </table>
            </td>
          </tr>

          <!-- From Your Bookmarks -->
          <tr>
            <td style="padding: 0 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                {bookmarks_section_html}
              </table>
            </td>
          </tr>

          <!-- All Sections -->
          <tr>
            <td style="padding: 0 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                {sections_html}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 40px 28px; margin-top: 20px;" align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#0d0d0d" style="background-color: #0d0d0d; border-radius: 14px; border: 1px solid #1a1a1a;">
                <tr>
                  <td style="padding: 32px;" align="center">
                    <p style="margin: 0 0 6px 0; font-size: 24px; font-weight: 900; color: #ffffff;">
                      SigStack<span style="color: #ff6b35;">.</span>
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #525252;">
                      Curated by Will Sigmon
                    </p>
                    <p style="margin: 0 0 16px 0; font-size: 12px; color: #424242;">
                      Aggregated from your RSS feeds &middot; Delivered via Resend
                    </p>
                    <a href="https://sigstack.dev" style="display: inline-block; background: linear-gradient(135deg, #ff6b35, #ff8f5e); color: #ffffff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: 800; letter-spacing: 0.5px;">sigstack.dev</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>'''

    return html


def send_newsletter(to, html, subject):
    """Send newsletter via Resend"""
    payload = {
        "from": "SigStack News <news@sigstack.dev>",
        "to": to if isinstance(to, list) else [to],
        "subject": subject,
        "html": html
    }

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(RESEND_API_URL, json=payload, headers=headers)
    return response.json()


def run_aggregator(recipients=None, newsletter_type="all"):
    """Main aggregator function

    Args:
        recipients: List of email addresses
        newsletter_type: "ai", "personal", or "all"
    """
    if recipients is None:
        recipients = ["wjsigmon@gmail.com"]

    feeds = load_feeds()

    # Load bookmark context for personalization
    bookmark_context = load_bookmark_context()
    if bookmark_context:
        print(f"📚 Loaded bookmark context ({bookmark_context.get('bookmark_count', 0)} bookmarks)")
        if bookmark_context.get("category_boosts"):
            print(f"   Category boosts: {bookmark_context['category_boosts']}")
    else:
        print("📚 No bookmark context available (will use default sorting)")

    # Get newsletter config
    nl_config = NEWSLETTER_TYPES.get(newsletter_type, NEWSLETTER_TYPES["all"])
    categories = nl_config["categories"] or list(feeds.keys())

    print(f"Newsletter type: {newsletter_type}")
    print(f"Fetching {len(categories)} categories...")

    sections_data = {}
    total_fresh = 0
    for category in categories:
        if category in feeds:
            print(f"  Fetching {category}...")
            items = fetch_category(category, feeds[category], bookmark_context)
            sections_data[category] = items
            total_fresh += len(items)
            # Log boost info if available
            boosted = [i for i in items if i.get("bookmark_boost", 1.0) > 1.0]
            boost_note = f" ({len(boosted)} boosted)" if boosted else ""
            print(f"    Got {len(items)} fresh items (last {FRESHNESS_HOURS}h){boost_note}")

    if total_fresh == 0:
        print("\nNo fresh content found. Skipping send.")
        return {"skipped": True, "reason": "no_fresh_content"}

    # AI curation pass - score, filter, rewrite summaries
    print("\nRunning AI curation...")
    curation_stats = filter_and_enrich(sections_data)

    # Recount after filtering
    total_after = sum(len(v) for v in sections_data.values())
    if total_after == 0:
        print("\nNo stories passed AI curation. Skipping send.")
        return {"skipped": True, "reason": "no_worthy_stories"}

    # Get bookmark reminders for the newsletter
    bookmark_reminders = get_bookmark_reminders(bookmark_context, max_items=3)
    if bookmark_reminders:
        print(f"🔖 Including {len(bookmark_reminders)} bookmarks in newsletter")

    # Build and send newsletter
    html = build_newsletter_html(sections_data, bookmark_reminders)

    # Get top story title for subject
    top_title = "Daily Digest"
    for cat in ["ai_tech", "tech_apple", "news"]:
        if cat in sections_data and sections_data[cat]:
            top_title = sections_data[cat][0]["title"][:60]
            break

    subject = f"{nl_config['subject_prefix']}: {top_title}"

    print(f"\nSending to {recipients}...")
    result = send_newsletter(recipients, html, subject)
    print(f"Result: {result}")

    return result


if __name__ == "__main__":
    import sys

    # Parse arguments: python news_aggregator.py [type] [email]
    # type: ai, personal, all (default: all)
    # email: recipient email (default: wjsigmon@gmail.com)

    newsletter_type = "all"
    recipients = ["wjsigmon@gmail.com"]

    if len(sys.argv) > 1:
        if sys.argv[1] in ["ai", "personal", "all"]:
            newsletter_type = sys.argv[1]
            if len(sys.argv) > 2:
                recipients = [sys.argv[2]]
        else:
            # Assume it's an email
            recipients = [sys.argv[1]]

    run_aggregator(recipients, newsletter_type)
