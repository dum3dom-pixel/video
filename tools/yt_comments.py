"""Выгрузка комментариев YouTube в JSON + Markdown.

Два источника:
  1. YouTube Data API v3 — если задан ключ в переменной окружения YOUTUBE_API_KEY (самый надёжный);
  2. yt-dlp — без ключа; при бот-проверке добавь --cookies-from-browser chrome|edge|firefox.

Примеры:
  python tools/yt_comments.py K1Mr5_7Gm3g
  python tools/yt_comments.py https://youtu.be/K1Mr5_7Gm3g L4MM8BQ9dTM --max 500
  python tools/yt_comments.py K1Mr5_7Gm3g --source ytdlp --cookies-from-browser edge
"""
import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

API = "https://www.googleapis.com/youtube/v3/"


def video_id(s):
    m = re.search(r"(?:v=|youtu\.be/|shorts/|live/|embed/)([\w-]{11})", s)
    if m:
        return m.group(1)
    if re.fullmatch(r"[\w-]{11}", s):
        return s
    sys.exit(f"Не понял, что за ролик: {s}")


# ---------- YouTube Data API ----------

def api_get(endpoint, key, **params):
    url = API + endpoint + "?" + urllib.parse.urlencode({**params, "key": key})
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.load(r)


def api_comment(c, parent="root"):
    s = c["snippet"]
    return {
        "id": c["id"],
        "parent": parent,
        "author": s.get("authorDisplayName", ""),
        "text": s.get("textOriginal", ""),
        "likes": s.get("likeCount", 0),
        "date": s.get("publishedAt", "")[:10],
    }


def fetch_api(vid, key, limit, order):
    v = api_get("videos", key, part="snippet,statistics", id=vid)["items"]
    meta = {}
    if v:
        meta = {"title": v[0]["snippet"]["title"], "channel": v[0]["snippet"]["channelTitle"],
                "views": int(v[0]["statistics"].get("viewCount", 0)),
                "comment_count": int(v[0]["statistics"].get("commentCount", 0))}
    out, token = [], None
    while True:
        page = api_get("commentThreads", key, part="snippet,replies", videoId=vid,
                       maxResults=100, order=order, textFormat="plainText",
                       **({"pageToken": token} if token else {}))
        for t in page["items"]:
            top = t["snippet"]["topLevelComment"]
            row = api_comment(top)
            row["replies"] = t["snippet"].get("totalReplyCount", 0)
            out.append(row)
            # API отдаёт до 5 ответов в треде — для разбора хватает
            for r in t.get("replies", {}).get("comments", []):
                out.append(api_comment(r, parent=top["id"]))
        token = page.get("nextPageToken")
        tops = sum(1 for c in out if c["parent"] == "root")
        print(f"  {tops} комментариев...", file=sys.stderr)
        if not token or (limit and tops >= limit):
            return meta, out


# ---------- yt-dlp ----------

def fetch_ytdlp(vid, limit, order, browser):
    import yt_dlp
    n = str(limit) if limit else "all"
    opts = {
        "skip_download": True,
        "getcomments": True,
        "quiet": True,
        "extractor_args": {"youtube": {
            # всего, верхних, ответов всего, ответов на тред
            "max_comments": ["all", n, "all", "20"],
            "comment_sort": ["top" if order == "relevance" else "new"],
        }},
    }
    if browser:
        opts["cookiesfrombrowser"] = (browser,)
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={vid}", download=False)
    meta = {"title": info.get("title"), "channel": info.get("channel"),
            "views": info.get("view_count"), "comment_count": info.get("comment_count")}
    reply_count = {}
    for c in info.get("comments") or []:
        if c.get("parent", "root") != "root":
            reply_count[c["parent"]] = reply_count.get(c["parent"], 0) + 1
    out = []
    for c in info.get("comments") or []:
        ts = c.get("timestamp")
        row = {
            "id": c.get("id"),
            "parent": c.get("parent", "root"),
            "author": c.get("author", ""),
            "text": c.get("text", ""),
            "likes": c.get("like_count") or 0,
            "date": datetime.fromtimestamp(ts, timezone.utc).strftime("%Y-%m-%d") if ts else "",
        }
        if row["parent"] == "root":
            row["replies"] = reply_count.get(row["id"], 0)
            row["pinned"] = bool(c.get("is_pinned"))
            row["by_author"] = bool(c.get("author_is_uploader"))
        out.append(row)
    return meta, out


# ---------- вывод ----------

def write_md(path, vid, meta, comments):
    tops = sorted((c for c in comments if c["parent"] == "root"), key=lambda c: -c["likes"])
    replies = {}
    for c in comments:
        if c["parent"] != "root":
            replies.setdefault(c["parent"], []).append(c)
    lines = [f"# {meta.get('title') or vid}", "",
             f"https://www.youtube.com/watch?v={vid} · {meta.get('channel') or ''} · "
             f"просмотров {meta.get('views') or '?'} · комментариев на YouTube {meta.get('comment_count') or '?'} · "
             f"выгружено {len(tops)} (+{len(comments) - len(tops)} ответов)", ""]
    for c in tops:
        tag = " 📌" if c.get("pinned") else ""
        tag += " (автор)" if c.get("by_author") else ""
        lines.append(f"**👍 {c['likes']} · 💬 {c.get('replies', 0)} · {c['author']}{tag} · {c['date']}**  ")
        lines.append(c["text"].replace("\n", "  \n"))
        for r in sorted(replies.get(c["id"], []), key=lambda r: -r["likes"])[:3]:
            lines.append(f"> ↳ 👍 {r['likes']} · {r['author']}: {r['text'].replace(chr(10), ' ')}")
        lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def main():
    p = argparse.ArgumentParser(description="Выгрузка комментариев YouTube")
    p.add_argument("videos", nargs="+", help="ссылки или ID роликов")
    p.add_argument("--max", type=int, default=0, help="сколько верхних комментариев (0 = все)")
    p.add_argument("--order", choices=["relevance", "time"], default="relevance",
                   help="relevance = популярные, time = новые")
    p.add_argument("--source", choices=["auto", "api", "ytdlp"], default="auto")
    p.add_argument("--cookies-from-browser", metavar="BROWSER",
                   help="для yt-dlp: chrome / edge / firefox (если YouTube просит подтвердить, что не бот)")
    p.add_argument("--out", default="comments", help="папка для результатов")
    a = p.parse_args()

    key = os.environ.get("YOUTUBE_API_KEY")
    source = a.source if a.source != "auto" else ("api" if key else "ytdlp")
    if source == "api" and not key:
        sys.exit("Нет YOUTUBE_API_KEY в окружении")
    out_dir = Path(a.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    for v in a.videos:
        vid = video_id(v)
        print(f"{vid}: качаю через {source}...", file=sys.stderr)
        if source == "api":
            meta, comments = fetch_api(vid, key, a.max, a.order)
        else:
            meta, comments = fetch_ytdlp(vid, a.max, a.order, a.cookies_from_browser)
        data = {"video_id": vid, **meta, "source": source, "comments": comments}
        (out_dir / f"{vid}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        write_md(out_dir / f"{vid}.md", vid, meta, comments)
        tops = sum(1 for c in comments if c["parent"] == "root")
        print(f"{vid}: {tops} комментариев + {len(comments) - tops} ответов -> {out_dir / vid}.md / .json",
              file=sys.stderr)


if __name__ == "__main__":
    main()
