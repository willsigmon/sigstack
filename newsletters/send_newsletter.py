#!/usr/bin/env python3
"""
SigStack Newsletter Sender
Sends tips@ and news@ newsletters via Resend API
Premium design with images and contextual insights
"""

import os
import json
import requests
from datetime import datetime
from pathlib import Path

# Resend API config
RESEND_API_KEY = "re_Czsz1gQW_Dz4H2a9dH8tTjgteeDCjVujF"
RESEND_API_URL = "https://api.resend.com/emails"

# Newsletter configs
NEWSLETTERS = {
    "tips": {
        "from": "SigStack Tips <tips@sigstack.dev>",
        "subject_prefix": "SigStack Tip",
        "template": "tips-template.html"
    },
    "news": {
        "from": "SigStack News <news@sigstack.dev>",
        "subject_prefix": "The SigStack",
        "template": "news-template.html"
    }
}

def load_template(template_name: str) -> str:
    """Load HTML template from file"""
    template_path = Path(__file__).parent / template_name
    with open(template_path, 'r') as f:
        return f.read()

def render_template(template: str, variables: dict) -> str:
    """Replace template variables with values"""
    html = template
    for key, value in variables.items():
        placeholder = "{{" + key + "}}"
        html = html.replace(placeholder, str(value))
    return html

def send_email(to: list, newsletter_type: str, subject: str, variables: dict) -> dict:
    """Send newsletter via Resend API"""
    config = NEWSLETTERS[newsletter_type]
    template = load_template(config["template"])
    html = render_template(template, variables)

    payload = {
        "from": config["from"],
        "to": to,
        "subject": f"{config['subject_prefix']}: {subject}",
        "html": html
    }

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(RESEND_API_URL, json=payload, headers=headers)
    return response.json()


def build_story_image_html(image_url: str, alt: str = "") -> str:
    """Build responsive image HTML for a story"""
    if not image_url:
        return ""
    return f'''
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td>
          <img src="{image_url}" alt="{alt}" width="556" style="width: 100%; max-width: 556px; height: auto; display: block; border-radius: 10px;" />
        </td>
      </tr>
    </table>
    '''


def build_story_item_html(item: dict, accent_color: str) -> str:
    """Build HTML for a single story item - Morning Brew card style"""
    if item.get("image"):
        return f'''
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f9fafb" style="background-color: #f9fafb; border-radius: 10px; margin-bottom: 14px; border: 1px solid #e5e7eb;">
          <tr>
            <td width="110" style="vertical-align: top;">
              <img src="{item["image"]}" alt="" width="110" height="80" style="width: 110px; height: 80px; object-fit: cover; border-radius: 10px 0 0 10px; display: block;" />
            </td>
            <td style="vertical-align: top; padding: 14px 16px;">
              <a href="{item["link"]}" style="text-decoration: none;">
                <p style="margin: 0 0 6px 0; font-size: 15px; color: #1a1a1a; font-weight: 700; line-height: 1.35;">{item["title"]}</p>
              </a>
              <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">{item["summary"]}</p>
            </td>
          </tr>
        </table>
        '''
    return f'''
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 14px; border-bottom: 1px solid #e5e7eb; padding-bottom: 14px;">
          <tr>
            <td>
              <a href="{item["link"]}" style="text-decoration: none;">
                <p style="margin: 0 0 6px 0; font-size: 16px; color: #1a1a1a; font-weight: 700; line-height: 1.35;">{item["title"]}</p>
              </a>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; line-height: 1.55;">{item["summary"]}</p>
              <a href="{item["link"]}" style="color: {accent_color}; font-size: 12px; text-decoration: none; font-weight: 700;">Read more &rarr;</a>
            </td>
          </tr>
        </table>
        '''


def send_tips_newsletter(to: list, tip_data: dict) -> dict:
    """Send a tips newsletter with premium design"""

    # Build quick tips HTML (table-based)
    quick_tips_html = ""
    for i, tip in enumerate(tip_data.get("quick_tips", [])):
        border_style = "border-bottom: 1px solid #1f1f1f;" if i < len(tip_data.get("quick_tips", [])) - 1 else ""
        quick_tips_html += f'''
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="{border_style} margin-bottom: 12px; padding-bottom: 12px;">
          <tr>
            <td width="24" style="vertical-align: top; padding-top: 2px;">
              <span style="color: #fbbf24; font-size: 14px;">&#x2022;</span>
            </td>
            <td style="vertical-align: top;">
              <p style="margin: 0; font-size: 15px; color: #d4d4d4; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">{tip}</p>
            </td>
          </tr>
        </table>
        '''

    # Generate preheader
    preheader = tip_data.get("preheader", f"{tip_data.get('emoji', '')} {tip_data.get('title', '')}")

    # Generate intro text
    intro_text = tip_data.get("intro_text", "One actionable technique to level up your workflow. No fluff, just signal.")

    variables = {
        "DATE": datetime.now().strftime("%B %-d, %Y"),
        "PREHEADER": preheader,
        "INTRO_TEXT": intro_text,
        "ISSUE_NUMBER": tip_data.get("issue_number", "001"),
        "TIP_EMOJI": tip_data.get("emoji", ""),
        "TIP_TITLE": tip_data.get("title", ""),
        "TIP_DESCRIPTION": tip_data.get("description", ""),
        "TIP_PAYOFF": tip_data.get("payoff", "You'll work faster with less cognitive overhead."),
        "CODE_EXAMPLE": tip_data.get("code", ""),
        "QUICK_TIPS": quick_tips_html,
        "TOOL_NAME": tip_data.get("tool_name", ""),
        "TOOL_DESCRIPTION": tip_data.get("tool_description", ""),
        "TOOL_LINK": tip_data.get("tool_link", "#"),
        "UNSUBSCRIBE_LINK": tip_data.get("unsubscribe_link", "#")
    }

    return send_email(to, "tips", tip_data.get("title", "Weekly Tip"), variables)


def send_news_newsletter(to: list, news_data: dict) -> dict:
    """Send a news newsletter with premium design"""

    # Build top story image
    top_story_image = build_story_image_html(
        news_data.get("top_story", {}).get("image", ""),
        news_data.get("top_story", {}).get("title", "")
    )

    # Build AI updates HTML
    ai_updates_html = ""
    for item in news_data.get("ai_updates", []):
        ai_updates_html += build_story_item_html(item, "#a78bfa")

    # Build dev tools HTML
    dev_tools_html = ""
    for item in news_data.get("dev_tools", []):
        dev_tools_html += build_story_item_html(item, "#4ade80")

    # Build quick links HTML - Morning Brew numbered list style
    quick_links_html = ""
    for i, item in enumerate(news_data.get("quick_links", [])):
        border_style = "border-bottom: 1px solid #e5e7eb;" if i < len(news_data.get("quick_links", [])) - 1 else ""
        num = i + 1
        quick_links_html += f'''
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="{border_style} margin-bottom: 12px; padding-bottom: 12px;">
          <tr>
            <td width="32" valign="top" style="padding-top: 2px;">
              <span style="display: inline-block; width: 24px; height: 24px; background-color: #f59e0b; color: #ffffff; font-size: 12px; font-weight: 800; text-align: center; line-height: 24px; border-radius: 50%;">{num}</span>
            </td>
            <td style="padding-left: 10px;">
              <a href="{item["link"]}" style="color: #1a1a1a; text-decoration: none; font-size: 15px; font-weight: 600; line-height: 1.4;">{item["title"]}</a>
              <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0 0; font-weight: 500;">{item["source"]}</p>
            </td>
          </tr>
        </table>
        '''

    # Generate intro text
    intro_text = news_data.get("intro_text", "Here's what caught our attention today — the stories shaping tech, AI, and the tools we use to build.")

    # Generate preheader (email preview text)
    preheader = news_data.get("preheader", news_data.get("top_story", {}).get("title", "Your daily digest"))

    variables = {
        "DATE": datetime.now().strftime("%A, %B %-d, %Y"),
        "PREHEADER": preheader,
        "INTRO_TEXT": intro_text,
        "TOP_STORY_IMAGE": top_story_image,
        "TOP_STORY_TITLE": news_data.get("top_story", {}).get("title", ""),
        "TOP_STORY_SUMMARY": news_data.get("top_story", {}).get("summary", ""),
        "TOP_STORY_LINK": news_data.get("top_story", {}).get("link", "#"),
        "TOP_STORY_INSIGHT": news_data.get("top_story", {}).get("insight", "This development could reshape how we interact with technology in the coming months."),
        "AI_UPDATES": ai_updates_html,
        "DEV_TOOLS": dev_tools_html,
        "QUICK_LINKS": quick_links_html,
        "UNSUBSCRIBE_LINK": news_data.get("unsubscribe_link", "#")
    }

    return send_email(to, "news", news_data.get("top_story", {}).get("title", "Weekly Digest"), variables)


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python send_newsletter.py [tips|news] [email]")
        sys.exit(1)

    newsletter_type = sys.argv[1]
    recipient = sys.argv[2] if len(sys.argv) > 2 else "wjsigmon@gmail.com"

    if newsletter_type == "tips":
        # Premium example tips content
        result = send_tips_newsletter(
            to=[recipient],
            tip_data={
                "issue_number": "001",
                "intro_text": "One pattern that changed how I build with AI. Copy it, adapt it, ship faster.",
                "emoji": "🚀",
                "title": "Parallel Agent Swarms in Claude Code",
                "description": "Most developers run AI tasks sequentially — ask one question, wait, ask another. But Claude Code can spawn 5-20 agents in parallel, each searching, analyzing, or transforming different parts of your codebase simultaneously.",
                "payoff": "A task that takes 10 sequential API calls completes in the time of one. Your feedback loop shrinks from minutes to seconds.",
                "code": """# Launch 3 agents in parallel with a single message
# Each explores a different subsystem

Task(subagent_type='Explore',
     prompt='Find all authentication handlers')

Task(subagent_type='Explore',
     prompt='Map the API route structure')

Task(subagent_type='Explore',
     prompt='Identify database models')""",
                "quick_tips": [
                    "Use Haiku ($0.25/M tokens) for quick searches, Sonnet for complex reasoning",
                    "PreToolUse hooks can block expensive operations before they run",
                    "The /skill command loads specialized behaviors without writing prompts"
                ],
                "tool_name": "Resend",
                "tool_description": "The email API that doesn't make you want to cry. Clean REST endpoints, React Email components for templates, and deliverability that actually works. Free tier is generous enough for side projects.",
                "tool_link": "https://resend.com"
            }
        )
        print(f"Tips newsletter sent: {result}")

    elif newsletter_type == "news":
        # Premium example news content with images
        result = send_news_newsletter(
            to=[recipient],
            news_data={
                "intro_text": "Good morning. Claude's most capable model yet just dropped, and the implications for developers are significant. Here's what you need to know.",
                "top_story": {
                    "title": "Claude Opus 4.5 Brings Extended Thinking to Agentic Workflows",
                    "summary": "Anthropic's latest release combines the reasoning power of extended thinking with autonomous agent capabilities. Early benchmarks show 40% improvement on complex coding tasks compared to previous models.",
                    "insight": "For developers building AI-powered tools, this shifts the calculus on what's possible to automate. Tasks that previously required human oversight may now be fully delegable.",
                    "link": "https://anthropic.com",
                    "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=580&h=320&fit=crop&auto=format"
                },
                "ai_updates": [
                    {
                        "title": "OpenAI Teases GPT-5 Architecture Changes",
                        "summary": "Internal documents suggest a shift toward mixture-of-experts models with specialized reasoning modules.",
                        "link": "#",
                        "image": ""
                    },
                    {
                        "title": "Google's Gemini 2.0 Enters Private Beta",
                        "summary": "New multimodal capabilities include real-time video understanding and improved long-context performance.",
                        "link": "#",
                        "image": ""
                    }
                ],
                "dev_tools": [
                    {
                        "title": "Cursor Ships Agent Mode for Autonomous Coding",
                        "summary": "The AI code editor now supports multi-file refactoring without manual intervention.",
                        "link": "#",
                        "image": ""
                    }
                ],
                "quick_links": [
                    {"title": "The State of AI Infrastructure in 2025", "source": "Pragmatic Engineer", "link": "#"},
                    {"title": "Why Every PM Should Learn to Prompt", "source": "Lenny's Newsletter", "link": "#"},
                    {"title": "Building Reliable AI Agents", "source": "Simon Willison", "link": "#"}
                ]
            }
        )
        print(f"News newsletter sent: {result}")

    else:
        print(f"Unknown newsletter type: {newsletter_type}")
