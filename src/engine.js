/* Sintaxiando Ando — motor de la guía: navegación, figuras, cuestionarios, cartas y simuladores. */
(function () {
  "use strict";
  var SSL = window.SSL;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a, n) { return shuffle(a).slice(0, n); }
  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[“”"'`´]/g, "").replace(/\s+/g, " ").replace(/\s*([(){}\[\],.;:|*+=<>-])\s*/g, "$1").trim();
  }

  /* ---------- almacenamiento por visitante ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("ssl:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("ssl:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  var prog = store.get("prog", { read: {}, ctrl: {} });
  function saveProg() { store.set("prog", prog); updatePill(); }
  function totals() {
    var t = 0, d = 0;
    SSL.units.forEach(function (u) {
      u.sections.forEach(function (s) { t++; if (prog.read[u.id + "-" + s.id]) d++; });
      t++; if (prog.ctrl[u.id] && prog.ctrl[u.id] >= 60) d++;
    });
    return { t: t, d: d };
  }
  function updatePill() { var p = $("#pill"); if (!p) return; var x = totals(); p.textContent = x.d + " de " + x.t; p.title = "Secciones leídas y controles aprobados"; }

  /* ---------- figuras: autómatas ---------- */
  function edgesFrom(spec) {
    if (spec.edges) return spec.edges;
    var map = {}, order = [];
    function add(f, t, l) { var k = f + ">" + t; if (!map[k]) { map[k] = { f: f, t: t, l: [] }; order.push(k); } map[k].l.push(l); }
    var d = spec.delta || {};
    if (spec.type === "ap") { (spec.trans || []).forEach(function (r) { add(r[0], r[3], "(" + r[1] + "," + r[2] + "," + r[4] + ")"); }); }
    else if (spec.type === "mt") { Object.keys(d).forEach(function (q) { Object.keys(d[q]).forEach(function (s) { var r = d[q][s]; add(q, r[0], "(" + s + "," + r[1] + "," + r[2] + ")"); }); }); }
    else {
      Object.keys(d).forEach(function (q) {
        Object.keys(d[q]).forEach(function (s) {
          var v = d[q][s]; var lbl = s;
          if (spec.type === "mealy") { lbl = s + "/" + spec.out[q][s]; }
          (Array.isArray(v) ? v : [v]).forEach(function (t) { add(q, t, lbl); });
        });
      });
    }
    return order.map(function (k) { var e = map[k]; var sep = (spec.type === "ap" || spec.type === "mt") ? "\n" : ","; return { f: e.f, t: e.t, l: e.l.join(sep) }; });
  }
  function drawFA(spec, hl) {
    hl = hl || {};
    var R = spec.r || 20, st = {}, W = spec.w || 520, H = spec.h || 220;
    spec.states.forEach(function (s) { st[s.id] = s; });
    var edges = edgesFrom(spec), has = {};
    edges.forEach(function (e) { has[e.f + ">" + e.t] = 1; });
    var out = ['<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" role="img" aria-label="' + esc(spec.title || "Grafo de transición") + '">'];
    function lblText(x, y, txt, on) {
      var lines = String(txt).split("\n"), h = 13;
      var y0 = y - (lines.length - 1) * h / 2;
      return '<text class="fa-elbl' + (on ? " on" : "") + '" x="' + x.toFixed(1) + '" y="' + y0.toFixed(1) + '">' +
        lines.map(function (ln, i) { return '<tspan x="' + x.toFixed(1) + '" dy="' + (i ? h : 0) + '">' + esc(ln) + "</tspan>"; }).join("") + "</text>";
    }
    function arrowHead(x, y, dx, dy, on) {
      var L = Math.sqrt(dx * dx + dy * dy) || 1; dx /= L; dy /= L;
      var s = on ? 9 : 8, w = on ? 5 : 4.2;
      var p1 = [x - dx * s - dy * w, y - dy * s + dx * w], p2 = [x - dx * s + dy * w, y - dy * s - dx * w];
      return '<polygon class="fa-head" points="' + x.toFixed(1) + "," + y.toFixed(1) + " " + p1[0].toFixed(1) + "," + p1[1].toFixed(1) + " " + p2[0].toFixed(1) + "," + p2[1].toFixed(1) + '"' + (on ? ' style="fill:var(--accent)"' : "") + "/>";
    }
    edges.forEach(function (e) {
      var a = st[e.f], b = st[e.t]; if (!a || !b) return;
      var key = e.f + ">" + e.t, on = hl.edge === key;
      if (e.f === e.t) {
        var dir = (spec.loops && spec.loops[e.f]) || "up";
        var ang = { up: -Math.PI / 2, down: Math.PI / 2, left: Math.PI, right: 0 }[dir];
        var c1 = ang - 0.55, c2 = ang + 0.55;
        var sx = a.x + R * Math.cos(c1), sy = a.y + R * Math.sin(c1), ex = a.x + R * Math.cos(c2), ey = a.y + R * Math.sin(c2);
        var k = 2.5 * R;
        var q1x = a.x + k * Math.cos(c1), q1y = a.y + k * Math.sin(c1), q2x = a.x + k * Math.cos(c2), q2y = a.y + k * Math.sin(c2);
        out.push('<path class="fa-edge' + (on ? " on" : "") + '" d="M' + sx.toFixed(1) + "," + sy.toFixed(1) + " C" + q1x.toFixed(1) + "," + q1y.toFixed(1) + " " + q2x.toFixed(1) + "," + q2y.toFixed(1) + " " + ex.toFixed(1) + "," + ey.toFixed(1) + '"/>');
        out.push(arrowHead(ex, ey, ex - q2x, ey - q2y, on));
        var lines = String(e.l).split("\n").length;
        var lx = a.x + (R * 2.25) * Math.cos(ang), ly = a.y + (R * 2.25) * Math.sin(ang);
        if (dir === "up") ly -= 8 + (lines - 1) * 6.5; if (dir === "down") ly += 8 + (lines - 1) * 6.5;
        if (dir === "left") lx -= 10 + String(e.l).split("\n")[0].length * 3; if (dir === "right") lx += 10 + String(e.l).split("\n")[0].length * 3;
        out.push(lblText(lx, ly, e.l, on));
        return;
      }
      var dx = b.x - a.x, dy = b.y - a.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
      var bend = (spec.bends && spec.bends[key] != null) ? spec.bends[key] : (has[e.t + ">" + e.f] ? 22 : 0);
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, nx = -dy / L, ny = dx / L;
      var cx = mx + nx * bend * 2, cy = my + ny * bend * 2;
      var ux = cx - a.x, uy = cy - a.y, ul = Math.sqrt(ux * ux + uy * uy) || 1;
      var vx = cx - b.x, vy = cy - b.y, vl = Math.sqrt(vx * vx + vy * vy) || 1;
      var sx2 = a.x + ux / ul * R, sy2 = a.y + uy / ul * R, ex2 = b.x + vx / vl * (R + 1), ey2 = b.y + vy / vl * (R + 1);
      out.push('<path class="fa-edge' + (on ? " on" : "") + '" d="M' + sx2.toFixed(1) + "," + sy2.toFixed(1) + " Q" + cx.toFixed(1) + "," + cy.toFixed(1) + " " + ex2.toFixed(1) + "," + ey2.toFixed(1) + '"/>');
      out.push(arrowHead(ex2, ey2, ex2 - cx, ey2 - cy, on));
      var tx = 0.25 * sx2 + 0.5 * cx + 0.25 * ex2, ty = 0.25 * sy2 + 0.5 * cy + 0.25 * ey2;
      var off = (spec.loff && spec.loff[key] != null) ? spec.loff[key] : 11;
      var lines2 = String(e.l).split("\n").length;
      var sgn = bend >= 0 ? 1 : -1;
      out.push(lblText(tx + nx * (off + (lines2 - 1) * 6) * sgn, ty + ny * (off + (lines2 - 1) * 6) * sgn, e.l, on));
    });
    spec.states.forEach(function (s) {
      var cur = hl.cur && hl.cur.indexOf(s.id) >= 0;
      if (spec.q0 === s.id || (spec.q0s && spec.q0s.indexOf(s.id) >= 0)) {
        var d = spec.q0dir || "left";
        var ix = s.x - R - 26, iy = s.y, jx = s.x - R - 1, jy = s.y;
        if (d === "up") { ix = s.x; iy = s.y - R - 26; jx = s.x; jy = s.y - R - 1; }
        if (d === "down") { ix = s.x; iy = s.y + R + 26; jx = s.x; jy = s.y + R + 1; }
        out.push('<path class="fa-edge" d="M' + ix + "," + iy + " L" + jx + "," + jy + '"/>' + arrowHead(jx, jy, jx - ix, jy - iy));
      }
      out.push('<circle class="fa-state' + (cur ? " cur" : "") + '" cx="' + s.x + '" cy="' + s.y + '" r="' + R + '"/>');
      if ((spec.F || []).indexOf(s.id) >= 0) out.push('<circle class="fa-fin" cx="' + s.x + '" cy="' + s.y + '" r="' + (R - 4) + '"/>');
      var lab = s.label != null ? s.label : s.id;
      out.push('<text class="fa-lbl" x="' + s.x + '" y="' + (spec.type === "moore" ? s.y - 5 : s.y) + '">' + esc(lab) + "</text>");
      if (spec.type === "moore") out.push('<text class="fa-sub" x="' + s.x + '" y="' + (s.y + 8) + '">/' + esc(spec.out[s.id]) + "</text>");
    });
    out.push("</svg>");
    return out.join("");
  }

  /* ---------- figuras: árboles de derivación ---------- */
  function drawTree(root, opt) {
    opt = opt || {};
    var gx = opt.gx || 40, gy = opt.gy || 50, leaves = 0, nodes = [], maxd = 0;
    function lay(n, d) {
      n._d = d; maxd = Math.max(maxd, d);
      if (!n.c || !n.c.length) { n._x = leaves++ * gx; }
      else { n.c.forEach(function (c) { lay(c, d + 1); }); n._x = (n.c[0]._x + n.c[n.c.length - 1]._x) / 2; }
      nodes.push(n);
    }
    lay(root, 0);
    var W = Math.max(leaves * gx + 30, 120), H = (maxd + 1) * gy + 10, P = 22;
    var s = ['<svg viewBox="0 0 ' + (W) + " " + H + '" width="' + W + '" role="img" aria-label="' + esc(opt.title || "Árbol de derivación") + '">'];
    nodes.forEach(function (n) { if (n.c) n.c.forEach(function (c) { s.push('<line class="tr-line" x1="' + (n._x + P) + '" y1="' + (n._d * gy + 22) + '" x2="' + (c._x + P) + '" y2="' + (c._d * gy + 22) + '"/>'); }); });
    nodes.forEach(function (n) {
      var x = n._x + P, y = n._d * gy + 22, w = Math.max(22, String(n.l).length * 8 + 12);
      var nt = n.c && n.c.length;
      s.push('<rect class="' + (nt ? "tr-nt" : "tr-t") + '" x="' + (x - w / 2) + '" y="' + (y - 12) + '" width="' + w + '" height="24" rx="' + (nt ? 4 : 12) + '"/>');
      s.push('<text class="fa-lbl" x="' + x + '" y="' + y + '">' + esc(n.l) + "</text>");
    });
    s.push("</svg>");
    return s.join("");
  }
  // árbol desde texto: "S(a S(a b) b)" ; los símbolos se separan por espacios
  function parseTree(str) {
    var i = 0; str = str.trim();
    function tok() { var m = /^\s*([^\s()]+)/.exec(str.slice(i)); if (!m) return null; i += m[0].length; return m[1]; }
    function node() {
      var l = tok(); var n = { l: l };
      var m = /^\s*\(/.exec(str.slice(i));
      if (m) { i += m[0].length; n.c = []; while (!/^\s*\)/.test(str.slice(i))) n.c.push(node()); i += /^\s*\)/.exec(str.slice(i))[0].length; }
      return n;
    }
    return node();
  }

  /* ---------- figuras: diagramas de sintaxis ---------- */
  function rr(spec) {
    function tw(s) { return Math.max(28, String(s).length * 8.2 + 22); }
    function L(x) {
      if (typeof x === "string") x = { t: x };
      if (x.t != null || x.n != null) {
        var label = x.t != null ? x.t : x.n, w = tw(label);
        return { w: w, up: 15, dn: 15, d: function (X, Y) { return '<rect class="' + (x.t != null ? "rr-t" : "rr-nt") + '" x="' + X + '" y="' + (Y - 13) + '" width="' + w + '" height="26" rx="' + (x.t != null ? 13 : 3) + '"/><text class="rr-txt" x="' + (X + w / 2) + '" y="' + Y + '">' + esc(label) + "</text>"; } };
      }
      if (x.e) return { w: 0, up: 0, dn: 0, d: function () { return ""; } };
      if (x.seq) {
        var parts = x.seq.map(L), g = 14, w2 = 0, up = 0, dn = 0;
        parts.forEach(function (p, i) { w2 += p.w + (i ? g : 0); up = Math.max(up, p.up); dn = Math.max(dn, p.dn); });
        return { w: w2, up: up, dn: dn, d: function (X, Y) { var s = "", cx = X; parts.forEach(function (p, i) { if (i) { s += '<path class="rr-path" d="M' + cx + "," + Y + " h" + g + '"/>'; cx += g; } s += p.d(cx, Y); cx += p.w; }); return s; } };
      }
      if (x.alt) {
        var ps = x.alt.map(L), mw = 0, r = 10, gap = 10;
        ps.forEach(function (p) { mw = Math.max(mw, p.w); });
        var W = mw + 4 * r, offs = [0], acc = ps[0].dn;
        for (var i = 1; i < ps.length; i++) { acc += gap + ps[i].up; offs.push(acc); acc += ps[i].dn; }
        return { w: W, up: ps[0].up, dn: acc, d: function (X, Y) {
          var s = "";
          ps.forEach(function (p, i) {
            var y = Y + offs[i], px = X + 2 * r + (mw - p.w) / 2;
            if (i === 0) s += '<path class="rr-path" d="M' + X + "," + Y + " H" + px + " M" + (px + p.w) + "," + Y + " H" + (X + W) + '"/>';
            else s += '<path class="rr-path" d="M' + X + "," + Y + " Q" + (X + r) + "," + Y + " " + (X + r) + "," + (Y + r) + " V" + (y - r) + " Q" + (X + r) + "," + y + " " + (X + 2 * r) + "," + y + " H" + px + " M" + (px + p.w) + "," + y + " H" + (X + W - 2 * r) + " Q" + (X + W - r) + "," + y + " " + (X + W - r) + "," + (y - r) + " V" + (Y + r) + " Q" + (X + W - r) + "," + Y + " " + (X + W) + "," + Y + '"/>';
            s += p.d(px, y);
          });
          return s;
        } };
      }
      if (x.opt) return L({ alt: [{ e: 1 }, x.opt] });
      if (x.loop || x.star) {
        var inner = L(x.loop || x.star), r2 = 10, W2 = inner.w + 4 * r2, back = inner.dn + 12;
        var loopL = { w: W2, up: inner.up, dn: back + 2, d: function (X, Y) {
          var px = X + 2 * r2;
          var s = '<path class="rr-path" d="M' + X + "," + Y + " H" + px + " M" + (px + inner.w) + "," + Y + " H" + (X + W2) + '"/>';
          s += '<path class="rr-path" d="M' + (X + W2 - 2 * r2) + "," + Y + " Q" + (X + W2 - r2) + "," + Y + " " + (X + W2 - r2) + "," + (Y + r2) + " V" + (Y + back - r2) + " Q" + (X + W2 - r2) + "," + (Y + back) + " " + (X + W2 - 2 * r2) + "," + (Y + back) + " H" + (X + 2 * r2) + " Q" + (X + r2) + "," + (Y + back) + " " + (X + r2) + "," + (Y + back - r2) + " V" + (Y + r2) + " Q" + (X + r2) + "," + Y + " " + (X + 2 * r2) + "," + Y + '"/>';
          return s + inner.d(px, Y);
        } };
        return x.star ? L({ alt: [{ e: 1 }, { _l: loopL }] }) : loopL;
      }
      if (x._l) return x._l;
      return L({ e: 1 });
    }
    var root = L(spec.d), pad = 22, W = root.w + pad * 2 + 10, H = root.up + root.dn + 34;
    var Y = root.up + 18;
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" role="img" aria-label="Diagrama de sintaxis ' + esc(spec.name || "") + '">';
    if (spec.name) s += '<text class="rr-txt" x="4" y="9" style="text-anchor:start;font-weight:700">' + esc(spec.name) + "</text>";
    s += '<path class="rr-path" d="M6,' + (Y - 7) + " V" + (Y + 7) + " M6," + Y + " H" + pad + '"/>';
    s += root.d(pad, Y);
    s += '<path class="rr-path" d="M' + (pad + root.w) + "," + Y + " H" + (W - 6) + " M" + (W - 6) + "," + (Y - 7) + " V" + (Y + 7) + '"/>';
    return s + "</svg>";
  }

  /* ---------- cinta ---------- */
  function tapeHTML(cells, head, q, opt) {
    opt = opt || {};
    return '<div class="tapebox">' + (opt.label ? '<div class="lab">' + esc(opt.label) + "</div>" : "") + '<div class="cells">' +
      cells.map(function (c, i) { var cls = "cell" + (i === head ? " head" : "") + (opt.read && i < head ? " read" : "") + (c === "∆" ? " dim" : ""); return '<div class="' + cls + '"' + (i === head && q != null ? ' data-q="' + esc(q) + '"' : "") + ">" + esc(c === "" ? "λ" : c) + "</div>"; }).join("") + "</div></div>";
  }
  function stackHTML(arr) { // arr: tope primero
    var a = arr.slice().reverse();
    return '<div class="tapebox"><div class="lab">Pila</div><div class="stack">' + a.map(function (c, i) { return '<div class="cell' + (i === a.length - 1 ? " top" : "") + '">' + esc(c) + "</div>"; }).join("") + "</div></div>";
  }

  /* ---------- bloques de contenido ---------- */
  function blocks(list) {
    return (list || []).map(function (b) {
      if (typeof b === "string") return '<div class="prose"><p>' + b + "</p></div>";
      if (b.p) return '<div class="prose"><p>' + b.p + "</p></div>";
      if (b.ps) return '<div class="prose">' + b.ps.map(function (x) { return "<p>" + x + "</p>"; }).join("") + "</div>";
      if (b.ul) return '<div class="prose"><ul>' + b.ul.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>";
      if (b.ol) return '<div class="prose"><ol>' + b.ol.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol></div>";
      if (b.def) return '<div class="def">' + '<div class="tag">' + esc(b.tag || "Definición de la cátedra") + '</div><div class="term">' + b.def + "</div><p>" + b.txt + "</p></div>";
      if (b.f != null) return '<div class="formula">' + esc(b.f) + "</div>";
      if (b.fh != null) return '<div class="formula">' + b.fh + "</div>";
      if (b.note) return '<div class="note">' + b.note + "</div>";
      if (b.ex) return '<div class="ex"><div class="t">' + esc(b.ex) + "</div>" + blocks(b.b) + "</div>";
      if (b.table) return table(b.table);
      if (b.fa) return '<figure class="fig"><div class="canvas">' + drawFA(b.fa) + "</div>" + (b.cap ? "<figcaption>" + b.cap + "</figcaption>" : "") + "</figure>";
      if (b.tree) return '<figure class="fig"><div class="canvas">' + drawTree(typeof b.tree === "string" ? parseTree(b.tree) : b.tree, b) + "</div>" + (b.cap ? "<figcaption>" + b.cap + "</figcaption>" : "") + "</figure>";
      if (b.trees) return '<figure class="fig"><div class="canvas" style="display:flex;gap:24px;flex-wrap:wrap;justify-content:center">' + b.trees.map(function (t) { return drawTree(parseTree(t)); }).join("") + "</div>" + (b.cap ? "<figcaption>" + b.cap + "</figcaption>" : "") + "</figure>";
      if (b.rail) return '<figure class="fig"><div class="canvas">' + (Array.isArray(b.rail) ? b.rail : [b.rail]).map(rr).join("") + "</div>" + (b.cap ? "<figcaption>" + b.cap + "</figcaption>" : "") + "</figure>";
      if (b.tape) return '<figure class="fig"><div class="canvas">' + tapeHTML(b.tape.cells, b.tape.head, b.tape.q, b.tape) + (b.tape.stack ? stackHTML(b.tape.stack) : "") + "</div>" + (b.cap ? "<figcaption>" + b.cap + "</figcaption>" : "") + "</figure>";
      if (b.sim) return '<div data-sim="' + esc(b.sim) + '"></div>';
      if (b.html) return b.html;
      return "";
    }).join("");
  }
  function table(t) {
    return '<div class="tbl-wrap"><table class="t' + (t.mono ? " mono" : "") + '">' + (t.h ? "<thead><tr>" + t.h.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead>" : "") +
      "<tbody>" + t.r.map(function (r) { return "<tr>" + r.map(function (c, i) { return (t.th1 && i === 0 ? "<th>" : "<td>") + c + (t.th1 && i === 0 ? "</th>" : "</td>"); }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
  }

  /* ---------- cuestionarios ---------- */
  var qid = 0;
  function renderQ(q, i, opts) {
    var id = "q" + (++qid), h = "";
    var type = { vf: "Verdadero o falso", mc: "Opción única", x: "Marcar con X", match: "Emparejar / completar", fill: "Completar", open: "Desarrollo" }[q.t];
    h += '<div class="qcard" data-i="' + i + '" id="' + id + '"><div class="qh"><span class="qt">' + (opts.num ? (i + 1) + ") " : "") + type + (q.kind ? " · " + q.kind : "") + "</span>" + (q.pts ? '<span class="pts">' + q.pts + " pts</span>" : "") + "</div>";
    h += '<div class="q">' + q.q + "</div>";
    if (q.fig) h += blocks([q.fig]);
    if (q.t === "vf") h += '<div class="vf"><button type="button" class="btn" data-v="1">V</button><button type="button" class="btn" data-v="0">F</button></div>';
    if (q.t === "mc" || q.t === "x") {
      var order = q._ord || (q._ord = q.noShuffle ? q.o.map(function (_, k) { return k; }) : shuffle(q.o.map(function (_, k) { return k; })));
      h += '<div class="opts">' + order.map(function (k) { return '<label class="opt"><input type="' + (q.t === "mc" ? "radio" : "checkbox") + '" name="' + id + '" value="' + k + '"><span>' + q.o[k] + "</span></label>"; }).join("") + "</div>";
    }
    if (q.t === "match") {
      var choices = q.opts;
      var items = q._items || (q._items = q.keep ? q.items : shuffle(q.items));
      h += '<div class="match">' + items.map(function (it, k) { return '<div class="l">' + it[0] + '</div><select class="sel" data-k="' + k + '"><option value="">—</option>' + choices.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + "</option>"; }).join("") + "</select>"; }).join("") + "</div>";
    }
    if (q.t === "fill") h += '<div class="fill">' + q.blanks.map(function (b, k) { return '<div class="row"><span class="k">' + b.k + '</span><input class="txt mono" data-k="' + k + '" type="text" autocomplete="off" spellcheck="false" style="flex:1;min-width:160px"></div>'; }).join("") + "</div>";
    if (q.t === "open") h += '<textarea class="txt mono" placeholder="Escribí tu resolución o un esquema (opcional)"></textarea>';
    h += '<div class="why hide"></div></div>';
    return h;
  }
  function gradeQ(card, q) {
    var why = $(".why", card), ok = 0, tot = 1, msg = "";
    if (q.t === "vf") {
      var sel = $(".vf .sel", card); var v = sel ? sel.dataset.v === "1" : null;
      $$(".vf .btn", card).forEach(function (b) { b.disabled = true; var bv = b.dataset.v === "1"; if (bv === q.a) b.classList.add("is-right"); else if (b === sel) b.classList.add("is-wrong"); });
      ok = v === q.a ? 1 : 0;
      msg = "<b>" + (q.a ? "Verdadero." : "Falso.") + "</b> " + (q.why || "");
    } else if (q.t === "mc") {
      var c = $("input:checked", card); var val = c ? +c.value : -1; ok = val === q.a ? 1 : 0;
      $$(".opt", card).forEach(function (o) { var inp = $("input", o); inp.disabled = true; if (+inp.value === q.a) o.classList.add("is-right"); else if (inp.checked) o.classList.add("is-wrong"); });
      msg = (q.why || "");
    } else if (q.t === "x") {
      tot = q.o.length; ok = 0;
      $$(".opt", card).forEach(function (o) { var inp = $("input", o); inp.disabled = true; var should = q.a.indexOf(+inp.value) >= 0; if (inp.checked === should) ok++; if (should) o.classList.add("is-right"); else if (inp.checked) o.classList.add("is-wrong"); });
      msg = q.why || "";
    } else if (q.t === "match") {
      tot = q._items.length; ok = 0;
      $$("select", card).forEach(function (s) { var it = q._items[+s.dataset.k]; var good = (Array.isArray(it[1]) ? it[1] : [it[1]]).indexOf(s.value) >= 0; s.disabled = true; s.classList.add(good ? "is-right" : "is-wrong"); if (good) ok++; else { var hint = document.createElement("div"); hint.style.cssText = "grid-column:1/-1;font-size:.82rem;color:var(--bad);margin-top:-4px"; hint.textContent = "Correcta: " + (Array.isArray(it[1]) ? it[1].join(" o ") : it[1]); s.after(hint); } });
      msg = q.why || "";
    } else if (q.t === "fill") {
      tot = q.blanks.length; ok = 0;
      $$("input", card).forEach(function (inp) { var b = q.blanks[+inp.dataset.k]; var v = norm(inp.value); var good = b.a.some(function (a) { return norm(a) === v; }); inp.disabled = true; inp.classList.add(good ? "is-right" : "is-wrong"); if (good) ok++; });
      msg = "<b>Respuesta esperada:</b><br>" + q.blanks.map(function (b) { return b.k + " → <code>" + esc(b.a[0]) + "</code>"; }).join("<br>") + (q.why ? "<br>" + q.why : "");
    } else if (q.t === "open") {
      $("textarea", card).disabled = true;
      msg = "<b>Resolución:</b>" + blocks(Array.isArray(q.sol) ? q.sol : [q.sol]);
      why.innerHTML = msg; why.classList.remove("hide");
      var se = document.createElement("div"); se.className = "selfeval";
      se.innerHTML = "Autoevaluá tu resolución: <button type=button class='btn ok' data-s='1'>Bien</button><button type=button class='btn' data-s='0.5'>A medias</button><button type=button class='btn bad' data-s='0'>Mal</button>";
      why.appendChild(se);
      return { ok: null, tot: 1 };
    }
    why.innerHTML = msg; if (msg) why.classList.remove("hide");
    card.classList.add(ok === tot ? "right" : "wrong");
    return { ok: ok, tot: tot };
  }
  function mountQuiz(el, qs, opts) {
    opts = opts || {};
    qid = 0;
    el.innerHTML = '<div class="quiz">' + qs.map(function (q, i) { return renderQ(q, i, opts); }).join("") + '</div><div class="btns" style="margin-top:14px"><button type="button" class="btn pri" data-act="check">Corregir</button><button type="button" class="btn ghost" data-act="again">Nuevo intento</button></div><div class="res"></div>';
    $$(".vf .btn", el).forEach(function (b) { b.addEventListener("click", function () { $$(".btn", b.parentNode).forEach(function (x) { x.classList.remove("sel"); }); b.classList.add("sel"); }); });
    var self = {};
    $('[data-act="check"]', el).addEventListener("click", function () {
      var done = 0, max = 0, pend = 0;
      var cards = $$(".qcard", el);
      cards.forEach(function (card, i) {
        var q = qs[i], w = q.pts || 1, r = gradeQ(card, q);
        max += w;
        if (r.ok === null) {
          pend++;
          $$(".selfeval .btn", card).forEach(function (b) { b.addEventListener("click", function () { $$(".selfeval .btn", card).forEach(function (x) { x.classList.remove("pri"); }); b.classList.add("pri"); self[i] = +b.dataset.s * w; card.classList.remove("right", "wrong"); card.classList.add(+b.dataset.s >= 0.5 ? "right" : "wrong"); show(); }); });
        } else done += w * r.ok / r.tot;
      });
      this.disabled = true;
      function show() {
        var s = done; Object.keys(self).forEach(function (k) { s += self[k]; });
        var pct = Math.round(100 * s / max);
        var falt = pend - Object.keys(self).length;
        var nota = opts.scale ? (Math.round(s / max * opts.scale * 100) / 100).toString().replace(".", ",") + " / " + opts.scale : pct + "%";
        $(".res", el).innerHTML = '<div class="score" style="margin-top:14px"><span class="big">' + nota + "</span><span>" + (falt > 0 ? "Faltan autoevaluar " + falt + " ejercicio" + (falt > 1 ? "s" : "") + " de desarrollo." : (pct >= 60 ? "Aprobado. Repasá las que marcaste mal." : "Todavía no. Volvé a la teoría de las preguntas en rojo.")) + "</span></div>";
        if (opts.onDone && falt <= 0) opts.onDone(pct);
        else if (opts.onDone && !pend) opts.onDone(pct);
      }
      show();
      var first = $(".qcard.wrong", el); if (first && opts.scrollToWrong) first.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    $('[data-act="again"]', el).addEventListener("click", function () { qs.forEach(function (q) { delete q._ord; delete q._items; }); mountQuiz(el, opts.regen ? opts.regen() : qs, opts); });
  }

  /* ---------- simuladores ---------- */
  var SIM = {};
  SSL.registerSim = function (k, f) { SIM[k] = f; };
  function mountSims(root) {
    $$("[data-sim]", root).forEach(function (el) { var f = SIM[el.dataset.sim]; if (f) f(el); else el.innerHTML = '<p class="empty">Simulador no disponible.</p>'; });
  }

  // Simulador genérico de autómatas: afd, afnd (con λ), moore, mealy, ap (determinista), mt
  function closure(spec, set) {
    var st = set.slice(), out = set.slice();
    while (st.length) { var q = st.pop(); var nx = (spec.delta[q] && spec.delta[q]["λ"]) || []; nx.forEach(function (p) { if (out.indexOf(p) < 0) { out.push(p); st.push(p); } }); }
    return out.sort();
  }
  function machineSim(el, cfg) {
    var spec = cfg.spec, words = cfg.words || [""];
    el.innerHTML = '<div class="sim"><div><div class="kicker">' + esc(cfg.kicker || "Simulador") + '</div><h3 style="margin-top:4px">' + esc(cfg.title) + '</h3>' + (cfg.desc ? '<p style="color:var(--muted);font-size:.95rem;margin-top:4px">' + cfg.desc + "</p>" : "") + '</div>' +
      '<div class="ctrl"><label class="inline">Entrada <input class="txt mono" type="text" value="' + esc(words[0]) + '" style="width:160px" aria-label="Palabra de entrada"></label>' +
      '<button type="button" class="btn pri" data-a="step">Paso</button><button type="button" class="btn" data-a="run">Ejecutar todo</button><button type="button" class="btn ghost" data-a="reset">Reiniciar</button></div>' +
      (words.length > 1 ? '<div class="chips">' + words.map(function (w) { return '<button type="button" class="chip" data-w="' + esc(w) + '" style="cursor:pointer;background:none">' + esc(w === "" ? "λ" : w) + "</button>"; }).join("") + "</div>" : "") +
      '<div class="canvas fig" style="overflow-x:auto;background:var(--paper);border:1px solid var(--line);border-radius:6px;padding:8px"></div><div class="simrow"></div><div class="status"></div><div class="trace"></div></div>';
    var inp = $("input", el), cv = $(".canvas", el), row = $(".simrow", el), status = $(".status", el), trace = $(".trace", el);
    var S;
    function reset() {
      var w = inp.value.trim();
      S = { w: w.split(""), i: 0, halted: false, edge: null, log: [], steps: 0 };
      if (spec.type === "afd" || spec.type === "moore" || spec.type === "mealy") { S.q = spec.q0; S.out = []; }
      if (spec.type === "afnd") { S.set = closure(spec, spec.q0s || [spec.q0]); }
      if (spec.type === "ap") { S.q = spec.q0; S.stack = [spec.z0]; S.w = S.w.concat(["∆"]); }
      if (spec.type === "mt") { S.q = spec.q0; S.tape = ["∆"].concat(S.w.length ? S.w : []).concat(["∆", "∆"]); S.h = 1; }
      S.log.push(config()); draw();
    }
    function config() {
      var rest = S.w.slice(S.i).join("");
      if (spec.type === "afd") return S.q + rest;
      if (spec.type === "moore" || spec.type === "mealy") return S.out.join("") + S.q + rest;
      if (spec.type === "afnd") return "{" + S.set.join(",") + "}" + rest;
      if (spec.type === "ap") return rest + S.q + S.stack.join("");
      if (spec.type === "mt") { var t = S.tape.slice(); return t.slice(0, S.h).join("") + S.q + t.slice(S.h).join("").replace(/∆+$/, "∆"); }
    }
    function step() {
      if (S.halted) return;
      S.steps++; if (S.steps > 400) { S.halted = true; S.msg = ["rej", "Se cortó la simulación (demasiados pasos)."]; return; }
      if (spec.type === "afd" || spec.type === "moore" || spec.type === "mealy") {
        if (S.i >= S.w.length) { finish(); return; }
        var a = S.w[S.i], nx = spec.delta[S.q] && spec.delta[S.q][a];
        if (nx == null) { S.halted = true; S.msg = ["rej", "Bloqueo: no hay transición desde " + S.q + " con " + a + ". Rechaza."]; return; }
        if (spec.type === "mealy") S.out.push(spec.out[S.q][a]);
        S.edge = S.q + ">" + nx; S.q = nx; S.i++;
        if (spec.type === "moore") S.out.push(spec.out[S.q]);
      } else if (spec.type === "afnd") {
        if (S.i >= S.w.length) { finish(); return; }
        var b = S.w[S.i], dest = [];
        S.set.forEach(function (q) { ((spec.delta[q] && spec.delta[q][b]) || []).forEach(function (p) { if (dest.indexOf(p) < 0) dest.push(p); }); });
        S.set = closure(spec, dest); S.i++; S.edge = null;
        if (!S.set.length) { S.halted = true; S.msg = ["rej", "El conjunto de estados quedó vacío. Rechaza."]; }
      } else if (spec.type === "ap") {
        var sym = S.w[S.i], top = S.stack[0], tr = null;
        (spec.trans || []).some(function (r) { if (r[0] === S.q && r[1] === sym && (r[2] === top || r[2] === "λ")) { tr = r; return true; } });
        if (!tr) (spec.trans || []).some(function (r) { if (r[0] === S.q && r[1] === "λ" && (r[2] === top || r[2] === "λ")) { tr = r; return true; } });
        if (!tr) { S.halted = true; S.msg = ["rej", "Bloqueo: no hay transición para (" + S.q + ", " + (sym || "fin") + ", " + (top || "vacía") + "). Rechaza."]; return; }
        if (tr[1] !== "λ") S.i++;
        if (tr[2] !== "λ") S.stack.shift();
        if (tr[4] !== "λ") S.stack = tr[4].split("").concat(S.stack);
        S.edge = S.q + ">" + tr[3]; S.q = tr[3];
        if ((spec.F || []).indexOf(S.q) >= 0) { S.halted = true; S.msg = ["acc", "Llegó a un estado final. Acepta."]; }
      } else if (spec.type === "mt") {
        var c = S.tape[S.h], r2 = spec.delta[S.q] && spec.delta[S.q][c];
        if (!r2) { S.halted = true; S.msg = ["rej", "Bloqueo: no hay transición para (" + S.q + ", " + c + "). Rechaza."]; return; }
        S.tape[S.h] = r2[1]; S.edge = S.q + ">" + r2[0]; S.q = r2[0];
        if (r2[2] === "D") S.h++; if (r2[2] === "I") S.h--;
        if (S.h < 0) { S.tape.unshift("∆"); S.h = 0; } if (S.h >= S.tape.length - 1) S.tape.push("∆");
        if ((spec.F || []).indexOf(S.q) >= 0) { S.halted = true; S.msg = ["acc", "Llegó a un estado final. Acepta."]; }
      }
      S.log.push(config());
      if (!S.halted && spec.type !== "ap" && spec.type !== "mt" && S.i >= S.w.length) finish();
    }
    function finish() {
      S.halted = true;
      if (spec.type === "afd") S.msg = (spec.F.indexOf(S.q) >= 0) ? ["acc", "Leyó toda la palabra y terminó en " + S.q + ", que es final. Acepta."] : ["rej", "Leyó toda la palabra y terminó en " + S.q + ", que no es final. Rechaza."];
      if (spec.type === "afnd") { var fin = S.set.filter(function (q) { return spec.F.indexOf(q) >= 0; }); S.msg = fin.length ? ["acc", "El conjunto final contiene " + fin.join(",") + ". Acepta."] : ["rej", "Ningún estado del conjunto es final. Rechaza."]; }
      if (spec.type === "moore" || spec.type === "mealy") S.msg = ["", "Salida: " + (S.out.join("") || "λ") + (cfg.interpret ? " → " + cfg.interpret(S.out, S.q) : "")];
    }
    function draw() {
      var cur = spec.type === "afnd" ? S.set : [S.q];
      cv.innerHTML = drawFA(spec, { cur: cur, edge: S.edge });
      var h = "";
      if (spec.type === "mt") h += tapeHTML(S.tape, S.h, S.q, { label: "Cinta" });
      else { var cells = S.w.length ? S.w : ["λ"]; h += tapeHTML(cells, Math.min(S.i, cells.length), (spec.type === "afnd" ? "{" + S.set.join(",") + "}" : S.q), { label: "Cinta de entrada", read: true }); }
      if (S.i >= S.w.length && spec.type !== "mt") h = h.replace('<div class="cells">', '<div class="cells">').replace(/<\/div><\/div>$/, '<div class="cell head dim" data-q="' + esc(spec.type === "afnd" ? "{" + S.set.join(",") + "}" : S.q) + '">·</div></div></div>');
      if (spec.type === "ap") h += stackHTML(S.stack.length ? S.stack : ["—"]);
      if (spec.type === "moore" || spec.type === "mealy") h += tapeHTML(S.out.length ? S.out : ["—"], -1, null, { label: "Cinta de salida" });
      row.innerHTML = h;
      status.className = "status" + (S.msg ? " " + S.msg[0] : "");
      status.textContent = S.msg ? S.msg[1] : (S.halted ? "Terminó." : "Estado actual: " + (spec.type === "afnd" ? "{" + S.set.join(",") + "}" : S.q) + (spec.type === "mt" ? " · leyendo " + S.tape[S.h] : ""));
      trace.textContent = S.log.join(" ├─ ");
    }
    el.addEventListener("click", function (e) {
      var a = e.target.closest("[data-a]"), w = e.target.closest("[data-w]");
      if (w) { inp.value = w.dataset.w; reset(); return; }
      if (!a) return;
      if (a.dataset.a === "reset") reset();
      if (a.dataset.a === "step") { step(); draw(); }
      if (a.dataset.a === "run") { while (!S.halted) step(); draw(); }
    });
    inp.addEventListener("change", reset);
    reset();
  }
  SSL.machineSim = machineSim;

  /* ---------- páginas ---------- */
  var app;
  function setNav(r) { $$(".tape a").forEach(function (a) { var t = a.getAttribute("href").slice(1); if (t === r || (r.indexOf(t + "-") === 0)) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); }); }

  function pageHome() {
    var u = SSL.units;
    function unitIdx(un) {
      return '<div class="block strong"><h3><span class="n">Unidad ' + un.n + "</span>" + esc(un.title) + '</h3><p style="color:var(--muted);font-size:.95rem">' + un.summary + '</p><ul class="idx">' +
        un.sections.map(function (s) { return '<li><a href="#' + un.id + "-" + s.id + '"><span>' + esc(s.title) + '</span><span class="meta">' + (prog.read[un.id + "-" + s.id] ? "leído" : "") + "</span></a></li>"; }).join("") +
        '<li><a href="#' + un.id + '-tp"><span>Trabajo práctico ' + un.tp.n + ' · defensa</span><span class="meta">' + un.tp.alumnos.length + ' ej.</span></a></li>' +
        '<li><a href="#' + un.id + '-control"><span>Control de lectura</span><span class="meta">' + (prog.ctrl[un.id] != null ? prog.ctrl[un.id] + "%" : un.control.length + " preg.") + "</span></a></li></ul></div>";
    }
    var h = '<div class="page solo"><div class="main">';
    h += '<div class="hero"><div class="head"><div class="kicker">Sintaxis y Semántica de los Lenguajes · UTN FRT · 2026</div><h1>Sintaxiando <em>Ando</em></h1><p class="lede">Teoría con las definiciones tal cual las toma la cátedra, gráficos de autómatas y cintas que se mueven, defensas de TP, cartas de laboratorio con tiempo y simulacros con el formato del parcial de este año.</p>' +
      '<div class="btns"><a class="btn pri" href="#cartas">Rendir cartas de laboratorio</a><a class="btn" href="#simulacro">Simulacro de parcial</a><a class="btn ghost" href="#modelo">Parcial 2026 resuelto</a></div></div>' +
      '<div class="demo"><div data-sim="hero-afd"></div></div></div>';
    h += '<section class="sec"><h2>Primer parcial</h2><p class="lede" style="font-size:1rem">Unidades 1 y 2, teoría y práctica. Laboratorio 1: MEF del ascensor con Arduino.</p><div class="grid2">' + unitIdx(u[0]) + unitIdx(u[1]) + "</div></section>";
    h += '<section class="sec"><h2>Segundo parcial</h2><p class="lede" style="font-size:1rem">Unidades 3 y 4, teoría y práctica. Laboratorio 2: parser de SQL con JLex y Cup.</p><div class="grid2">' + unitIdx(u[2]) + unitIdx(u[3]) + "</div></section>";
    h += '<section class="sec"><h2>Cómo se evalúa este año</h2><div class="grid3">' +
      '<div class="block"><h3>Defensas de TP</h3><p>Mini parcial con un enunciado de la parte <b>"Problemas a resolver por los alumnos"</b> elegido por la cátedra.</p><a class="btn" href="#defensas">Practicar defensas</a></div>' +
      '<div class="block"><h3>Laboratorios</h3><p>Cartas con preguntas teóricas sobre el enunciado del laboratorio y temas relacionados. Un minuto por carta.</p><a class="btn" href="#labs">Ver laboratorios</a></div>' +
      '<div class="block"><h3>Parciales</h3><p>Teoría estilo Tema C: V/F con definiciones alteradas, emparejar, completar, marcar con X. Más ejercicios prácticos.</p><a class="btn" href="#simulacro">Hacer un simulacro</a></div>' +
      "</div></section>";
    h += foot() + "</div></div>";
    app.innerHTML = h;
    mountSims(app);
  }
  function foot() { return '<div class="foot"><span>Material basado en las clases y TP de la cátedra (Ing. Jorge Buabud). Las resoluciones propias están marcadas como sugeridas.</span><span>Tu progreso se guarda en este navegador.</span></div>'; }

  function pageUnit(u, anchor) {
    var h = '<div class="page"><nav class="toc" aria-label="Índice de la unidad"><h4>Unidad ' + u.n + "</h4>" +
      u.sections.map(function (s, i) { return '<a href="#' + u.id + "-" + s.id + '" class="' + (prog.read[u.id + "-" + s.id] ? "done" : "") + '">' + (i + 1) + ". " + esc(s.title) + "</a>"; }).join("") +
      '<a href="#' + u.id + '-tp">TP ' + u.tp.n + ' · defensa</a><a href="#' + u.id + '-control" class="' + (prog.ctrl[u.id] >= 60 ? "done" : "") + '">Control de lectura</a></nav><div class="main">';
    h += '<div class="head"><div class="kicker">Unidad ' + u.n + " · " + (u.parcial === 1 ? "Primer" : "Segundo") + " parcial</div><h1>" + esc(u.title) + '</h1><p class="lede">' + u.summary + "</p></div>";
    u.sections.forEach(function (s, i) {
      var key = u.id + "-" + s.id;
      h += '<section class="sec" id="' + key + '"><h2><span class="n">' + u.n + "." + (i + 1) + "</span>" + esc(s.title) + "</h2>" + blocks(s.blocks) +
        '<div class="read-mark"><label class="inline"><input type="checkbox" data-read="' + key + '"' + (prog.read[key] ? " checked" : "") + "> Marcar como leído</label></div></section>";
    });
    // TP
    h += '<section class="sec" id="' + u.id + '-tp"><h2><span class="n">TP ' + u.tp.n + "</span>" + esc(u.tp.title) + '</h2><div class="prose"><p>La defensa toma <b>un enunciado de "Problemas a resolver por los alumnos"</b>. Abajo están todos, con la guía de resolución. Para practicar con tiempo usá el simulador de defensas.</p></div><div class="btns"><a class="btn pri" href="#defensas">Simular defensa del TP ' + u.tp.n + '</a></div>';
    if (u.tp.clase && u.tp.clase.length) h += '<details class="ex"><summary style="cursor:pointer;font-weight:600">Problemas resueltos en clase (' + u.tp.clase.length + ")</summary>" + u.tp.clase.map(exHTML).join("") + "</details>";
    h += '<div class="kicker" style="margin-top:6px">Problemas a resolver por los alumnos · entran en la defensa</div>' + u.tp.alumnos.map(exHTML).join("") + "</section>";
    // control
    h += '<section class="sec" id="' + u.id + '-control"><h2><span class="n">' + u.n + ".✓</span>Control de lectura</h2><div class=\"prose\"><p>" + u.control.length + " preguntas de teoría y práctica. Se aprueba con 60%.</p></div><div id=\"ctrl\"></div></section>";
    h += foot() + "</div></div>";
    app.innerHTML = h;
    mountSims(app);
    mountQuiz($("#ctrl"), u.control.slice(), { num: true, scrollToWrong: true, onDone: function (pct) { prog.ctrl[u.id] = Math.max(prog.ctrl[u.id] || 0, pct); saveProg(); } });
    $$("[data-read]", app).forEach(function (c) { c.addEventListener("change", function () { if (c.checked) prog.read[c.dataset.read] = 1; else delete prog.read[c.dataset.read]; saveProg(); var a = $('.toc a[href="#' + c.dataset.read + '"]'); if (a) a.classList.toggle("done", c.checked); }); });
    $$("details.sol", app).forEach(function (d) { d.addEventListener("toggle", function () { if (d.open) mountSims(d); }); });
    if (anchor) { var t = document.getElementById(anchor); if (t) setTimeout(function () { t.scrollIntoView(); }, 30); } else window.scrollTo(0, 0);
  }
  function exHTML(e) {
    return '<div class="ex" id="ex-' + esc(e.id) + '"><div class="t">Ejercicio ' + esc(e.id) + (e.tag ? " · " + esc(e.tag) : "") + '</div><div class="prose">' + e.txt + "</div>" +
      (e.sol ? '<details class="sol"><summary style="cursor:pointer;color:var(--accent);font-weight:600">' + (e.sug ? "Resolución sugerida" : "Resolución") + "</summary><div style=\"display:flex;flex-direction:column;gap:10px;margin-top:10px\">" + blocks(Array.isArray(e.sol) ? e.sol : [e.sol]) + "</div></details>" : "") + "</div>";
  }

  function pageList(title, kicker, lede, inner) {
    app.innerHTML = '<div class="page solo"><div class="main"><div class="head"><div class="kicker">' + kicker + "</div><h1>" + title + '</h1><p class="lede">' + lede + "</p></div>" + inner + foot() + "</div></div>";
    mountSims(app); window.scrollTo(0, 0);
  }

  function pageGraficas() {
    var g = SSL.graficas;
    pageList("Gráficas", "Simuladores paso a paso", "Escribí una palabra y mirá cómo se mueve el cabezal, cómo cambian los estados y cómo se llena la pila. Cada simulador muestra la secuencia de configuración con la notación de la cátedra.",
      g.map(function (s) { return '<section class="sec" id="g-' + s.id + '"><h2>' + esc(s.title) + "</h2>" + (s.p ? '<div class="prose"><p>' + s.p + "</p></div>" : "") + '<div data-sim="' + s.sim + '"></div></section>'; }).join(""));
  }

  function pageLabs() {
    var L = SSL.labs;
    pageList("Laboratorios", "Evaluación por cartas", "Cada laboratorio se defiende en dos partes: la maqueta o el programa funcionando, y una ronda de cartas con preguntas teóricas sobre el enunciado y los temas relacionados. Acá está la teoría que necesitás para las cartas.",
      L.map(function (l) { return '<section class="sec" id="' + l.id + '"><h2><span class="n">' + esc(l.code) + "</span>" + esc(l.title) + "</h2>" + blocks(l.blocks) + '<div class="btns"><a class="btn pri" href="#cartas" data-deck="' + l.id + '">Rendir cartas de ' + esc(l.code) + "</a><span class=\"chip\">" + l.cards.length + " cartas en el mazo</span></div></section>"; }).join(""));
    $$("[data-deck]", app).forEach(function (a) { a.addEventListener("click", function () { store.set("deck", a.dataset.deck); }); });
  }

  /* ---------- cartas con tiempo ---------- */
  function pageCartas() {
    var L = SSL.labs, last = store.get("deck", L[0].id), best = store.get("best", {});
    var h = '<section class="sec"><h2>Elegí el mazo</h2><div class="deckpick">' + L.map(function (l) {
      return '<label class="block' + (l.id === last ? " strong" : "") + '" style="cursor:pointer"><span class="kicker">' + esc(l.code) + '</span><h3>' + esc(l.title) + '</h3><span class="chips"><span class="chip">' + l.cards.length + " cartas</span>" + (best[l.id] != null ? '<span class="chip ok">mejor: ' + best[l.id] + "%</span>" : "") + '</span><input type="radio" name="deck" value="' + l.id + '"' + (l.id === last ? " checked" : "") + ' style="position:absolute;opacity:0"></label>';
    }).join("") + "</div>" +
      '<div class="btns"><label class="inline">Cartas por ronda <select class="sel" id="nc"><option>5</option><option selected>8</option><option>12</option><option value="99">Todas</option></select></label><label class="inline">Tiempo por carta <select class="sel" id="tc"><option value="45">45 s</option><option value="60" selected>1 min</option><option value="90">1 min 30 s</option></select></label><button type="button" class="btn pri" id="go">Empezar ronda</button></div></section><div id="arena"></div>';
    pageList("Cartas de laboratorio", "Simulador de evaluación", "Sale una carta y corre el reloj. Respondé en voz alta o anotá un esquema, como si estuvieras frente a la cátedra. Cuando termina el tiempo se muestra la respuesta esperada y te calificás.", h);
    $$('input[name="deck"]', app).forEach(function (r) { r.closest("label").addEventListener("click", function () { $$(".deckpick .block", app).forEach(function (b) { b.classList.remove("strong"); }); r.closest("label").classList.add("strong"); r.checked = true; store.set("deck", r.value); }); });
    $("#go").addEventListener("click", function () {
      var id = $('input[name="deck"]:checked', app).value, lab = L.filter(function (l) { return l.id === id; })[0];
      runDeck(lab, +$("#nc").value, +$("#tc").value);
    });
  }
  var tick = null;
  function runDeck(lab, n, secs) {
    var deck = pick(lab.cards, Math.min(n, lab.cards.length)), i = 0, res = [];
    var ar = $("#arena");
    ar.scrollIntoView({ behavior: "smooth", block: "start" });
    function show() {
      clearInterval(tick);
      if (i >= deck.length) return end();
      var c = deck[i], left = secs, revealed = false;
      ar.innerHTML = '<div class="arena"><div class="timer" id="tm"><div class="lbl"><span>Carta ' + (i + 1) + " de " + deck.length + '</span><span id="tl">' + fmt(left) + '</span></div><div class="bar"><div class="fill" id="tf"></div></div></div>' +
        '<div class="card"><div class="ctop"><span>' + esc(lab.code) + "</span><span>" + esc(c.tag || "") + '</span></div><div class="cq">' + c.q + '</div><div class="ca hide" id="ans"><div><b>Respuesta esperada</b></div>' + blocks(Array.isArray(c.a) ? c.a : [c.a]) + "</div></div>" +
        '<div class="btns" id="cb"><button type="button" class="btn pri" id="rv">Mostrar respuesta</button><button type="button" class="btn ghost" id="sk">Pasar</button></div></div>';
      var tf = $("#tf"), tl = $("#tl"), tm = $("#tm");
      function reveal(timeout) {
        if (revealed) return; revealed = true; clearInterval(tick);
        $("#ans").classList.remove("hide");
        if (timeout) { tm.classList.add("out"); tl.textContent = "Tiempo"; }
        $("#cb").innerHTML = '<span style="color:var(--muted);font-size:.92rem">¿Cómo te fue?</span><button type="button" class="btn ok" data-r="1">La sabía</button><button type="button" class="btn" data-r="0.5">A medias</button><button type="button" class="btn bad" data-r="0">No la sabía</button>';
        $$("#cb [data-r]").forEach(function (b) { b.addEventListener("click", function () { res.push({ c: c, r: +b.dataset.r }); i++; show(); }); });
      }
      tick = setInterval(function () {
        left -= 0.25;
        tf.style.width = Math.max(0, 100 * left / secs) + "%";
        tl.textContent = fmt(Math.ceil(left));
        if (left <= secs * 0.3) tm.classList.add("warn");
        if (left <= 0) reveal(true);
      }, 250);
      $("#rv").addEventListener("click", function () { reveal(false); });
      $("#sk").addEventListener("click", function () { revealed = true; res.push({ c: c, r: 0 }); i++; show(); });
    }
    function end() {
      clearInterval(tick);
      var s = 0; res.forEach(function (r) { s += r.r; });
      var pct = Math.round(100 * s / res.length);
      var best = store.get("best", {}); best[lab.id] = Math.max(best[lab.id] || 0, pct); store.set("best", best);
      ar.innerHTML = '<div class="score"><span class="big">' + pct + "%</span><span>" + (pct >= 60 ? "Ronda aprobada." : "Repasá las cartas que no sabías y volvé a intentar.") + '</span></div><div class="quiz" style="margin-top:14px">' +
        res.filter(function (r) { return r.r < 1; }).map(function (r) { return '<div class="qcard wrong"><div class="qt">' + esc(r.c.tag || "") + '</div><div class="q"><b>' + r.c.q + '</b></div><div class="why">' + blocks(Array.isArray(r.c.a) ? r.c.a : [r.c.a]) + "</div></div>"; }).join("") +
        '</div><div class="btns" style="margin-top:14px"><button type="button" class="btn pri" id="again">Otra ronda</button></div>';
      $("#again").addEventListener("click", function () { runDeck(lab, n, secs); });
    }
    show();
  }
  function fmt(s) { s = Math.max(0, s); var m = Math.floor(s / 60), r = Math.round(s % 60); return m + ":" + (r < 10 ? "0" : "") + r; }

  /* ---------- defensas de TP ---------- */
  function pageDefensas() {
    var U = SSL.units;
    var h = '<section class="sec"><h2>Elegí el TP</h2><div class="btns">' + U.map(function (u) { return '<button type="button" class="btn" data-tp="' + u.id + '">TP ' + u.tp.n + " · " + esc(u.short) + "</button>"; }).join("") + '</div><div class="btns"><label class="inline">Tiempo <select class="sel" id="dt"><option value="15">15 min</option><option value="25" selected>25 min</option><option value="40">40 min</option></select></label></div></section><div id="def"></div>';
    pageList("Defensas de TP", "Mini parcial con tiempo", "La cátedra elige cualquier enunciado de la parte de los alumnos. Acá sale uno al azar: resolvelo en papel antes de que termine el reloj y después compará con la resolución.", h);
    $$("[data-tp]", app).forEach(function (b) { b.addEventListener("click", function () { $$("[data-tp]", app).forEach(function (x) { x.classList.remove("pri"); }); b.classList.add("pri"); runDef(U.filter(function (u) { return u.id === b.dataset.tp; })[0], +$("#dt").value); }); });
  }
  function runDef(u, mins) {
    clearInterval(tick);
    var e = pick(u.tp.alumnos.filter(function (x) { return !x.noDef; }), 1)[0], left = mins * 60, el = $("#def");
    el.innerHTML = '<div class="timer" id="tm" style="width:100%"><div class="lbl"><span>TP ' + u.tp.n + " · ejercicio " + esc(e.id) + '</span><span id="tl">' + fmt(left) + '</span></div><div class="bar"><div class="fill" id="tf"></div></div></div>' +
      '<div class="block strong" style="margin-top:12px"><div class="kicker">Enunciado</div><div class="prose">' + e.txt + '</div><textarea class="txt mono" placeholder="Anotá acá tu resolución o un esquema"></textarea><div class="btns"><button type="button" class="btn pri" id="fin">Terminé, ver resolución</button><button type="button" class="btn ghost" id="otro">Otro enunciado</button></div><div id="sol" class="hide"></div></div>';
    var tf = $("#tf"), tl = $("#tl"), tm = $("#tm");
    tick = setInterval(function () { left--; tf.style.width = (100 * left / (mins * 60)) + "%"; tl.textContent = fmt(left); if (left < mins * 12) tm.classList.add("warn"); if (left <= 0) { clearInterval(tick); tm.classList.add("out"); tl.textContent = "Tiempo"; showSol(); } }, 1000);
    function showSol() { clearInterval(tick); var s = $("#sol"); s.classList.remove("hide"); s.innerHTML = '<div class="why"><b>' + (e.sug ? "Resolución sugerida" : "Resolución") + "</b>" + (e.sol ? blocks(Array.isArray(e.sol) ? e.sol : [e.sol]) : "<p>Este ejercicio no tiene resolución cargada. Resolvelo con el método de la teoría y verificá en JFLAP.</p>") + "</div>"; mountSims(s); }
    $("#fin").addEventListener("click", showSol);
    $("#otro").addEventListener("click", function () { runDef(u, mins); });
  }

  /* ---------- simulacros ---------- */
  function pageSimulacro() {
    var h = '<section class="sec"><h2>Elegí el parcial</h2><div class="grid2">' + SSL.parciales.map(function (p) {
      return '<div class="block strong"><span class="kicker">' + esc(p.units) + "</span><h3>" + esc(p.title) + '</h3><p style="color:var(--muted)">' + p.desc + '</p><div class="btns"><button type="button" class="btn pri" data-p="' + p.id + '">Generar tema</button></div></div>';
    }).join("") + "</div></section><div id=\"exam\"></div>";
    pageList("Simulacro de parcial", "Formato 2026", "Cada tema se arma al azar con la misma estructura y puntaje que el Tema C del primer parcial 2026: nueve ítems de teoría (2 puntos en total) y cuatro ejercicios prácticos de 2 puntos cada uno. La teoría se corrige sola; la práctica la autoevaluás con la resolución.", h);
    $$("[data-p]", app).forEach(function (b) { b.addEventListener("click", function () { var p = SSL.parciales.filter(function (x) { return x.id === b.dataset.p; })[0]; var ex = $("#exam"); var gen = function () { return p.make(); }; ex.innerHTML = '<div class="head" style="margin:10px 0 14px"><div class="kicker">' + esc(p.title) + " · tema generado</div></div><div id=\"exq\"></div>"; mountQuiz($("#exq"), gen(), { num: false, scale: 10, regen: gen }); ex.scrollIntoView({ behavior: "smooth" }); }); });
  }
  function pageModelo() {
    var m = SSL.modelo;
    pageList(m.title, m.kicker, m.lede, blocks(m.intro) + '<div id="mq"></div>');
    mountQuiz($("#mq"), m.items, { num: false, scale: 10 });
  }

  /* ---------- búsqueda ---------- */
  var idx = [];
  function buildIdx() {
    SSL.units.forEach(function (u) {
      u.sections.forEach(function (s) {
        var txt = JSON.stringify(s.blocks).replace(/<[^>]+>/g, " ");
        idx.push({ t: s.title, u: "Unidad " + u.n, h: u.id + "-" + s.id, b: norm(s.title + " " + txt) });
      });
      idx.push({ t: "TP " + u.tp.n + " · " + u.tp.title, u: "Unidad " + u.n, h: u.id + "-tp", b: norm(u.tp.title + " tp trabajo practico") });
    });
    SSL.labs.forEach(function (l) { idx.push({ t: l.title, u: l.code, h: l.id, b: norm(l.title + " " + JSON.stringify(l.blocks).replace(/<[^>]+>/g, " ")) }); });
    SSL.graficas.forEach(function (g) { idx.push({ t: g.title, u: "Gráficas", h: "graficas", b: norm(g.title + " " + (g.p || "")) }); });
  }
  function initSearch() {
    var inp = $("#q"), box = $("#qr");
    function run() {
      var v = norm(inp.value); if (v.length < 2) { box.classList.add("hide"); return; }
      var words = v.split(" ");
      var r = idx.map(function (it) { var sc = 0; words.forEach(function (w) { if (norm(it.t).indexOf(w) >= 0) sc += 3; else if (it.b.indexOf(w) >= 0) sc += 1; else sc -= 5; }); return { it: it, sc: sc }; }).filter(function (x) { return x.sc > 0; }).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 10);
      box.innerHTML = r.length ? r.map(function (x) { return '<a href="#' + x.it.h + '"><small>' + esc(x.it.u) + "</small>" + esc(x.it.t) + "</a>"; }).join("") : '<p class="empty" style="padding:8px">Sin resultados.</p>';
      box.classList.remove("hide");
    }
    inp.addEventListener("input", run);
    inp.addEventListener("focus", run);
    document.addEventListener("click", function (e) { if (!e.target.closest(".search")) box.classList.add("hide"); });
    box.addEventListener("click", function () { box.classList.add("hide"); inp.value = ""; });
  }

  /* ---------- router ---------- */
  function route() {
    clearInterval(tick);
    (SSL._iv || []).forEach(clearInterval); SSL._iv = [];
    var h = (location.hash || "#inicio").slice(1) || "inicio";
    var base = h.split("-")[0];
    setNav(base);
    var u = SSL.units.filter(function (x) { return x.id === base; })[0];
    if (u) return pageUnit(u, h !== base ? h : null);
    if (base === "graficas") return pageGraficas();
    if (base === "labs" || base === "lab1" || base === "lab2" || base === "lab0") { pageLabs(); if (base !== "labs") { var t = document.getElementById(base); if (t) setTimeout(function () { t.scrollIntoView(); }, 30); } return; }
    if (base === "cartas") return pageCartas();
    if (base === "defensas") return pageDefensas();
    if (base === "simulacro") return pageSimulacro();
    if (base === "modelo") return pageModelo();
    pageHome(); window.scrollTo(0, 0);
  }
  SSL.start = function () {
    app = $("#app");
    buildIdx(); initSearch(); updatePill();
    window.addEventListener("hashchange", route);
    route();
  };
  SSL.util = { drawFA: drawFA, drawTree: drawTree, parseTree: parseTree, rr: rr, tapeHTML: tapeHTML, stackHTML: stackHTML, blocks: blocks, esc: esc, shuffle: shuffle, pick: pick, $: $, $$: $$ };
})();
