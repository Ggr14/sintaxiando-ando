/* Registro de simuladores y lista de la página Gráficas */
(function () {
  var SSL = window.SSL, S = SSL.specs, U = SSL.util;
  SSL._iv = SSL._iv || [];
  function ms(key, spec, words, extra) { SSL.registerSim(key, function (el) { SSL.machineSim(el, Object.assign({ spec: spec, words: words, title: spec.title }, extra || {})); }); }

  ms("hero-afd", S.af1, ["aab", "abb", "b", "ba", "aa"], { kicker: "Probá una palabra", title: "aⁿbᵐ con m ≥ 1" });
  ms("af1", S.af1, ["aabbb", "b", "", "aba", "aa"], { kicker: "AFD paso a paso" });
  ms("minq12", S.minq12, ["xx", "y", "xyxx", "yyx", "xxyx"], { kicker: "AFD mínimo" });
  ms("afnd2", S.afnd2, ["ab", "aabab", "abba", "b"], { kicker: "AFND: se sigue el conjunto de estados" });
  ms("a4", S.a4, ["", "a", "bab", "abba"], { kicker: "AF-λ con clausura", desc: "El conjunto inicial ya incluye la Clausura-λ de G. Cada paso aplica Destino y después Clausura-λ, como en la construcción de subconjuntos." });
  ms("mef1", S.mef1, ["011", "10101", "00", "0110"], { kicker: "MEF Mealy", interpret: function (o) { var l = o[o.length - 1]; return l === "n" ? "solo hubo ceros" : l === "p" ? "cantidad par de unos" : l === "i" ? "cantidad impar de unos" : ""; } });
  ms("mef2", S.mef2, ["00101", "110", "01", "0011"], { kicker: "MEF Moore", desc: "El número binario se ingresa invertido (bit menos significativo primero). La salida invertida es el complemento A2.", interpret: function (o) { return "complemento A2 = " + o.slice().reverse().join(""); } });
  ms("mef3", S.mef3, ["aabab", "bb", "aaa", "baa"], { kicker: "MEF Moore aceptora", interpret: function (o) { return o[o.length - 1] === "A" ? "acepta" : "rechaza"; } });
  ms("ap1", S.ap1, ["aabb", "", "abb", "aab", "ab"], { kicker: "Autómata de pila" });
  ms("ap9", S.ap9, ["abb", "aabbbb", "ab", ""], { kicker: "Autómata de pila" });
  ms("ap8", S.ap8, ["aab", "a", "ab", "aaabb"], { kicker: "Autómata de pila" });
  ms("tp3e", S.tp3e, ["xyy", "xxyyy", "xy", "yy"], { kicker: "Autómata de pila" });
  ms("mtpal", S.mtpal, ["aba", "bb", "", "ab", "abba"], { kicker: "Máquina de Turing" });
  ms("mtadd", S.mtadd, ["11+111", "+1", "1+"], { kicker: "MT calculadora" });
  ms("mtinc", S.mtinc, ["1011", "111", "0", "10"], { kicker: "MT calculadora" });

  /* ---------- display de 7 segmentos ---------- */
  var SEG = { "1": "bc", "2": "abdeg", "3": "abcdg", "4": "bcfg", "S": "acdfg", "b": "cdefg" };
  function seg7(ch) {
    var on = SEG[ch] || "", p = { a: [8, 4, 36, 8], b: [44, 10, 8, 30], c: [44, 46, 8, 30], d: [8, 76, 36, 8], e: [0, 46, 8, 30], f: [0, 10, 8, 30], g: [8, 40, 36, 8] };
    return '<svg class="seg7" viewBox="-2 0 56 88" role="img" aria-label="Display: ' + ch + '">' + Object.keys(p).map(function (k) { var r = p[k]; return '<rect class="s' + (on.indexOf(k) >= 0 ? " on" : "") + '" x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" rx="3"/>'; }).join("") + "</svg>";
  }

  /* ---------- ascensor de 2 pisos con la tabla de la cátedra ---------- */
  var TT = [[0, 1, 2, 3], [0, 2, 2, 3], [0, 1, 2, 0], [0, 2, 2, 0], [1, 1, 2, 3], [1, 2, 2, 3], [1, 1, 2, 0], [1, 2, 2, 0], [0, 1, 3, 3], [0, 2, 3, 3], [0, 1, 3, 0], [0, 2, 3, 0], [1, 1, 3, 3], [1, 2, 3, 3], [1, 1, 3, 0], [1, 2, 3, 0]];
  var NAMES = ["Q0", "Q1", "Q2", "Q3"], DESC = ["detenido en piso 1", "subiendo", "detenido en piso 2", "bajando"], DISP = ["1", "S", "2", "b"], MOT = [[0, 0], [1, 0], [0, 0], [0, 1]];
  SSL.registerSim("elev2", function (el) {
    var st = 0, pos = 0, press = { B1: 0, B2: 0 }, run = true, log = [];
    el.innerHTML = '<div class="sim"><div><div class="kicker">Laboratorio 1 · MEF de Moore</div><h3 style="margin-top:4px">Ascensor de 2 pisos con la tabla de la cátedra</h3><p style="color:var(--muted);font-size:.95rem;margin-top:4px">Apretá los pulsadores. Los fines de carrera se activan solos cuando la cabina llega. En cada ciclo del loop se calcula la fila B1·8 + B2·4 + FC1·2 + FC2 y se busca tablaTran[fila][estado].</p></div>' +
      '<div class="elev"><div class="shaft" id="sh"><div class="floor" style="bottom:216px">Piso 2</div><div class="floor" style="bottom:4px">Piso 1</div><div class="cab" id="cab"></div></div>' +
      '<div style="display:flex;flex-direction:column;gap:12px;min-width:0"><div class="btns"><button type="button" class="btn pri" data-b="B2">B2 · llamar al piso 2</button><button type="button" class="btn pri" data-b="B1">B1 · llamar al piso 1</button><button type="button" class="btn ghost" id="pp">Pausar</button></div>' +
      '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div id="d7"></div><div style="display:flex;flex-direction:column;gap:6px"><div class="status" id="es"></div><div class="io" id="io"></div></div></div>' +
      '<div class="tbl-wrap" id="tb"></div><div class="trace" id="lg"></div></div></div></div>';
    var cab = U.$("#cab", el);
    function table(row) {
      var h = '<table class="t mono tight" style="font-size:.78rem"><thead><tr><th>Fila</th><th>B1 B2 FC1 FC2</th>' + NAMES.map(function (n, i) { return "<th>" + n + "/" + (i % 2 ? (i === 1 ? "SUBIR" : "BAJAR") : "STOP") + "</th>"; }).join("") + "</tr></thead><tbody>";
      for (var r = 0; r < 16; r++) { var bits = [(r >> 3) & 1, (r >> 2) & 1, (r >> 1) & 1, r & 1].join(" "); h += "<tr" + (r === row ? ' style="font-weight:700"' : "") + "><td>" + r + "</td><td>" + bits + "</td>" + TT[r].map(function (v, c) { return '<td class="' + (r === row && c === st ? "hl" : "") + '">' + NAMES[v] + "</td>"; }).join("") + "</tr>"; }
      return h + "</tbody></table>";
    }
    function tick() {
      if (!run) return;
      var fc1 = pos <= 0.001 ? 1 : 0, fc2 = pos >= 0.999 ? 1 : 0;
      var row = press.B1 * 8 + press.B2 * 4 + fc1 * 2 + fc2, prev = st;
      U.$("#tb", el).innerHTML = table(row);
      st = TT[row][st];
      if (st !== prev) { log.unshift("fila " + row + ": " + NAMES[prev] + " → " + NAMES[st]); log = log.slice(0, 6); }
      if (MOT[st][0]) pos = Math.min(1, pos + 0.025); if (MOT[st][1]) pos = Math.max(0, pos - 0.025);
      press.B1 = press.B2 = 0;
      cab.style.bottom = (4 + pos * 212) + "px";
      U.$("#d7", el).innerHTML = seg7(DISP[st]);
      U.$("#es", el).textContent = NAMES[st] + " · " + DESC[st];
      U.$("#io", el).innerHTML = [["B1", row & 8], ["B2", row & 4], ["FC1", fc1], ["FC2", fc2], ["IN1", MOT[st][0]], ["IN2", MOT[st][1]]].map(function (x) { return '<span class="led' + (x[1] ? " on" : "") + '">' + x[0] + "</span>"; }).join("");
      U.$("#lg", el).textContent = log.length ? log.join("\n") : "Sin transiciones todavía.";
    }
    el.addEventListener("click", function (e) { var b = e.target.closest("[data-b]"); if (b) press[b.dataset.b] = 1; if (e.target.id === "pp") { run = !run; e.target.textContent = run ? "Pausar" : "Seguir"; } });
    tick(); SSL._iv.push(setInterval(tick, 90));
  });

  /* ---------- ascensor de 4 pisos: modelo propuesto ---------- */
  SSL.registerSim("elev4", function (el) {
    var st = "P1", pos = 0, press = 0, run = true, log = [];
    el.innerHTML = '<div class="sim"><div><div class="kicker">Propuesta para 4 pisos</div><h3 style="margin-top:4px">MEF de 10 estados: P1–P4, S2–S4, B1–B3</h3><p style="color:var(--muted);font-size:.95rem;margin-top:4px">Pk: detenido en el piso k. Sk y Bk: subiendo o bajando hacia el piso k. El fin de carrera del destino lleva al estado detenido.</p></div>' +
      '<div class="elev"><div class="shaft" style="height:300px">' + [4, 3, 2, 1].map(function (k) { return '<div class="floor" style="bottom:' + (4 + (k - 1) * 84) + 'px">Piso ' + k + "</div>"; }).join("") + '<div class="cab" id="cab4"></div></div>' +
      '<div style="display:flex;flex-direction:column;gap:12px;min-width:0"><div class="btns">' + [1, 2, 3, 4].map(function (k) { return '<button type="button" class="btn pri" data-k="' + k + '">B' + k + "</button>"; }).join("") + '<button type="button" class="btn ghost" id="pp4">Pausar</button></div>' +
      '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div id="d74"></div><div style="display:flex;flex-direction:column;gap:6px"><div class="status" id="es4"></div><div class="io" id="io4"></div></div></div><div class="trace" id="lg4"></div></div></div></div>';
    function f(q, btn, fc) {
      var t = q[0], k = +q[1];
      if (t === "P" && btn) return btn > k ? "S" + btn : btn < k ? "B" + btn : q;
      if ((t === "S" || t === "B") && fc === k) return "P" + k;
      return q;
    }
    function tick() {
      if (!run) return;
      var fc = 0; for (var k = 1; k <= 4; k++) if (Math.abs(pos - (k - 1)) < 0.026) fc = k;
      var prev = st; st = f(st, press, fc);
      if (st !== prev) { log.unshift(prev + " --" + (press ? "B" + press : "FC" + fc) + "--> " + st); log = log.slice(0, 6); }
      press = 0;
      if (st[0] === "S") pos = Math.min(3, pos + 0.05); if (st[0] === "B") pos = Math.max(0, pos - 0.05);
      if (st[0] === "P") pos = +st[1] - 1;
      U.$("#cab4", el).style.bottom = (4 + pos * 84) + "px";
      U.$("#d74", el).innerHTML = seg7(st[0] === "P" ? st[1] : st[0] === "S" ? "S" : "b");
      U.$("#es4", el).textContent = st + " · " + (st[0] === "P" ? "detenido en piso " + st[1] : (st[0] === "S" ? "subiendo" : "bajando") + " hacia el piso " + st[1]);
      U.$("#io4", el).innerHTML = [["FC" + (fc || "–"), fc], ["IN1", st[0] === "S"], ["IN2", st[0] === "B"]].map(function (x) { return '<span class="led' + (x[1] ? " on" : "") + '">' + x[0] + "</span>"; }).join("");
      U.$("#lg4", el).textContent = log.length ? log.join("\n") : "Sin transiciones todavía.";
    }
    el.addEventListener("click", function (e) { var b = e.target.closest("[data-k]"); if (b) press = +b.dataset.k; if (e.target.id === "pp4") { run = !run; e.target.textContent = run ? "Pausar" : "Seguir"; } });
    tick(); SSL._iv.push(setInterval(tick, 90));
  });

  SSL.graficas = [
    { id: "afd", title: "Autómata finito determinista", sim: "af1", p: "Acepta aⁿbᵐ con m ≥ 1. La palabra se rechaza si se bloquea (no hay transición) o si termina en un estado no final." },
    { id: "min", title: "AFD mínimo del Tema C", sim: "minq12", p: "Resultado del ítem 12: seis clases de equivalencia." },
    { id: "afnd", title: "Autómata finito no determinista", sim: "afnd2", p: "a.(a+b)*.b. El simulador sigue todos los caminos a la vez como un conjunto de estados." },
    { id: "afl", title: "AF-λ y construcción de subconjuntos", sim: "a4" },
    { id: "mealy", title: "MEF de Mealy", sim: "mef1", p: "La salida está en la transición: entrada/salida." },
    { id: "moore", title: "MEF de Moore", sim: "mef2", p: "La salida está en el estado: q/s." },
    { id: "moore2", title: "MEF de Moore como aceptor", sim: "mef3" },
    { id: "ap", title: "Autómata de pila · aⁿbⁿ", sim: "ap1", p: "Rótulos (lee, saca, pone). Cada a apila una A; cada b desapila una; al leer el fin de cadena con # en el tope, acepta." },
    { id: "ap2", title: "Autómata de pila · aⁿb²ⁿ", sim: "ap9" },
    { id: "ap3", title: "Autómata de pila · aⁿbᵐ con n > m", sim: "ap8" },
    { id: "mt", title: "Máquina de Turing · palíndromos", sim: "mtpal", p: "Rótulos (lee, escribe, mueve). Mirá cómo borra los extremos y vuelve." },
    { id: "mt2", title: "Máquina de Turing · suma unaria", sim: "mtadd" },
    { id: "mt3", title: "Máquina de Turing · incremento binario", sim: "mtinc" },
    { id: "lab1", title: "Ascensor de 2 pisos (Laboratorio 1)", sim: "elev2" },
    { id: "lab1b", title: "Ascensor de 4 pisos (propuesta)", sim: "elev4" }
  ];
})();
