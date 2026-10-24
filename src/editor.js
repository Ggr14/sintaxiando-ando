/* Práctica con dibujo: editor de autómatas y corrección automática contra la solución */
(function () {
  "use strict";
  var SSL = window.SSL, U = SSL.util, $ = U.$, $$ = U.$$, esc = U.esc;
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("ssl:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("ssl:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  var KIND = { afd: "AFD", afnd: "AFND / AF-λ", mealy: "MEF de Mealy", moore: "MEF de Moore", ap: "Autómata de pila", mt: "Máquina de Turing" };
  var HELP = {
    afd: "Rótulo: los símbolos separados por coma, por ejemplo <code>a,b</code>.",
    afnd: "Rótulo: los símbolos separados por coma. Para una transición λ escribí <code>λ</code>.",
    mealy: "Rótulo: entrada/salida separados por coma, por ejemplo <code>0/n, 1/i</code>.",
    moore: "Rótulo: los símbolos de entrada. La salida va en el estado (seleccionalo y completá \"Salida\").",
    ap: "Rótulo: lee,saca,pone. Varias transiciones separadas por <code>;</code>. Ejemplo: <code>a,#,A#; a,A,AA</code>. Fin de cadena: <code>∆</code>; nada: <code>λ</code>.",
    mt: "Rótulo: lee,escribe,mueve (I, D o N). Varias separadas por <code>;</code>. Ejemplo: <code>a,∆,D; b,b,D</code>. Blanco: <code>∆</code>."
  };

  /* ---------- ejercicios ---------- */
  function cnt(w, c) { return w.split(c).length - 1; }
  function dfaAcc(delta, q0, F) { return function (w) { var q = q0; for (var i = 0; i < w.length; i++) { q = delta[q] && delta[q][w[i]]; if (q == null) return false; } return F.indexOf(q) >= 0; }; }
  var T12 = { A: { x: "H", y: "G" }, B: { x: "K", y: "H" }, C: { x: "B", y: "E" }, D: { x: "G", y: "J" }, E: { x: "M", y: "G" }, F: { x: "E", y: "A" }, G: { x: "L", y: "F" }, H: { x: "C", y: "B" }, I: { x: "A", y: "K" }, J: { x: "D", y: "C" }, K: { x: "H", y: "L" }, L: { x: "F", y: "G" }, M: { x: "L", y: "A" } };
  var EX = [
    { id: "af1", u: 2, kind: "afd", title: "aⁿbᵐ con m ≥ 1", txt: "Diseñá un AFD que acepte { aⁿbᵐ / n ≥ 0, m ≥ 1 } sobre Σ = {a, b}.", alpha: "ab", acc: function (w) { return /^a*b+$/.test(w); }, sol: "Dos estados: 1 (inicial) con lazo a y transición b a 2; 2 (final) con lazo b." },
    { id: "af2", u: 2, kind: "afd", title: "Cantidad par de a", txt: "Diseñá un AFD sobre Σ = {a, b} que acepte las palabras con cantidad par de a (λ incluida).", alpha: "ab", acc: function (w) { return cnt(w, "a") % 2 === 0; }, sol: "P (inicial y final) y I. Con a se alterna entre P e I; con b cada uno se queda en sí mismo." },
    { id: "af3", u: 2, kind: "afd", title: "Empiezan con x y terminan con y", txt: "TP2 2.2 a) como autómata: AFD sobre Σ = {x, y} que acepte las palabras que empiezan con x y terminan con y.", alpha: "xy", acc: function (w) { return /^x[xy]*y$/.test(w); }, sol: "A (inicial) –x→ B; B –x→ B; B –y→ C (final); C –y→ C; C –x→ B. Con y desde A no hay transición (o va a un sumidero)." },
    { id: "af4", u: 2, kind: "afd", title: "Sin tres x consecutivas", txt: "TP2 2.2 d) como autómata: AFD sobre Σ = {x, y} que acepte las palabras que no tienen tres x consecutivas.", alpha: "xy", acc: function (w) { return w.indexOf("xxx") < 0; }, sol: "Estados según cuántas x seguidas se leyeron: 0, 1 y 2 (los tres finales). Con y siempre vuelve a 0; con x avanza; desde 2 con x no hay transición." },
    { id: "af5", u: 2, kind: "afd", title: "Cantidad impar de y", txt: "TP2 2.2 c) como autómata: AFD sobre Σ = {x, y} con cantidad impar de y.", alpha: "xy", acc: function (w) { return cnt(w, "y") % 2 === 1; }, sol: "P (inicial) e I (final): con y se alterna, con x se queda." },
    { id: "af6", u: 2, kind: "afnd", title: "a.(a+b)*.b", txt: "Diseñá un AF (puede ser no determinista o con λ) que acepte el lenguaje de la ER a.(a + b)*.b.", alpha: "ab", acc: function (w) { return /^a[ab]*b$/.test(w); }, sol: "AFND2 de la clase: 0 –a→ 1; 1 con lazo a, b; 1 –b→ 2 (final)." },
    { id: "af7", u: 2, kind: "afnd", title: "(a.(a+b))*.a*.b", txt: "TP2 1.13: AF-λ (o AFND) que acepte (a.(a + b))*.a*.b.", alpha: "ab", acc: function (w) { return /^(a[ab])*a*b$/.test(w); }, sol: "Con Thompson: bloque (a.(a+b))* con λ de salteo y retorno, luego a* y por último b. Unificá finales." },
    { id: "af8", u: 2, kind: "afd", maxStates: 6, title: "AFD mínimo del Tema C", txt: "Ítem 12 del Tema C: dibujá el AFD <b>mínimo</b> equivalente a →A: x→H y→G · B: K H · *C: B E · D: G J · E: M G · F: E A · *G: L F · H: C B · I: A K · *J: D C · *K: H L · L: F G · M: L A. La corrección exige que tenga a lo sumo 6 estados.", alpha: "xy", acc: dfaAcc(T12, "A", ["C", "G", "J", "K"]), solSpec: "minq12", sol: "Clases: [A], [B,H], [C,K]*, [G]*, [E,L], [F,M]." },
    { id: "mef1", u: 2, kind: "mealy", alts: ["mealy", "moore"], title: "Detectar xyx", txt: "TP2 2.6 a): MEF sobre Σ = {x, y} que escriba 1 cada vez que completa la subcadena xyx (con solapamiento) y 0 en otro caso.", alpha: "xy", out: function (w) { var o = ""; for (var i = 0; i < w.length; i++) o += (i >= 2 && w.slice(i - 2, i + 1) === "xyx") ? "1" : "0"; return o; }, sol: "Mealy: q0 (nada) x/0→q1, y/0→q0 · q1 (vi x) x/0→q1, y/0→q2 · q2 (vi xy) x/1→q1, y/0→q0." },
    { id: "mef2", u: 2, kind: "moore", alts: ["moore", "mealy"], title: "Módulo 3 de la suma de bits", txt: "TP2 2.6 c): MEF que reciba dígitos binarios y escriba el módulo 3 de la suma parcial (0, 1 o 2).", alpha: "01", out: function (w) { var s = 0, o = ""; for (var i = 0; i < w.length; i++) { s = (s + +w[i]) % 3; o += s; } return o; }, sol: "Moore: q0/0, q1/1, q2/2. Con 0 se queda; con 1 avanza q0 → q1 → q2 → q0." },
    { id: "mef3", u: 2, kind: "mealy", alts: ["mealy", "moore"], title: "Módulo 4 del número leído", txt: "TP2 1.6: MEF que reciba un binario (bit más significativo primero) y escriba el módulo 4 del número leído hasta ese momento.", alpha: "01", out: function (w) { var v = 0, o = ""; for (var i = 0; i < w.length; i++) { v = (2 * v + +w[i]) % 4; o += v; } return o; }, sol: "El resto solo depende de los dos últimos bits. Moore: r0/0, r1/1, r2/2, r3/3; desde cualquier estado con 0 va a r(2·r mod 4) y con 1 a r(2·r+1 mod 4)." },
    { id: "mef4", u: 2, kind: "mealy", alts: ["mealy", "moore"], title: "abba → 1, bbb → 2", txt: "Parcial: MEF sobre Σ = {a, b} que escriba 1 al detectar la subcadena abba, 2 al detectar bbb y 0 en cualquier otro caso.", alpha: "ab", out: function (w) { var o = ""; for (var i = 0; i < w.length; i++) { var p = w.slice(0, i + 1); o += /abba$/.test(p) ? "1" : /bbb$/.test(p) ? "2" : "0"; } return o; }, sol: "Mealy con estados q0, qa, qab, qabb, qb, qbb (ver la resolución en el simulacro de primer parcial)." },
    { id: "ap1", u: 3, kind: "ap", title: "aⁿbⁿ con n ≥ 0", txt: "AP con aceptación por estado final para { aⁿbⁿ / n ≥ 0 } (AP1 de la clase). Pila inicial #.", alpha: "ab", acc: function (w) { var m = /^(a*)(b*)$/.exec(w); return !!m && m[1].length === m[2].length; }, solSpec: "ap1", sol: "Apilar A por cada a, desapilar por cada b, y aceptar con (∆, #, λ) tanto desde q0 (palabra vacía) como desde q1." },
    { id: "ap2", u: 3, kind: "ap", title: "(x + y)ⁿ zⁿ", txt: "TP3 2.7 b): AP para { (x + y)ⁿ zⁿ / n ≥ 0 }. Pila inicial #.", alpha: "xyz", acc: function (w) { var m = /^([xy]*)(z*)$/.exec(w); return !!m && m[1].length === m[2].length; }, sol: "0: (x,#,X#)(x,X,XX)(y,#,X#)(y,X,XX)→0 · (z,X,λ)→1 · (∆,#,λ)→f. 1: (z,X,λ)→1 · (∆,#,λ)→f." },
    { id: "ap3", u: 3, kind: "ap", title: "xⁿyᵐ con n > 0 y m > n", txt: "TP3 2.7 e): AP para { xⁿyᵐ / n &gt; 0, m &gt; n }. Pila inicial #.", alpha: "xy", acc: function (w) { var m = /^(x+)(y*)$/.exec(w); return !!m && m[2].length > m[1].length; }, solSpec: "tp3e", sol: "Ver el AP del ejercicio 2.7 e) del TP3." },
    { id: "ap4", u: 3, kind: "ap", title: "Palíndromos de longitud par", txt: "AP (no determinista) para { w.w⁻¹ / w ∈ {a, b}* }. Pila inicial #.", alpha: "ab", acc: function (w) { return w.length % 2 === 0 && w === w.split("").reverse().join(""); }, sol: "q0 apila lo que lee: (a,λ,A)(b,λ,B). Con (λ,λ,λ) adivina la mitad y pasa a q1, que desapila comparando: (a,A,λ)(b,B,λ). Acepta con (∆,#,λ)." },
    { id: "mt1", u: 4, kind: "mt", title: "aⁿbⁿ con n ≥ 1", txt: "MT que acepte { aⁿbⁿ / n ≥ 1 }. La cinta arranca como ∆w∆ con el cabezal en el primer símbolo.", alpha: "ab", acc: function (w) { var m = /^(a+)(b+)$/.exec(w); return !!m && m[1].length === m[2].length; }, sol: "Marcar una a con X, buscar a la derecha la primera b y marcarla con Y, volver a la X; cuando no queden a, verificar que solo haya Y." },
    { id: "mt2", u: 4, kind: "mt", title: "Palíndromos", txt: "MT que acepte los palíndromos sobre {a, b} (λ incluida).", alpha: "ab", acc: function (w) { return w === w.split("").reverse().join(""); }, solSpec: "mtpal", sol: "La MT de la clase: borra el primer símbolo, lo recuerda, va al final, compara y borra, y vuelve." },
    { id: "mt3", u: 4, kind: "mt", transform: 1, title: "Incrementar un binario", txt: "MT transformadora: recibe un binario no vacío y deja en la cinta el número más uno. Debe terminar en un estado final.", alpha: "01", words: function (n) { var o = []; for (var L = 1; L <= n; L++) for (var k = 0; k < (1 << L); k++) o.push(k.toString(2).padStart(L, "0")); return o; }, result: function (w) { var s = (parseInt(w, 2) + 1).toString(2); var pad = Math.max(w.length - s.length, 0); return "0".repeat(pad) + s; }, solSpec: "mtinc", sol: "Ir hasta el final; desde la derecha cambiar 1 por 0 mientras haya acarreo; el primer 0 (o el blanco) pasa a 1 y termina." },
    { id: "mt4", u: 4, kind: "mt", title: "Igual cantidad de a que de b", txt: "TP4 2.5 a): MT que acepte las secuencias sobre {a, b, c} con igual cantidad de a que de b.", alpha: "abc", acc: function (w) { return cnt(w, "a") === cnt(w, "b"); }, sol: "Ver la tabla del ejercicio 2.5 a) del TP4: marcar una a (o b) y buscar desde el inicio la pareja." }
  ];
  SSL.ejercicios = EX;

  /* ---------- modelo del alumno → especificación ---------- */
  function parse(model, kind) {
    var errs = [], st = {}, delta = {}, out = {}, trans = [], q0s = [], F = [];
    model.states.forEach(function (s) { st[s.id] = s; delta[s.id] = {}; if (s.ini) q0s.push(s.id); if (s.fin) F.push(s.id); if (kind === "moore") out[s.id] = s.out || ""; if (kind === "mealy") out[s.id] = {}; });
    model.trans.forEach(function (t) {
      if (!st[t.f] || !st[t.t]) return;
      var raw = String(t.l || "").trim(); if (!raw) { errs.push("Hay una transición de " + t.f + " a " + t.t + " sin rótulo."); return; }
      if (kind === "afd" || kind === "afnd" || kind === "moore") {
        raw.split(/[,\s]+/).filter(Boolean).forEach(function (a) {
          if (a === "lambda" || a === "\\") a = "λ";
          (delta[t.f][a] = delta[t.f][a] || []).push(t.t);
        });
      } else if (kind === "mealy") {
        raw.split(/\s*,\s*/).filter(Boolean).forEach(function (p) {
          var m = /^(.+?)\s*\/\s*(.*)$/.exec(p); if (!m) { errs.push("En " + t.f + " → " + t.t + ", \"" + p + "\" no tiene la forma entrada/salida."); return; }
          (delta[t.f][m[1]] = delta[t.f][m[1]] || []).push(t.t); out[t.f][m[1]] = m[2];
        });
      } else {
        raw.split(/\s*[;\n]\s*/).filter(Boolean).forEach(function (p) {
          var x = p.split(/\s*,\s*/);
          if (x.length !== 3) { errs.push("En " + t.f + " → " + t.t + ", \"" + p + "\" debería tener tres partes separadas por coma."); return; }
          x = x.map(function (v) { return v === "" ? "λ" : v; });
          if (kind === "ap") trans.push([t.f, x[0], x[1], t.t, x[2]]);
          else {
            var mv = x[2].toUpperCase(); mv = mv === "R" ? "D" : mv === "L" ? "I" : mv;
            if ("IDN".indexOf(mv) < 0 || mv.length !== 1) { errs.push("En " + t.f + " → " + t.t + ", el movimiento debe ser I, D o N."); return; }
            (delta[t.f][x[0]] = delta[t.f][x[0]] || []).push([t.t, x[1], mv]);
          }
        });
      }
    });
    return { st: st, delta: delta, out: out, trans: trans, q0s: q0s, F: F, errs: errs };
  }
  function validate(P, ex, kind) {
    var e = P.errs.slice();
    if (!P.q0s.length) e.push("Falta marcar el estado inicial.");
    if (P.q0s.length > 1 && kind !== "afnd") e.push("Este modelo admite un solo estado inicial.");
    if (kind === "afd" || kind === "mealy" || kind === "moore") {
      Object.keys(P.delta).forEach(function (q) { Object.keys(P.delta[q]).forEach(function (a) {
        if (a === "λ") e.push("Un " + KIND[kind] + " no admite transiciones λ (estado " + q + ").");
        else if (P.delta[q][a].length > 1) e.push("No es determinista: desde " + q + " con " + a + " hay más de una transición.");
        if (ex.alpha.indexOf(a) < 0 && a !== "λ") e.push("El símbolo " + a + " (desde " + q + ") no está en el alfabeto {" + ex.alpha.split("").join(", ") + "}.");
      }); });
    }
    if (kind === "mt") Object.keys(P.delta).forEach(function (q) { Object.keys(P.delta[q]).forEach(function (a) { if (P.delta[q][a].length > 1) e.push("La MT debe ser determinista: desde " + q + " leyendo " + a + " hay más de una transición."); }); });
    if (kind === "moore") P.F.length = 0;
    if (ex.maxStates && P.q0s.length) { var n = reach(P).length; if (n > ex.maxStates) e.push("Tiene " + n + " estados accesibles: el mínimo tiene " + ex.maxStates + "."); }
    return e.filter(function (v, i, a) { return a.indexOf(v) === i; });
  }
  function reach(P) { var seen = P.q0s.slice(), stk = seen.slice(); while (stk.length) { var q = stk.pop(); Object.keys(P.delta[q] || {}).forEach(function (a) { P.delta[q][a].forEach(function (p) { p = Array.isArray(p) ? p[0] : p; if (seen.indexOf(p) < 0) { seen.push(p); stk.push(p); } }); }); } return seen; }

  /* ---------- simuladores para corregir ---------- */
  function faAcc(P, w) {
    function clo(set) { var o = set.slice(), s = set.slice(); while (s.length) { var q = s.pop(); ((P.delta[q] || {})["λ"] || []).forEach(function (p) { if (o.indexOf(p) < 0) { o.push(p); s.push(p); } }); } return o; }
    var cur = clo(P.q0s);
    for (var i = 0; i < w.length && cur.length; i++) { var d = []; cur.forEach(function (q) { ((P.delta[q] || {})[w[i]] || []).forEach(function (p) { if (d.indexOf(p) < 0) d.push(p); }); }); cur = clo(d); }
    return cur.some(function (q) { return P.F.indexOf(q) >= 0; });
  }
  function mefOut(P, kind, w) {
    var q = P.q0s[0], o = "";
    for (var i = 0; i < w.length; i++) {
      var nx = (P.delta[q] || {})[w[i]]; if (!nx || !nx.length) return { o: o, blocked: i };
      if (kind === "mealy") o += (P.out[q][w[i]] || "");
      q = nx[0]; if (kind === "moore") o += (P.out[q] || "");
    }
    return { o: o };
  }
  function apAcc(P, w, crit) {
    var inp = w.split("").concat(["∆"]), n = inp.length, start = [P.q0s[0], 0, "#"], seen = {}, queue = [start], steps = 0, lim = 30000;
    while (queue.length && steps < lim) {
      var c = queue.shift(), q = c[0], i = c[1], stk = c[2], key = q + "|" + i + "|" + stk;
      if (seen[key]) continue; seen[key] = 1; steps++;
      if (crit === "final" ? (P.F.indexOf(q) >= 0 && i >= n - 1) : (stk === "" && i >= n - 1)) return true;
      if (P.F.indexOf(q) >= 0 && crit === "final") continue;
      for (var k = 0; k < P.trans.length; k++) {
        var r = P.trans[k]; if (r[0] !== q) continue;
        var ni = i;
        if (r[1] !== "λ") { if (i >= n || inp[i] !== r[1]) continue; ni = i + 1; }
        var ns = stk;
        if (r[2] !== "λ") { if (stk.slice(0, r[2].length) !== r[2]) continue; ns = stk.slice(r[2].length); }
        if (r[4] !== "λ") ns = r[4] + ns;
        if (ns.length > 2 * n + 8) continue;
        queue.push([r[3], ni, ns]);
      }
    }
    return false;
  }
  function mtRun(P, w) {
    var tape = ["∆"].concat(w ? w.split("") : []).concat(["∆"]), h = 1, q = P.q0s[0];
    for (var s = 0; s < 4000; s++) {
      if (P.F.indexOf(q) >= 0) return { acc: true, tape: tape.join("").replace(/^∆+|∆+$/g, "") };
      var r = (P.delta[q] || {})[tape[h]]; if (!r || !r.length) return { acc: false };
      r = r[0]; tape[h] = r[1]; q = r[0]; h += r[2] === "D" ? 1 : r[2] === "I" ? -1 : 0;
      if (h < 0) { tape.unshift("∆"); h = 0; } if (h >= tape.length) tape.push("∆");
    }
    return { acc: false, loop: true };
  }
  function allWords(alpha, budget) {
    var out = [""], L = 0, cur = [""];
    while (true) { var nx = []; cur.forEach(function (w) { alpha.split("").forEach(function (a) { nx.push(w + a); }); }); if (out.length + nx.length > budget) break; out = out.concat(nx); cur = nx; L++; if (L >= 14) break; }
    return { words: out, maxLen: L };
  }
  function show(w) { return w === "" ? "λ" : w; }
  function grade(ex, model, kind) {
    var P = parse(model, kind), errs = validate(P, ex, kind);
    if (errs.length) return { ok: false, errs: errs };
    var budget = kind === "ap" ? 1500 : kind === "mt" ? 1200 : 9000;
    var W = ex.words ? { words: ex.words(8), maxLen: 8 } : allWords(ex.alpha, budget), bad = [], loops = 0;
    for (var i = 0; i < W.words.length && bad.length < 4; i++) {
      var w = W.words[i];
      if (kind === "afd" || kind === "afnd") { var a = faAcc(P, w), e = ex.acc(w); if (a !== e) bad.push(e ? "Tu autómata rechaza <b>" + show(w) + "</b> y debería aceptarla." : "Tu autómata acepta <b>" + show(w) + "</b> y debería rechazarla."); }
      else if (kind === "mealy" || kind === "moore") { var r = mefOut(P, kind, w), eo = ex.out(w); if (r.blocked != null) bad.push("Con <b>" + show(w) + "</b> tu MEF se bloquea en el símbolo " + (r.blocked + 1) + ": falta una transición."); else if (r.o !== eo) bad.push("Con <b>" + show(w) + "</b> tu MEF escribe <b>" + show(r.o) + "</b> y debería escribir <b>" + show(eo) + "</b>."); }
      else if (kind === "ap") { var a2 = apAcc(P, w, model.crit || "final"), e2 = ex.acc(w); if (a2 !== e2) bad.push(e2 ? "Tu AP rechaza <b>" + show(w) + "</b> y debería aceptarla." : "Tu AP acepta <b>" + show(w) + "</b> y debería rechazarla."); }
      else if (kind === "mt") {
        var m = mtRun(P, w); if (m.loop) loops++;
        if (ex.transform) { var exp = ex.result(w); if (!m.acc) bad.push("Con <b>" + show(w) + "</b> tu MT " + (m.loop ? "no se detiene" : "se bloquea sin llegar a un final") + "."); else if (m.tape !== exp) bad.push("Con <b>" + show(w) + "</b> tu MT deja <b>" + show(m.tape) + "</b> y debería dejar <b>" + exp + "</b>."); }
        else { var e3 = ex.acc(w); if (m.acc !== e3) bad.push(e3 ? "Tu MT no acepta <b>" + show(w) + "</b>" + (m.loop ? " (no se detiene)" : "") + " y debería aceptarla." : "Tu MT acepta <b>" + show(w) + "</b> y debería rechazarla."); }
      }
    }
    return { ok: !bad.length, bad: bad, n: W.words.length, maxLen: W.maxLen, loops: loops };
  }

  /* ---------- editor ---------- */
  function mountEditor(el, ex) {
    var key = "ed:" + ex.id;
    var model = store.get(key, null) || { kind: ex.kind, states: [], trans: [], crit: "final" };
    if (ex.alts && ex.alts.indexOf(model.kind) < 0) model.kind = ex.kind;
    var mode = "estado", sel = null, from = null, drag = null;
    function kind() { return ex.alts ? model.kind : ex.kind; }
    function save() { store.set(key, model); }
    el.innerHTML = '<div class="sim ed">' +
      '<div class="ctrl" role="toolbar" aria-label="Herramientas"><div class="seg" id="modes">' +
      [["estado", "＋ Estado"], ["trans", "→ Transición"], ["mover", "✥ Mover"], ["borrar", "✕ Borrar"]].map(function (m) { return '<button type="button" class="btn ghost" data-m="' + m[0] + '">' + m[1] + "</button>"; }).join("") + "</div>" +
      (ex.alts ? '<label class="inline">Modelo <select class="sel" id="alt">' + ex.alts.map(function (a) { return '<option value="' + a + '">' + KIND[a] + "</option>"; }).join("") + "</select></label>" : "") +
      (ex.kind === "ap" ? '<label class="inline">Aceptación <select class="sel" id="crit"><option value="final">por estado final</option><option value="vacia">por pila vacía</option></select></label>' : "") +
      '</div><div class="edhint" id="hint"></div>' +
      '<div class="edcanvas" id="cv" tabindex="0" aria-label="Lienzo del autómata"></div>' +
      '<div class="edpanel" id="panel"></div>' +
      '<div class="edrow"><span class="k">Transición</span><select class="sel" id="tf"></select><span>→</span><select class="sel" id="tt"></select><input class="txt mono" id="tl" placeholder="rótulo" autocomplete="off" spellcheck="false" style="flex:1;min-width:140px"><span class="sym"><button type="button" class="btn ghost" data-ins="λ">λ</button>' + ((ex.kind === "ap" || ex.kind === "mt") ? '<button type="button" class="btn ghost" data-ins="∆">∆</button>' : "") + (ex.kind === "ap" ? '<button type="button" class="btn ghost" data-ins="#">#</button>' : "") + '</span><button type="button" class="btn" id="tadd">Agregar</button></div>' +
      '<div class="tbl-wrap" id="tlist"></div>' +
      '<div class="btns"><button type="button" class="btn pri" id="chk">Corregir</button><button type="button" class="btn" id="try">Probar palabras</button><button type="button" class="btn ghost" id="sol">Ver solución</button><button type="button" class="btn ghost" id="clr">Empezar de nuevo</button></div>' +
      '<div id="res"></div><div id="trybox"></div><div id="solbox" class="hide"></div></div>';
    var cv = $("#cv", el);
    function setMode(m) { mode = m; from = null; cv.classList.toggle("drag", m === "mover"); $$("#modes [data-m]", el).forEach(function (b) { b.classList.toggle("pri", b.dataset.m === m); b.classList.toggle("ghost", b.dataset.m !== m); }); hint(); render(); }
    function hint() {
      var h = { estado: "Tocá un lugar vacío del lienzo para crear un estado. Tocá un estado para seleccionarlo.", trans: from ? "Ahora tocá el estado de destino (puede ser el mismo, para un lazo)." : "Tocá el estado de origen.", mover: "Arrastrá los estados para acomodarlos.", borrar: "Tocá un estado para borrarlo junto con sus transiciones." }[mode];
      $("#hint", el).innerHTML = h + " " + HELP[kind()];
    }
    function nextId() { var i = 0; while (model.states.some(function (s) { return s.id === "q" + i; })) i++; return "q" + i; }
    function spec() {
      var k = kind(), edges = {}, order = [];
      model.trans.forEach(function (t) { var kk = t.f + ">" + t.t; if (!edges[kk]) { edges[kk] = { f: t.f, t: t.t, l: [] }; order.push(kk); } edges[kk].l.push(t.l); });
      var sp = { type: k === "moore" ? "moore" : "afd", w: 640, h: 360, r: 20, states: model.states.map(function (s) { return { id: s.id, x: s.x, y: s.y }; }), q0s: model.states.filter(function (s) { return s.ini; }).map(function (s) { return s.id; }), F: k === "moore" ? [] : model.states.filter(function (s) { return s.fin; }).map(function (s) { return s.id; }), out: {}, loops: {} };
      model.states.forEach(function (s) { sp.out[s.id] = s.out || "?"; sp.loops[s.id] = s.y < 70 ? "down" : "up"; });
      sp.edges = order.map(function (kk) { var e = edges[kk]; var sep = (k === "ap" || k === "mt") ? "\n" : ", "; return { f: e.f, t: e.t, l: e.l.join(sep).replace(/\s*;\s*/g, "\n") }; });
      return sp;
    }
    function render() {
      var sp = spec(), cur = []; if (sel) cur.push(sel); if (from) cur.push(from);
      cv.innerHTML = model.states.length ? SSL.util.drawFA(sp, { cur: cur }) : '<svg viewBox="0 0 640 360" width="640"><text class="fa-sub" x="320" y="180" style="font-size:14px">Tocá acá para crear el primer estado</text></svg>';
      var svg = $("svg", cv); svg.setAttribute("width", "640"); svg.style.width = "100%";
      var opts = model.states.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc(s.id) + "</option>"; }).join("");
      var vf = $("#tf", el).value, vt = $("#tt", el).value;
      $("#tf", el).innerHTML = opts; $("#tt", el).innerHTML = opts;
      if (vf) $("#tf", el).value = vf; if (vt) $("#tt", el).value = vt;
      $("#tlist", el).innerHTML = model.trans.length ? '<table class="t mono tight"><thead><tr><th>De</th><th>A</th><th>Rótulo</th><th></th></tr></thead><tbody>' + model.trans.map(function (t, i) { return "<tr><td>" + esc(t.f) + "</td><td>" + esc(t.t) + '</td><td><input class="txt mono" data-ti="' + i + '" value="' + esc(t.l) + '" style="width:100%;min-width:120px;padding:3px 6px"></td><td><button type="button" class="btn ghost" data-td="' + i + '" aria-label="Borrar transición">✕</button></td></tr>'; }).join("") + "</tbody></table>" : '<p class="empty">Todavía no hay transiciones.</p>';
      panel();
    }
    function panel() {
      var s = model.states.filter(function (x) { return x.id === sel; })[0], k = kind();
      $("#panel", el).innerHTML = s ? '<div class="edrow"><span class="k">Estado</span><input class="txt mono" id="sn" value="' + esc(s.id) + '" style="width:90px" aria-label="Nombre del estado"><label class="inline"><input type="checkbox" id="si"' + (s.ini ? " checked" : "") + "> Inicial</label>" + (k !== "moore" ? '<label class="inline"><input type="checkbox" id="sf"' + (s.fin ? " checked" : "") + "> Final</label>" : "") + (k === "moore" ? '<label class="inline">Salida <input class="txt mono" id="so" value="' + esc(s.out || "") + '" style="width:70px"></label>' : "") + "</div>" : '<p class="empty">Seleccioná un estado para marcarlo como inicial' + (k !== "moore" ? " o final" : "") + (k === "moore" ? " o ponerle la salida" : "") + ".</p>";
      if (!s) return;
      $("#si", el).addEventListener("change", function (e) { if (k !== "afnd" && e.target.checked) model.states.forEach(function (x) { x.ini = false; }); s.ini = e.target.checked; save(); render(); });
      if ($("#sf", el)) $("#sf", el).addEventListener("change", function (e) { s.fin = e.target.checked; save(); render(); });
      if ($("#so", el)) $("#so", el).addEventListener("input", function (e) { s.out = e.target.value.trim(); save(); var sp = spec(); cv.innerHTML = SSL.util.drawFA(sp, { cur: [sel] }); var svg = $("svg", cv); svg.style.width = "100%"; });
      $("#sn", el).addEventListener("change", function (e) {
        var nn = e.target.value.trim(); if (!nn || model.states.some(function (x) { return x.id === nn; })) { e.target.value = s.id; return; }
        model.trans.forEach(function (t) { if (t.f === s.id) t.f = nn; if (t.t === s.id) t.t = nn; }); s.id = nn; sel = nn; save(); render();
      });
    }
    function pt(ev) { var svg = $("svg", cv); var p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; var m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; var r = p.matrixTransform(m.inverse()); return { x: r.x, y: r.y }; }
    function hit(p) { for (var i = model.states.length - 1; i >= 0; i--) { var s = model.states[i]; if ((s.x - p.x) * (s.x - p.x) + (s.y - p.y) * (s.y - p.y) <= 24 * 24) return s; } return null; }
    cv.addEventListener("pointerdown", function (ev) {
      var p = pt(ev), s = hit(p);
      if (mode === "estado") { if (s) { sel = s.id; drag = s; } else { var id = nextId(); model.states.push({ id: id, x: Math.round(Math.max(26, Math.min(614, p.x))), y: Math.round(Math.max(26, Math.min(334, p.y))), ini: !model.states.length, fin: false }); sel = id; save(); } render(); }
      else if (mode === "mover") { if (s) { drag = s; sel = s.id; render(); } }
      else if (mode === "borrar") { if (s) { model.states = model.states.filter(function (x) { return x !== s; }); model.trans = model.trans.filter(function (t) { return t.f !== s.id && t.t !== s.id; }); if (sel === s.id) sel = null; save(); render(); } }
      else if (mode === "trans") { if (s) { if (!from) { from = s.id; hint(); render(); } else { $("#tf", el).value = from; $("#tt", el).value = s.id; from = null; hint(); render(); $("#tf", el).value = $("#tf", el).value; var tl = $("#tl", el); tl.focus(); } } }
      if (drag) { try { cv.setPointerCapture(ev.pointerId); } catch (e) {} }
    });
    cv.addEventListener("pointermove", function (ev) { if (!drag) return; var p = pt(ev); drag.x = Math.round(Math.max(22, Math.min(618, p.x))); drag.y = Math.round(Math.max(22, Math.min(338, p.y))); render(); });
    cv.addEventListener("pointerup", function () { if (drag) { drag = null; save(); } });
    function addTrans() { var f = $("#tf", el).value, t = $("#tt", el).value, l = $("#tl", el).value.trim(); if (!f || !t || !l) { $("#tl", el).focus(); return; } model.trans.push({ f: f, t: t, l: l }); $("#tl", el).value = ""; save(); render(); }
    $("#tadd", el).addEventListener("click", addTrans);
    $("#tl", el).addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); addTrans(); } });
    el.addEventListener("click", function (e) {
      var m = e.target.closest("[data-m]"); if (m) setMode(m.dataset.m);
      var ins = e.target.closest("[data-ins]"); if (ins) { var tl = $("#tl", el); var p = tl.selectionStart || tl.value.length; tl.value = tl.value.slice(0, p) + ins.dataset.ins + tl.value.slice(p); tl.focus(); }
      var td = e.target.closest("[data-td]"); if (td) { model.trans.splice(+td.dataset.td, 1); save(); render(); }
    });
    $("#tlist", el).addEventListener("change", function (e) { var i = e.target.dataset.ti; if (i != null) { model.trans[+i].l = e.target.value.trim(); save(); render(); } });
    if ($("#alt", el)) { $("#alt", el).value = model.kind; $("#alt", el).addEventListener("change", function (e) { model.kind = e.target.value; save(); hint(); render(); }); }
    if ($("#crit", el)) { $("#crit", el).value = model.crit || "final"; $("#crit", el).addEventListener("change", function (e) { model.crit = e.target.value; save(); }); }
    $("#clr", el).addEventListener("click", function () { var b = this; if (b.dataset.sure) { model.states = []; model.trans = []; sel = null; save(); render(); $("#res", el).innerHTML = ""; b.textContent = "Empezar de nuevo"; delete b.dataset.sure; } else { b.dataset.sure = 1; b.textContent = "Tocá otra vez para borrar todo"; setTimeout(function () { b.textContent = "Empezar de nuevo"; delete b.dataset.sure; }, 3000); } });
    $("#chk", el).addEventListener("click", function () {
      var r = grade(ex, model, kind()), box = $("#res", el);
      if (r.errs) { box.innerHTML = '<div class="why edbad"><b>Revisá esto antes de corregir</b><ul>' + r.errs.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>"; return; }
      if (r.ok) { box.innerHTML = '<div class="why edok"><b>Correcto.</b><p>Coincide con la solución en las ' + r.n + " palabras de hasta " + r.maxLen + " símbolos" + (kind() === "ap" || kind() === "mt" ? " que se probaron" : "") + "." + (ex.maxStates ? " Y tiene la cantidad mínima de estados." : "") + "</p></div>"; var done = store.get("eddone", {}); done[ex.id] = 1; store.set("eddone", done); var chip = document.querySelector('[data-ex="' + ex.id + '"]'); if (chip) chip.classList.add("ok"); }
      else box.innerHTML = '<div class="why edbad"><b>Todavía no.</b><ul>' + r.bad.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul><p>Probá esas palabras con el botón \"Probar palabras\" para ver dónde se desvía.</p></div>";
    });
    $("#try", el).addEventListener("click", function () {
      var P = parse(model, kind()), errs = validate(P, ex, kind()).filter(function (x) { return !/estados accesibles/.test(x); }), box = $("#trybox", el);
      if (errs.length) { box.innerHTML = '<div class="why edbad"><b>Revisá esto primero</b><ul>' + errs.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>"; return; }
      var k = kind(), sp = spec(), sim = { title: "Tu " + KIND[k], states: sp.states, w: sp.w, h: sp.h, r: 20, loops: sp.loops, q0: P.q0s[0], q0s: P.q0s, F: P.F, edges: sp.edges };
      if (k === "afnd") { sim.type = "afnd"; sim.delta = P.delta; }
      if (k === "afd") { sim.type = "afd"; sim.delta = {}; Object.keys(P.delta).forEach(function (q) { sim.delta[q] = {}; Object.keys(P.delta[q]).forEach(function (a) { sim.delta[q][a] = P.delta[q][a][0]; }); }); }
      if (k === "mealy" || k === "moore") { sim.type = k; sim.delta = {}; Object.keys(P.delta).forEach(function (q) { sim.delta[q] = {}; Object.keys(P.delta[q]).forEach(function (a) { sim.delta[q][a] = P.delta[q][a][0]; }); }); sim.out = P.out; }
      if (k === "ap") { sim.type = "ap"; sim.trans = P.trans; sim.z0 = "#"; }
      if (k === "mt") { sim.type = "mt"; sim.delta = {}; Object.keys(P.delta).forEach(function (q) { sim.delta[q] = {}; Object.keys(P.delta[q]).forEach(function (a) { sim.delta[q][a] = P.delta[q][a][0]; }); }); }
      box.innerHTML = '<div style="margin-top:12px"></div>';
      SSL.machineSim(box.firstChild, { spec: sim, title: sim.title, kicker: "Probá tu diseño", words: ex.alpha.length ? [ex.alpha[0] + ex.alpha[ex.alpha.length - 1], ""] : [""], desc: k === "ap" ? "El simulador sigue la primera transición posible; si tu AP es no determinista, la corrección sí prueba todos los caminos." : "" });
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    $("#sol", el).addEventListener("click", function () {
      var b = $("#solbox", el); b.classList.toggle("hide");
      if (!b.classList.contains("hide")) { b.innerHTML = '<div class="why"><b>Solución de referencia</b><p>' + ex.sol + "</p>" + (ex.solSpec && SSL.specs[ex.solSpec] ? '<div class="canvas fig" style="overflow-x:auto;background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:8px">' + SSL.util.drawFA(SSL.specs[ex.solSpec]) + "</div>" : "") + '<p style="color:var(--muted)">Puede haber otras soluciones correctas: la corrección compara lenguajes (o salidas), no dibujos.</p></div>'; }
    });
    setMode(model.states.length ? "mover" : "estado");
  }
  SSL.mountEditor = mountEditor;

  /* ---------- página ---------- */
  SSL.pagePractica = function (id) {
    var done = store.get("eddone", {}), ex = EX.filter(function (e) { return e.id === id; })[0];
    var units = [[2, "Unidad 2 · Autómatas finitos y MEF"], [3, "Unidad 3 · Autómatas de pila"], [4, "Unidad 4 · Máquinas de Turing"]];
    var list = units.map(function (u) { return '<div class="block"><h3>' + u[1] + '</h3><div class="chips">' + EX.filter(function (e) { return e.u === u[0]; }).map(function (e) { return '<a class="chip exchip' + (done[e.id] ? " ok" : "") + (ex && e.id === ex.id ? " on" : "") + '" data-ex="' + e.id + '" href="#practica-' + e.id + '">' + esc(e.title) + "</a>"; }).join("") + "</div></div>"; }).join("");
    var inner = '<section class="sec"><div class="grid3">' + list + "</div></section>";
    if (ex) inner += '<section class="sec" id="ejercicio"><h2><span class="n">' + KIND[ex.kind] + "</span>" + esc(ex.title) + '</h2><div class="prose"><p>' + ex.txt + '</p></div><div id="edhost"></div></section>';
    else inner += '<section class="sec"><div class="prose"><p>Elegí un ejercicio. Dibujás el autómata en el lienzo, tocás <b>Corregir</b> y la página lo compara con la solución probando todas las palabras cortas (o, en las MEF, comparando la salida). Si algo falla, te muestra una palabra donde tu diseño se equivoca.</p><p>No hace falta que tu dibujo sea igual al de la solución: cualquier autómata que reconozca el mismo lenguaje está bien. Tu dibujo se guarda en este navegador.</p></div></section>';
    U.pageList("Práctica", "Dibujá y corregí", "Ejercicios de los TP y parciales para resolver dibujando el autómata, la MEF, el autómata de pila o la máquina de Turing. La corrección es automática.", inner);
    if (ex) { mountEditor($("#edhost"), ex); setTimeout(function () { var s = document.getElementById("ejercicio"); if (s) s.scrollIntoView(); }, 20); }
  };
})();
