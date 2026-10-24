/* Unidad 2 · Lenguajes y Gramáticas Regulares, Autómatas Finitos */
(function () {
  var S = window.SSL.specs;
  S.af1 = { title: "AF que acepta aⁿbᵐ", type: "afd", w: 330, h: 140, q0: "1", F: ["2"], states: [{ id: "1", x: 90, y: 85 }, { id: "2", x: 240, y: 85 }], delta: { "1": { a: "1", b: "2" }, "2": { b: "2" } } };
  S.mef1 = { title: "MEF1 Mealy · paridad de unos", type: "mealy", w: 470, h: 170, q0: "q0", states: [{ id: "q0", x: 70, y: 110 }, { id: "q1", x: 235, y: 110 }, { id: "q2", x: 400, y: 110 }],
    delta: { q0: { "0": "q0", "1": "q1" }, q1: { "0": "q1", "1": "q2" }, q2: { "0": "q2", "1": "q1" } }, out: { q0: { "0": "n", "1": "i" }, q1: { "0": "i", "1": "p" }, q2: { "0": "p", "1": "i" } } };
  S.mef2 = { title: "MEF2 Moore · complemento A2 (número invertido)", type: "moore", w: 470, h: 170, q0: "q0", states: [{ id: "q0", x: 70, y: 110 }, { id: "q1", x: 235, y: 110 }, { id: "q2", x: 400, y: 110 }],
    delta: { q0: { "0": "q0", "1": "q1" }, q1: { "0": "q1", "1": "q2" }, q2: { "0": "q1", "1": "q2" } }, out: { q0: "0", q1: "1", q2: "0" } };
  S.mef3 = { title: "MEF3 Moore · aceptor de (b*.a)*.b.b*", type: "moore", w: 340, h: 160, q0: "q0", states: [{ id: "q0", x: 90, y: 100 }, { id: "q1", x: 250, y: 100 }],
    delta: { q0: { a: "q0", b: "q1" }, q1: { a: "q0", b: "q1" } }, out: { q0: "R", q1: "A" } };
  S.afnd2 = { title: "AFND2 · a.(a+b)*.b", type: "afnd", w: 400, h: 150, q0: "0", F: ["2"], states: [{ id: "0", x: 60, y: 95 }, { id: "1", x: 200, y: 95 }, { id: "2", x: 340, y: 95 }], delta: { "0": { a: ["1"] }, "1": { a: ["1"], b: ["1", "2"] } } };
  S.a4 = { title: "AF-λ del TP2 (ejercicio 2.10, A4)", type: "afnd", w: 330, h: 270, q0: "G", F: ["M"], loops: { G: "up", H: "up", M: "down" }, states: [{ id: "G", x: 70, y: 80 }, { id: "H", x: 250, y: 80 }, { id: "I", x: 70, y: 210 }, { id: "M", x: 250, y: 210 }],
    delta: { G: { a: ["H"], b: ["G"], "λ": ["I"] }, H: { b: ["H"], "λ": ["M"] }, I: { b: ["M"] }, M: { a: ["M"], b: ["H"] } } };
  S.minq12 = { title: "AFD mínimo del ítem 12 del Tema C", type: "afd", w: 560, h: 290, q0: "A", F: ["CK", "G"], loops: { BH: "up" }, states: [{ id: "A", x: 70, y: 145 }, { id: "BH", x: 200, y: 70 }, { id: "CK", x: 350, y: 70 }, { id: "G", x: 200, y: 220 }, { id: "EL", x: 350, y: 220 }, { id: "FM", x: 485, y: 145 }],
    delta: { A: { x: "BH", y: "G" }, BH: { x: "CK", y: "BH" }, CK: { x: "BH", y: "EL" }, G: { x: "EL", y: "FM" }, EL: { x: "FM", y: "G" }, FM: { x: "EL", y: "A" } }, r: 22 };
  S.q13 = { title: "AFD del ítem 13 (mínimo)", type: "afd", w: 440, h: 230, q0: "P", F: ["P", "Y"], loops: { Y: "up", R: "down", X: "down" }, states: [{ id: "P", x: 70, y: 120 }, { id: "Y", x: 230, y: 60 }, { id: "R", x: 380, y: 120 }, { id: "X", x: 230, y: 185, label: "∅" }],
    delta: { P: { a: "Y", b: "X", c: "X" }, Y: { a: "P", b: "Y", c: "R" }, R: { a: "P", b: "X", c: "R" }, X: { a: "X", b: "X", c: "X" } }, bends: { "R>P": 0 } };

  function figGR(edges, states, cap) {
    return { fa: { type: "afd", w: 380, h: 230, states: states, edges: edges, loops: { A: "down", B: "up" } }, cap: cap };
  }
  var grBefore = figGR([{ f: "S", t: "A", l: "a" }, { f: "S", t: "B", l: "b" }, { f: "A", t: "A", l: "b" }, { f: "A", t: "λ", l: "b" }, { f: "B", t: "B", l: "a" }, { f: "B", t: "A", l: "a" }],
    [{ id: "S", x: 60, y: 110 }, { id: "A", x: 190, y: 160 }, { id: "B", x: 190, y: 60 }, { id: "λ", x: 320, y: 160 }], "Paso 2: un arco N1 → N2 con rótulo t por cada regla N1 → N2t; un arco hacia λ por cada N → t.");
  var grAfter = figGR([{ f: "A", t: "λ", l: "a" }, { f: "B", t: "λ", l: "b" }, { f: "A", t: "A", l: "b" }, { f: "S", t: "A", l: "b" }, { f: "B", t: "B", l: "a" }, { f: "A", t: "B", l: "a" }],
    [{ id: "λ", x: 60, y: 110 }, { id: "A", x: 190, y: 160 }, { id: "B", x: 190, y: 60 }, { id: "S", x: 320, y: 160 }], "Paso 3: se intercambian los nodos S y λ y se invierten todos los arcos. Leyendo los arcos: S → bA · A → bA | aB | a · B → aB | b.");

  window.SSL.units.push({
    id: "u2", n: 2, parcial: 1, short: "Regulares y AF", title: "Lenguajes regulares y autómatas finitos",
    summary: "Gramáticas regulares y FNC3, expresiones regulares, máquinas de estados finitos (Mealy y Moore), autómatas finitos deterministas y no deterministas, minimización, operaciones y propiedades de los lenguajes regulares.",
    sections: [
      { id: "gr", title: "Gramáticas regulares y FNC3", blocks: [
        { ul: ["Corresponden al <b>Tipo 3</b> de la jerarquía de Chomsky.", "Sus reglas pueden tener formato regular por la derecha N1 → wN2 o por la izquierda N1 → N2w, <b>pero no ambos</b>. También N → w, con w ∈ ΣT*.", "Generan solo lenguajes regulares y describen el <b>nivel lexicográfico</b>.", "Su modelo aceptor es el <b>Autómata Finito</b>."] },
        { def: "Forma Normal de Chomsky de tipo 3 (FNC3)", txt: "Reg. derecha N1 → tN2 · Reg. derecha o izquierda N1 → t · Reg. izquierda N1 → N2t, donde Ni ∈ ΣN y t ∈ ΣT. Como excepción puede tener S → λ, en cuyo caso S no debe aparecer en la parte derecha." },
        { note: "Las partes derechas en FNC3 tienen longitud 1 o 2 (0 solo para S → λ). En el Tema C fue V/F." },
        { ex: "Método para obtener la FNC3", b: [{ ol: [
          "<b>Eliminar reglas innecesarias:</b> no terminales inútiles (que no son alcanzables desde S o que no derivan en una palabra) y reglas N → N.",
          "<b>Eliminar el axioma de la derecha</b> si λ ∈ L(GR): nuevo axioma S1 y reglas S1 → S | λ.",
          "<b>Eliminar reglas de redenominación</b> N1 → N2: se reemplazan por las partes derechas de N2.",
          "<b>Eliminar reglas de borrado</b> N → λ: se reemplaza N por λ donde figure (salvo S → λ del axioma).",
          "<b>Reducir la longitud:</b> N1 → t1t2…tkW se parte con no terminales nuevos: N1 → t1M1, M1 → t2M2, …"] }] },
        { ex: "Conversión de GR por izquierda a GR por derecha (algoritmo del grafo)", b: [
          { ol: ["Si el axioma figura a la derecha, agregar un no terminal L que lo reemplace a la derecha y que tenga las mismas reglas que S.", "Grafo: un nodo por no terminal y otro para λ. Cada N1 → N2t es un arco de N1 a N2 con rótulo t; cada N → t, un arco de N a λ; S → λ, un arco sin rótulo de S a λ.", "Intercambiar las etiquetas de S y λ e invertir el sentido de todos los arcos.", "Leer las reglas: arco de N1 a N2 con t da N1 → tN2; arco de N a λ da N → t."] },
          { p: "Caso 1 de clase: S → Aa | Bb · A → Ab | b · B → Ba | Aa (S no está a la derecha)." },
          grBefore, grAfter
        ] }
      ] },
      { id: "lr-er", title: "Lenguajes y expresiones regulares", blocks: [
        { def: "Lenguaje regular", txt: "Es el lenguaje generado por una GR y se define con las cláusulas: 1) todo lenguaje finito es un LR; 2) si L1 y L2 son LR entonces L1 ∪ L2 y L1.L2 también lo son; 3) si L es LR entonces L* también lo es; 4) todo LR se puede definir mediante las cláusulas 1, 2 y 3." },
        { def: "Expresión regular", txt: "Forma algebraica que se define sobre un alfabeto base Σ y un alfabeto especial Σ' = {+, *, •, Φ, λ, (, )}, disjuntos: 1) Φ, λ y x ∈ Σ son ER; 2) si E1 y E2 son ER, E1+E2 y E1.E2 también; 3) si E es ER, E* y (E) también; 4) toda ER se define con 1, 2 y 3. Prioridad de operadores: <b>* , • , +</b> en ese orden; los paréntesis la alteran." },
        { table: { mono: true, h: ["ER", "LR"], r: [["Φ", "{ }"], ["λ", "{λ}"], ["x", "{x}"], ["R1 + R2", "L1 ∪ L2"], ["R1 . R2", "L1 . L2"], ["R*", "L*"]] } },
        { f: "1) Φ* = λ\n2) E.E* = E*.E\n3) E* = λ + E.E*\n4) (E1*.E2*)* = (E1 + E2)* = (E1*.E2)*.E1*\n5) E* = (λ + E + E² + … + E^(N−1)) . (E^N)*" },
        { p: "Aplicaciones: patrones de búsqueda (comodines de Word, grep, findstr, AWK), criterios en SQL, testing (diagramas de flujo y de estados), y el léxico de un lenguaje: <code>Identificador = (Letra + _).(Letra + _ + Dígitos + 0)*</code>." },
        { ex: "De GR a ER · ecuaciones características y lema de Arden", b: [
          { ol: ["Agrupar las reglas con igual parte izquierda.", "Igualar cada no terminal X a la unión (+) de sus partes derechas.", "Reemplazar la yuxtaposición por concatenación (•).", "Resolver por sustitución con <b>X = R + T.X ⇒ X = T*.R</b> (GR derecha) o <b>X = R + X.T ⇒ X = R.T*</b> (GR izquierda).", "La ER del lenguaje es la solución del axioma."] },
          { f: "S → aA | bB | cC      S = a.A + b.B + c.C\nA → bA | aB           A = b.A + a.B   ⇒ A = b*.a.c*.a\nB → cB | a            B = c.B + a     ⇒ B = c*.a\nC → cC | c            C = c.C + c     ⇒ C = c*.c\n\nS = a.b*.a.c*.a + b.c*.a + c.c*.c" }
        ] }
      ] },
      { id: "mef", title: "Máquinas de estados finitos", blocks: [
        { p: "La MEF o máquina secuencial es un caso particular de MT: obtiene una secuencia de salida <b>de igual longitud</b> y en correspondencia con la de entrada, que depende también del estado. Modela sistemas de control." },
        { def: "Definición formal", txt: "MEF = ⟨Q, ΣE, ΣS, f, g⟩. Q: conjunto finito y no vacío de estados; ΣE: alfabeto de entrada; ΣS: alfabeto de salida; f: Q × ΣE ⇒ Q función de transición; g: función de salida, para MEALY g: Q × ΣE ⇒ ΣS y para MOORE g: Q ⇒ ΣS." },
        { p: "Funcionamiento: 1) LEE un símbolo y mueve el cabezal a la derecha; 2) según estado actual y símbolo transiciona a un nuevo estado; 3) ESCRIBE un símbolo en la cinta de salida; 4) repite hasta leer toda la palabra. En general puede arrancar en cualquier estado." },
        { def: "Mealy vs Moore", tag: "Textual en los V/F", txt: "En el modelo de <b>Mealy</b> la salida se realiza instantáneamente: apenas se lee un símbolo y según el estado actual, se escribe en la cinta de salida; por eso primero se obtiene la salida y luego el estado nuevo. En el modelo de <b>Moore</b> la salida sufre un retardo, ya que se debe realizar primero la transición a otro estado, según el símbolo leído y el estado actual, para recién escribir un símbolo en la cinta de salida, que depende solo del estado nuevo; por eso primero se obtiene el estado nuevo y luego la salida." },
        { fa: S.mef1, cap: "MEF1 Mealy: escribe n si solo hubo 0, p si la cantidad de 1 es par, i si es impar. Rótulo entrada/salida." },
        { fa: S.mef3, cap: "MEF3 Moore: el estado lleva la salida (q/s). Acepta si la última salida es A." },
        { def: "Configuración de una MEF", tag: "Concepto", txt: "Terna estado actual, secuencia que falta leer y secuencia escrita, representada como s1…si−1 qk ei…en. Una sucesión de configuraciones es la secuencia de configuración. Ejemplo MEF1 con 011: q0011 ├─ nq011 ├─ niq11 ├─ nipq2." },
        { ex: "Conversiones entre modelos", b: [
          { p: "<b>Moore → Mealy:</b> mismos estados; por cada f(q,e) = p con g(p) = s se define g'(q,e) = s." },
          { p: "<b>Mealy → Moore:</b> por cada f(q,e) = p con g(q,e) = s se crea un estado pₛ con g'(pₛ) = s, y f'(pₓ, e) = pₛ para cada copia pₓ. Si a un estado no llegan transiciones se crea q_λ." }
        ] },
        { sim: "mef1" }
      ] },
      { id: "af", title: "Autómatas finitos deterministas", blocks: [
        { p: "El AF es una MEF tipo Moore especial (salidas implícitas: estados de aceptación y de rechazo) y un caso particular de MT." },
        { def: "Definición formal de un Autómata Finito", txt: "AF = ⟨Q, Σ, q0, F, f⟩. Q: conjunto finito y no vacío de estados; Σ: alfabeto de entrada; q0: estado inicial (∈ Q); F: conjunto de estados finales (⊆ Q); f: Q × Σ ⇒ Q función de transición. El criterio de aceptación es la doble condición de llegar a la lectura del último símbolo y transicionar a un estado final. Si no hay transición definida, el AF se <b>bloquea</b> y rechaza." },
        { fa: S.af1, cap: "L(AF) = { aⁿ bᵐ / n ≥ 0, m ≥ 1 }. Probalo en el simulador de abajo." },
        { sim: "af1" },
        { table: { h: ["Concepto", "Definición"], r: [
          ["Conexo", "Todos sus estados son accesibles desde el estado inicial. Se hace conexo eliminando los inaccesibles (equivalen a no terminales inútiles)."],
          ["Completo", "Todos sus estados tienen transiciones con cada símbolo de entrada. Se completa mandando lo faltante a un sumidero (existente o nuevo)."],
          ["Estado sumidero", "No es final y transiciona con todos los símbolos a sí mismo. Es de rechazo."],
          ["Estado generador", "Solo salen transiciones desde él. Solo es útil cuando es el inicial."],
          ["Determinista", "Para un estímulo (estado, símbolo) hay una sola reacción. Los AF son deterministas por naturaleza: todo AFND tiene un AFD equivalente."]] } },
        { def: "Lenguaje aceptado por un AFD", txt: "Con la función extendida f': Q × Σ* ⇒ Q (f'(q, λ) = q): L(AFD) = { w / w ∈ Σ* y f'(q0, w) ∈ F }." }
      ] },
      { id: "min", title: "Equivalencia y minimización", blocks: [
        { def: "Estados equivalentes", txt: "q1 ≡ q2 si y solo si ∀ w ∈ Σ*, f'(q1, w) ∈ F ⇔ f'(q2, w) ∈ F: tienen el mismo comportamiento para todas las secuencias. Son N-equivalentes si eso vale para |w| ≤ N." },
        { p: "Con K estados, dos estados son equivalentes si son N-equivalentes para N = K − 2. Las <b>clases de equivalencia</b> son los subconjuntos de estados equivalentes; el <b>conjunto cociente</b> es el conjunto de todas las clases; la <b>partición N</b> son las clases de N-equivalencia." },
        { ex: "Algoritmo de minimización", b: [{ ol: ["Hacer el AFD completo y conexo.", "P0 = { F, ~F }.", "Pi+1: dentro de cada clase, separar los estados que con algún símbolo van a clases distintas de Pi.", "Repetir hasta que Pi+1 = Pi: ese es el conjunto cociente.", "Las clases son los estados del AFD mínimo; es inicial la que contiene a q0 y finales las que contienen finales."] }] },
        { ex: "Ítem 12 del Tema C 2026, resuelto", b: [
          { table: { mono: true, h: ["", "x", "y"], r: [["→A", "H", "G"], ["B", "K", "H"], ["*C", "B", "E"], ["D", "G", "J"], ["E", "M", "G"], ["F", "E", "A"], ["*G", "L", "F"], ["H", "C", "B"], ["I", "A", "K"], ["*J", "D", "C"], ["*K", "H", "L"], ["L", "F", "G"], ["M", "L", "A"]] } },
          { ol: ["Conexo: desde A no se llega a D, I ni J. Se eliminan.", "P0 = { [C, G, K], [A, B, E, F, H, L, M] }", "P1 = { [C, G, K], [A, E, L], [B, H], [F, M] }", "P2 = { [G], [C, K], [A], [E, L], [B, H], [F, M] }", "P3 = P2 → 6 estados."] },
          { fa: S.minq12, cap: "AFD mínimo. Estados nombrados por su clase." }
        ] },
        { def: "Isomorfismo", txt: "A1 y A2 con |Q1| = |Q2| son isomorfos si existe una biyección ß: Q1 → Q2 con ß(q10) = q20, q ∈ F1 ⇔ ß(q) ∈ F2 y ß(f1(q, a)) = f2(ß(q), a). Dos AFD isomorfos son equivalentes. Para verificar equivalencia se minimizan ambos y se comparan." }
      ] },
      { id: "afnd", title: "Autómatas finitos no deterministas", blocks: [
        { p: "Son AF cuya función de transición tiene como rango la potencia del conjunto de estados, <b>2^Q</b>. Según el dominio hay tres modelos:" },
        { table: { h: ["Modelo", "Dominio", "Rango", "Estado inicial"], r: [["AFND", "Q × Σ", "2^Q", "Puede ser más de uno"], ["AF-λ", "Q × (Σ ∪ {λ})", "2^Q", "Único"], ["AF-Lazy", "Q × Σ*", "2^Q", "Único"]] } },
        { note: "Esta tabla se tomó en el Tema C 2026 (completar AFND, AF-λ o AF-Lazy según dominio, rango y estado inicial)." },
        { fa: S.afnd2, cap: "AFND2: desde 1 con b puede quedarse en 1 o ir a 2." },
        { sim: "afnd2" },
        { ex: "Asociación entre AF y GR (con un solo estado inicial)", b: [{ f: "AF ⇒ GR:  ΣN = Q   ΣT = Σ   S = q0\n          f(q, w) = p  ⇒  q → wp\n          q ∈ F        ⇒  q → λ\nGR ⇒ AF:  Q = ΣN ∪ {E}   q0 = S   F = {E}\n          N1 → wN2  ⇒  f(N1, w) = N2\n          N1 → w    ⇒  f(N1, w) = E" }, { p: "Si w tiene más de un símbolo o es λ, el AF resultante es un AF-Lazy o un AF-λ." }] },
        { p: "Los AF son cerrados para <b>unión, concatenación, estrella de Kleene, estrella positiva, inversa, complemento e intersección</b>. Unión y concatenación se arman con transiciones λ; el complemento sobre un AFD completo invierte finales y no finales; la intersección usa estados par (p, q)." }
      ] },
      { id: "thompson", title: "De ER a AF-λ y de AF-λ a AFD", blocks: [
        { def: "Construcciones de Thompson", txt: "Plantillas de AF-λ para ER sencillas (x, λ, Φ, x.y, x+y, x*). Método: 1) construir el AF-λ de cada símbolo; 2) operar los AF-λ según la ER; 3) se recomienda unificar los estados finales en cada paso." },
        { fa: { type: "afnd", w: 470, h: 170, q0: "0", F: ["5"], states: [{ id: "0", x: 50, y: 85 }, { id: "1", x: 150, y: 40 }, { id: "2", x: 290, y: 40 }, { id: "3", x: 150, y: 130 }, { id: "4", x: 290, y: 130 }, { id: "5", x: 400, y: 85 }], edges: [{ f: "0", t: "1", l: "λ" }, { f: "1", t: "2", l: "x" }, { f: "2", t: "5", l: "λ" }, { f: "0", t: "3", l: "λ" }, { f: "3", t: "4", l: "y" }, { f: "4", t: "5", l: "λ" }] }, cap: "Plantilla de x + y." },
        { fa: { type: "afnd", w: 470, h: 180, q0: "0", F: ["3"], states: [{ id: "0", x: 50, y: 70 }, { id: "1", x: 160, y: 70 }, { id: "2", x: 300, y: 70 }, { id: "3", x: 410, y: 70 }], edges: [{ f: "0", t: "1", l: "λ" }, { f: "1", t: "2", l: "x" }, { f: "2", t: "3", l: "λ" }, { f: "2", t: "1", l: "λ" }, { f: "0", t: "3", l: "λ" }], bends: { "0>3": -38, "2>1": 18, "1>2": 0 } }, cap: "Plantilla de x*: se puede saltear (0 → 3) o repetir (2 → 1)." },
        { def: "Derivada de una ER", txt: "Dx(E) = { w / x.w ∈ E }: de las palabras de E que empiezan con x, el resto sin ese prefijo. Las derivadas distintas son los no terminales de una GR equivalente: si Dx(E1) = E2 (≠ λ, ≠ Φ) se crea E1 → xE2; si λ ∈ Dx(E1), E1 → x; si λ ∈ E0, E0 → λ." },
        { def: "Clausura-λ(T)", tag: "Textual en los V/F", txt: "Es la clausura transitiva del subconjunto T con transiciones λ. Es decir, el subconjunto T más todos los estados a los que se puede llegar desde T con <b>una o más</b> transiciones λ." },
        { def: "Destino(T, x)", tag: "Textual en los V/F", txt: "Es el destino directo de T con la lectura de un símbolo x del alfabeto de entrada. Es decir, el subconjunto de todos los estados a los que tiene transiciones T con el símbolo x." },
        { ex: "Método de construcción de subconjuntos", b: [{ ol: ["El inicial del AFD es Clausura-λ del inicial del AF-λ.", "Para cada símbolo x: Destino del estado y luego su Clausura-λ. Ese subconjunto es el estado al que se transiciona con x.", "Repetir con cada estado nuevo.", "Termina cuando no aparece ningún estado nuevo.", "Son finales los subconjuntos que contienen al menos un final del AF-λ."] }] },
        { fa: S.a4, cap: "AF-λ: G con λ va a I; H con λ va a M." },
        { table: { mono: true, h: ["Estado AFD", "a", "b"], r: [["→ {G,I}", "{H,M}", "{G,I,M}"], ["* {H,M}", "{M}", "{H,M}"], ["* {G,I,M}", "{H,M}", "{G,H,I,M}"], ["* {M}", "{M}", "{H,M}"], ["* {G,H,I,M}", "{H,M}", "{G,H,I,M}"]] } },
        { p: "Al minimizar quedan dos clases: {G,I} inicial no final y todo el resto final. El lenguaje aceptado es Σ⁺ (todas las palabras no vacías)." },
        { sim: "a4" },
        { def: "Complejidad de los AF", txt: "En general el AFD es más rápido que el AF-λ, pero a la vez es más complejo en su estructura de estados, y viceversa. Por eso se opta por el AF-λ para el <b>diseño</b> y por el AFD para la <b>implementación</b>." },
        { table: { mono: true, h: ["Autómata", "Orden espacial", "Orden temporal"], r: [["AF-λ", "|r|", "|w| × |r|"], ["AFD", "2^|r|", "|w|"]] } },
        { note: "Ítem 9 del Tema C: \"un AFD ocupa menos memoria\" es FALSO (es 2^|r|), y \"las transiciones del AFND son proporcionales a la longitud independientemente de los estados\" también es FALSO (es |w|·|r|)." }
      ] },
      { id: "props", title: "Propiedades de los lenguajes regulares", blocks: [
        { ul: ["Todo lenguaje finito es regular.", "Todo LR tiene un AF que lo acepta y una GR que lo genera.", "Son cerrados para unión, concatenación, estrellas, inversa, complemento e intersección.", "También pueden ser generados por gramáticas de mayor tipo (2, 1, 0), por la jerarquía.", "No todos son infinitos."] },
        { def: "Lema de bombeo (lenguajes regulares)", txt: "Si L es regular, aceptado por un AFD con n estados, y contiene una palabra de largo ≥ n, entonces L es infinito. Más aún: para toda w ∈ L con |w| ≥ n existen x, y, z con w = xyz, |y| &gt; 0, |xy| ≤ n y xyⁱz ∈ L para todo i ≥ 0." },
        { p: "Se justifica porque para aceptar w el AFD hace |w| transiciones: si |w| ≥ n pasa dos veces por algún estado, y ese circuito es la parte y que se puede bombear. Con él se prueba que { aᵏbᵏ } <b>no es regular</b>." }
      ] }
    ],
    tp: { n: 2, title: "Lenguajes regulares y autómatas finitos", clase: [
      { id: "1.13", txt: "<p>Obtener un AF-λ para (a.(a + b))*.a*.b y para a*.b.a* + (a.b*.b.a)*.</p>", sol: [{ p: "Aplicar Thompson de adentro hacia afuera: primero a+b, luego a.(a+b), su estrella, luego a*, la concatenación con b. Unificar finales en cada paso." }] },
      { id: "1.9", txt: "<p>Minimizar el AFD del enunciado y simular en JFLAP.</p>", sol: [{ p: "Mismo procedimiento que el ítem 12 del parcial: completo y conexo, P0 = {F, ~F} y refinar." }] }
    ], alumnos: [
      { id: "2.1", tag: "FNC3", txt: "<p>Obtener la GR en FNC3. Para c) pasar de regular izquierda a derecha.</p><p>c) S → Sab | Xb | λ · X → Xa | Z · Y → Sbb | Xaa · Z → Zaa | b<br>d) S → aS | aaS | X · W → abW | a · X → bbX | bcY | λ · Y → cY | aaZ | λ · Z → aaZ | bbZ</p>", sug: 1, sol: [
        { p: "<b>c)</b> Y es inaccesible: se elimina. S está a la derecha y S ⇒* λ: S1 → S | λ. Se eliminan S1 → S y X → Z, luego S → λ, y se reduce la longitud:" },
        { f: "S1 → Ab | Bb | Xb | λ        S → Ab | Bb | Xb\nA → Sa    B → a    X → Xa | Ca | b\nC → Za    Z → Da | b    D → Za" },
        { p: "Pasaje a derecha con el grafo (S1 no está a la derecha; se intercambian S1 y λ y se invierten arcos):" },
        { f: "S1 → aB | bX | bZ | λ     S → aA\nA → bS | b    B → bS | b    X → aX | bS | b\nZ → aC | aD   C → aX    D → aZ" },
        { p: "<b>d)</b> W es inaccesible y Z no termina nunca (inútil), así que cae Y → aaZ. Como S ⇒* λ y está a la derecha, S1 → S | λ; luego se eliminan unitarias, borrado y se reduce:" },
        { f: "S1 → aS | a | aA | aB | bC | bD | bE | bF | λ\nS  → aS | a | aA | aB | bC | bD | bE | bF\nA → aS   B → a   C → bX   D → b   E → cY   F → c\nX → bC | bD | bE | bF      Y → cY | c" },
        { note: "Las tres gramáticas se verificaron generando todas las palabras hasta longitud 8." }] },
      { id: "2.2", tag: "diseño de GR", txt: "<p>GR por derecha o izquierda para: a) empiezan con x y terminan con y; b) al menos dos x; c) cantidad impar de y; d) sin tres x consecutivas; e) { xⁿ yᵐ zᵖ / n par, m ≤ 2, p ≥ 1 }; f) { xⁿ yᵐ / n, m ≥ 1 }.</p>", sol: [{ f: "a) S → xA        A → xA | yA | y\nb) S → yS | xA   A → yA | xB   B → xB | yB | λ\nc) S → xS | yA   A → xA | yS | λ\nd) S → yS | xA | λ   A → yS | xB | λ   B → yS | λ\ne) S → xxS | zD | yA | yyA   A → zD   D → zD | λ\nf) S → xS | xA   A → yA | y" }] },
      { id: "2.3", tag: "ER", txt: "<p>ER sobre Σ = {x, y} para: 1) palabras que contienen tres y; 2) longitud par que comienzan con x; 3) sin y consecutivas.</p>", sol: [{ f: "1) x*.y.x*.y.x*.y.x*\n2) x.(x + y).((x + y).(x + y))*\n3) (x + y.x)*.(λ + y)" }] },
      { id: "2.4", tag: "ER a palabras", txt: "<p>Describir: a) (x + y.x + y.x.x)* b) (x.(x + y))* c) (y + x.y*.x)*.x.y*</p>", sol: [{ ul: ["a) λ y las secuencias donde toda y va seguida de al menos una x (sin y consecutivas y sin terminar en y).", "b) Secuencias de longitud par donde cada símbolo de posición impar es x.", "c) Secuencias con cantidad impar de x."] }] },
      { id: "2.5", tag: "GR a ER", txt: "<p>Obtener la ER de: a) S → yS | xD · C → xS | yD · D → xC | yE | λ · E → aE | bE<br>b) S → bX | ab · X → aaX | Y · Y → aZ | bX · Z → bY | a</p>", sug: 1, sol: [
        { f: "a) E es inútil (nunca termina): D = x.C + λ, C = x.S + y.D\n   D = x.x.S + x.y.D + λ  ⇒  D = (x.y)*.(x.x.S + λ)\n   S = (y + x.(x.y)*.x.x).S + x.(x.y)*\n   S = (y + x.(x.y)*.x.x)* . x.(x.y)*\n\nb) Z = b.Y + a  ⇒  Y = a.b.Y + a.a + b.X  ⇒  Y = (a.b)*.(a.a + b.X)\n   X = (a.a + (a.b)*.b).X + (a.b)*.a.a  ⇒  X = (a.a + (a.b)*.b)*.(a.b)*.a.a\n   S = b.(a.a + (a.b)*.b)*.(a.b)*.a.a + a.b" },
        { note: "Ambas ER se verificaron contra la gramática por fuerza bruta." }] },
      { id: "2.6", tag: "MEF", txt: "<p>Diseñar con Mealy o Moore y convertir al otro criterio: a) detecta las subcadenas xyx sobre {x, y}; b) módulo 5 de la suma parcial de dígitos decimales; c) módulo 3 de la suma parcial de dígitos binarios; d) expendedora de 3 productos ($50, $80, $90) con billetes de $10, $20, $50 y $100, rechaza si supera $100, botón por producto y otro para cancelar o pedir vuelto.</p>", sug: 1, sol: [
        { p: "<b>a) Mealy</b> (salida 1 al completar xyx; admite solapamiento):" },
        { table: { mono: true, h: ["", "x", "y"], r: [["→ q0 (nada)", "q1/0", "q0/0"], ["q1 (vi x)", "q1/0", "q2/0"], ["q2 (vi xy)", "q1/1", "q0/0"]] } },
        { p: "<b>a) Moore equivalente</b>: se desdobla q1 según la salida con que se llega." },
        { table: { mono: true, h: ["Q / s", "x", "y"], r: [["→ A = q0/0", "B", "A"], ["B = q1/0", "B", "C"], ["C = q2/0", "D", "A"], ["D = q1/1", "B", "C"]] } },
        { p: "<b>b) Moore</b>: estados s0 … s4 con salida i. f(sᵢ, d) = s₍ᵢ₊d₎ mod 5 para cada dígito d de 0 a 9. Mealy: un solo estado por resto y la salida en la transición: sᵢ --d / (i+d) mod 5--> s₍ᵢ₊d₎ mod 5." },
        { p: "<b>c) Moore</b>: q0/0, q1/1, q2/2; con 0 se queda, con 1 avanza: q0 → q1 → q2 → q0." },
        { p: "<b>d)</b> Estados = crédito acumulado (C0, C10, …, C100). Entradas: B10, B20, B50, B100, P1, P2, P3, V. Con un billete se suma si no supera 100; si supera, la salida es <i>rechaza billete</i> y se queda. Con Pk, si el crédito alcanza el precio se entrega el producto y se pasa a C(crédito − precio); si no alcanza, salida <i>crédito insuficiente</i>. V devuelve el crédito y vuelve a C0. Es natural en Mealy (la salida depende del botón y del crédito)." }] },
      { id: "2.7", tag: "AFD", txt: "<p>Q = {A,B,C,D,E}, Σ = {x,y,z}, q0 = A, F = {A, D}; f(A,x)=B, f(A,y)=C, f(B,x)=B, f(B,z)=D, f(C,y)=E, f(D,x)=D, f(D,y)=B, f(E,x)=C, f(E,z)=B. Identificar generadores y sumideros, completo y conexo; cinco palabras aceptadas y tres rechazadas.</p>", sol: [
        { fa: { type: "afd", w: 470, h: 250, q0: "A", F: ["A", "D"], loops: { B: "up", D: "up" }, states: [{ id: "A", x: 60, y: 125 }, { id: "B", x: 220, y: 60 }, { id: "D", x: 400, y: 60 }, { id: "C", x: 220, y: 200 }, { id: "E", x: 400, y: 200 }], delta: { A: { x: "B", y: "C" }, B: { x: "B", z: "D" }, C: { y: "E" }, D: { x: "D", y: "B" }, E: { x: "C", z: "B" } } } },
        { ul: ["Conexo: sí, desde A se llega a todos.", "Completo: no. Falta, por ejemplo, f(A,z), f(B,y), f(C,x)… Se agrega un sumidero Z al que van todas las faltantes.", "Generador: A (no le llegan transiciones). Sumidero: no hay hasta agregar Z.", "Aceptadas: λ, xz, xxz, xzx, xzyz, yyzz.", "Rechazadas: x, yy, xzy."] }] },
      { id: "2.8", tag: "minimización", txt: "<p>Minimizar los cuatro AFD del enunciado (a y b sobre {x,y}, c sobre {p,q}, d sobre {0,1}).</p>", sug: 1, sol: [
        { note: "Las tablas se reconstruyeron del PDF; verificá que coincidan con tu copia." },
        { table: { mono: true, h: ["", "Particiones", "AFD mínimo"], r: [
          ["a", "P0 [I,G,C,E,H][A,D,F,B] · P1 [I,C,E,H][G][A,D,F,B] · P2 [I,C][E,H][G][A,F][D,B]", "5 estados: →[AF] · *[IC] · *[EH] · *[G] · [DB]"],
          ["b", "Accesibles B,J,D,C,A,G,I · P0 [B,D,G][J,C,A,I] · P1 [B][D,G][J,A][C,I] · P2 [B][D,G][J][A][C,I]", "5 estados: →*[B] · *[DG] · [J] · [A] · [CI]"],
          ["c", "Accesibles I,B,A,D,H,C,F · P0 [A,H,C][I,B,D,F] · P1 [A,H,C][I,B][D][F] · P2 [A,H,C][I][B][D][F]", "5 estados: →[I] · *[AHC] · [B] · [D] · [F]"],
          ["d", "P0 [J,F,D,B,G,E][A,C,I,H] · P1 [J,B,E][F,D,G][A,I][C,H] · P2 [J,E][B][F][D,G][A,I][C,H]", "6 estados: →[AI] · *[JE] · *[B] · *[F] · *[DG] · [CH]"]] } }] },
      { id: "2.9", tag: "isomorfismo", txt: "<p>Para cada par de AFD, minimizar y comprobar equivalencia por isomorfismo.</p>", sug: 1, sol: [
        { p: "<b>a)</b> Izquierdo: [AB]* (x→GE, y→AB), →[C] (x→GE, y→AB), [GE] (x→DHI, y→AB), [DHI] (x→DHI, y→C). Derecho: *M (x→L, y→M), →K (x→L, y→M), L (x→P, y→M), P (x→P, y→K). Con ß: C↦K, AB↦M, GE↦L, DHI↦P se cumplen las tres condiciones: <b>son equivalentes</b>." },
        { p: "<b>b)</b> Izquierdo: *[C], →[A], [DF], [BE] (sumidero). Derecho: *[LJ], →[G], [H], [I], sin sumidero. No hay biyección que respete las transiciones: <b>no son equivalentes</b> (10111 es aceptada por el derecho y rechazada por el izquierdo)." }] },
      { id: "2.10", tag: "modelos de AF", txt: "<p>Indicar si son deterministas; si no, qué modelo son, sus componentes y palabras aceptadas y rechazadas. A1 sobre {a,b}; A2 con columnas x, y, xy, yy, xxx; A4 con columnas a, b, λ.</p>", sug: 1, sol: [
        { ul: ["<b>A1</b>: cada celda tiene a lo sumo un estado y hay un solo inicial: es un <b>AFD incompleto</b> (las llaves son solo notación).", "<b>A2</b>: tiene transiciones con secuencias (xy, yy, xxx): es un <b>AF-Lazy</b>, dominio Q × Σ*.", "<b>A4</b>: tiene columna λ: es un <b>AF-λ</b>. Su AFD equivalente acepta Σ⁺ (ver sección 2.6)."] }] },
      { id: "2.12", tag: "GR a AF", txt: "<p>Obtener un AF para: a) S → aX | bW | a · W → aY | bS | a · X → aZ | bS · Y → aX | bY | a | b · Z → aZ | bZ<br>b) S → abX | bbY | aaW | λ · T → baS | abY · V → aS | bbX | baY · X → abT | bbbS | aaZ · Y → T | aaX | λ · Z → abZ | bbZ</p>", sol: [
        { p: "<b>a)</b> Z es inútil (no termina): se quita X → aZ. Q = {S, W, X, Y, E}, F = {E}. Es un <b>AFND</b> porque f(S, a) = {X, E}, f(W, a) = {Y, E}, f(Y, a) = {X, E}, f(Y, b) = {Y, E}." },
        { p: "<b>b)</b> W no tiene reglas y Z no termina: se eliminan. V es inaccesible. Transiciones con secuencias (ab, bb, bbb, ba, aa) y con λ (Y → T y S → λ, Y → λ hacia E): es un <b>AF-Lazy</b>." }] },
      { id: "2.13", tag: "operaciones con AF", noDef: 0, txt: "<p>Resolver A3* ∪ A1, (A2.A1)⁺ y (~A1).A3, indicando si el resultado es determinista.</p>", sol: [{ p: "Unión y concatenación con transiciones λ desde un inicial nuevo y desde los finales: el resultado es un <b>AF-λ</b>. Para el complemento, primero completar A1 y luego invertir finales." }] },
      { id: "2.14", tag: "Thompson", txt: "<p>Obtener un AF-λ para: a.(b + a.b)*.a + (a.a + b.b)*.(b.b + a) + a · (a.b*.(a + b) + a*.b.b)* · (a.a)*.b.a*.(b.a)* + (a.a.b*.a + b*.a.a.b)*</p>", sol: [{ p: "Construir de adentro hacia afuera con las plantillas de Thompson: cada símbolo, luego concatenaciones (λ entre bloques), uniones (inicial y final nuevos con λ) y estrellas (salteo y retorno con λ). Verificar en JFLAP con un par de palabras de cada rama de la unión." }] },
      { id: "2.15", tag: "AFND a AFD", txt: "<p>Obtener el AFD mínimo del AFND A1: →A: a{B,D} b{A} · B: a{D} b{C} · *C: a{B} b{C,D} · D: a{D} b{B}.</p>", sol: [
        { table: { mono: true, h: ["Subconjunto", "a", "b"], r: [["→ {A}", "{B,D}", "{A}"], ["{B,D}", "{D}", "{B,C}"], ["{D}", "{D}", "{B}"], ["* {B,C}", "{B,D}", "{C,D}"], ["{B}", "{D}", "{C}"], ["* {C,D}", "{B,D}", "{B,C,D}"], ["* {C}", "{B}", "{C,D}"], ["* {B,C,D}", "{B,D}", "{B,C,D}"]] } },
        { p: "Minimizando: P0 = {finales}{A, BD, D, B} → P1 separa [A,D] de [BD,B] → P2 separa A de D. Quedan 4 estados: →[A] (a→[BD,B], b→[A]), [D] (a→[D], b→[BD,B]), [BD,B] (a→[D], b→F), F = todos los finales (a→[BD,B], b→F)." }] }
    ] },
    control: [
      { t: "vf", kind: "teoría", q: "El conjunto de lenguajes generados por GR por izquierda es distinto que el obtenido a partir de GR por derecha.", a: false, why: "Ambos formatos son equivalentes: generan los mismos lenguajes regulares." },
      { t: "vf", kind: "teoría", q: "Una GR puede tener reglas regulares por derecha o reglas regulares por izquierda, pero no ambas.", a: true },
      { t: "vf", kind: "teoría", q: "En el modelo de Moore la salida se realiza instantáneamente: primero se obtiene la salida y luego el estado nuevo.", a: false, why: "Eso describe a Mealy. En Moore la salida sufre un retardo: primero el estado nuevo y luego la salida." },
      { t: "vf", kind: "teoría", q: "Clausura-λ(T) es el subconjunto T más todos los estados a los que se puede llegar desde T con una sola transición λ.", a: false, why: "Es con una o más transiciones λ (clausura transitiva)." },
      { t: "vf", kind: "teoría", q: "Un estado sumidero es aquel del que solo salen transiciones.", a: false, why: "Ese es el generador. El sumidero no es final y transiciona con todos los símbolos a sí mismo." },
      { t: "vf", kind: "teoría", q: "En general el AFD es más rápido que el AF-λ, pero es más complejo en su estructura de estados; por eso se usa el AF-λ para el diseño y el AFD para la implementación.", a: true },
      { t: "vf", kind: "teoría", q: "En la ER, la prioridad de los operadores es + , • , * en ese orden.", a: false, why: "Es *, •, + (la estrella liga más fuerte)." },
      { t: "x", kind: "teoría", q: "Marcá con X las características de los lenguajes regulares.", o: ["Para representarlos alcanza con concatenación, unión y estrella de Kleene (más los lenguajes finitos)", "Solamente pueden ser generados por gramáticas regulares", "Pueden ser generados por gramáticas de tipo 2", "Cualquier lenguaje finito es regular", "Son todos infinitos", "Son cerrados respecto del complemento y la intersección"], a: [0, 2, 3, 5] },
      { t: "match", kind: "teoría", q: "Completá si se trata de AFND, AF-λ o AF-Lazy.", opts: ["AFND", "AF-λ", "AF-Lazy"], keep: 1, items: [["Dominio Q × Σ, rango 2^Q, puede tener más de un estado inicial", "AFND"], ["Dominio Q × (Σ ∪ {λ}), rango 2^Q, inicial único", "AF-λ"], ["Dominio Q × Σ*, rango 2^Q, inicial único", "AF-Lazy"]] },
      { t: "fill", kind: "teoría", q: "Completá la definición formal de la MEF: MEF = ⟨Q, ΣE, ΣS, f, g⟩.", blanks: [{ k: "f (transición):", a: ["Q × ΣE ⇒ Q", "QxΣE⇒Q", "Q × ΣE → Q", "Q x ΣE -> Q", "QxΣE->Q"] }, { k: "g en Mealy:", a: ["Q × ΣE ⇒ ΣS", "QxΣE⇒ΣS", "Q x ΣE -> ΣS", "QxΣE->ΣS", "Q × ΣE → ΣS"] }, { k: "g en Moore:", a: ["Q ⇒ ΣS", "Q⇒ΣS", "Q -> ΣS", "Q->ΣS", "Q → ΣS"] }] },
      { t: "fill", kind: "teoría", q: "Lema de Arden: completá la solución de la ecuación característica.", blanks: [{ k: "GR derecha: X = R + T.X ⇒ X =", a: ["T*.R", "T*R", "T* . R"] }, { k: "GR izquierda: X = R + X.T ⇒ X =", a: ["R.T*", "RT*", "R . T*"] }] },
      { t: "mc", kind: "práctica", q: "Tras minimizar el AFD del ítem 12 del Tema C, ¿cuántos estados tiene?", o: ["6", "5", "7", "10"], a: 0, why: "Se eliminan D, I, J (inaccesibles) y quedan las clases [A], [B,H], [C,K], [G], [E,L], [F,M]." },
      { t: "mc", kind: "práctica", q: "¿Qué ER corresponde a S → aS | bA · A → bA | λ?", o: ["a*.b.b*", "(a + b)*", "a*.b*", "a.b*"], a: 0, why: "A = b.A + λ ⇒ A = b*. S = a.S + b.b* ⇒ S = a*.b.b*." },
      { t: "mc", kind: "práctica", q: "En la MEF1 (Mealy, paridad de unos), ¿qué salida produce la entrada 0110?", o: ["nipp", "nipi", "niip", "nppp"], a: 0, why: "q0 –0/n→ q0 –1/i→ q1 –1/p→ q2 –0/p→ q2." },
      { t: "mc", kind: "práctica", q: "¿Qué describe la ER (y + x.y*.x)*.x.y*?", o: ["Cantidad impar de x", "Cantidad par de x", "Terminan en x", "Sin x consecutivas"], a: 0 },
      { t: "mc", kind: "práctica", q: "Aplicando GR ⇒ AF a S → aS | a, ¿qué modelo se obtiene?", o: ["AFND: f(S, a) = {S, E}", "AFD completo", "AF-λ", "AF-Lazy"], a: 0, why: "S → aS da f(S,a) = S y S → a da f(S,a) = E: dos reacciones para el mismo estímulo." },
      { t: "mc", kind: "práctica", q: "En la construcción de subconjuntos del AF-λ A4, ¿cuál es el estado inicial del AFD?", o: ["{G, I}", "{G}", "{G, H, I, M}", "{I, M}"], a: 0, why: "Es la Clausura-λ de G: G con λ llega a I." }
    ]
  });
})();
