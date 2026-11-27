#!/usr/bin/env python3
"""Arma el sitio en un único HTML autocontenido.

index.html    -> documento completo para GitHub Pages
dist/artifact.html -> mismo contenido sin <html>/<head>/<body> (para publicarlo como artifact)
"""
import pathlib

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
ORDER = ["init.js", "engine.js", "data/u1.js", "data/u2.js", "data/u3.js", "data/u4.js",
         "data/labs.js", "data/lab2deck.js", "data/cards.js", "data/quizzes.js", "data/quizzes1.js", "data/parciales.js", "sims.js", "editor.js", "start.js"]

css = (SRC / "style.css").read_text(encoding="utf-8")
import base64, json
qimg = {}
for f in sorted((SRC / "qimg").glob("*")):
    mime = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}.get(f.suffix.lower())
    if mime:
        qimg[f.stem] = "data:" + mime + ";base64," + base64.b64encode(f.read_bytes()).decode()
parts = [(SRC / f).read_text(encoding="utf-8") for f in ORDER]
parts.insert(ORDER.index("data/quizzes.js"), "window.SSL.qimg = " + json.dumps(qimg) + ";")
js = "\n;\n".join(parts)
js = js.replace("</script", "<\\/script")
shell = (SRC / "shell.html").read_text(encoding="utf-8")
body = shell.replace("{{CSS}}", css).replace("{{JS}}", js)

(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "artifact.html").write_text(body, encoding="utf-8")
full = ("<!doctype html>\n<html lang=\"es\">\n<head>\n<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n"
        "</head>\n<body>\n" + body + "\n</body>\n</html>\n")
(ROOT / "index.html").write_text(full, encoding="utf-8")
print("index.html", len(full) // 1024, "KB")
