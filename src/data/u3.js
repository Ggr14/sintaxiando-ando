/* Unidad 3 · Gramáticas Independientes del Contexto y Autómatas de Pila */
(function () {
  var S = window.SSL.specs;
  S.ap1 = { title: "AP1 · aⁿbⁿ, n ≥ 0, por estado final", type: "ap", w: 500, h: 200, q0: "q0", z0: "#", F: ["q2"], loops: { q0: "up", q1: "up" },
    states: [{ id: "q0", x: 70, y: 120 }, { id: "q1", x: 250, y: 120 }, { id: "q2", x: 430, y: 120 }],
    trans: [["q0", "a", "#", "q0", "A#"], ["q0", "a", "A", "q0", "AA"], ["q0", "b", "A", "q1", "λ"], ["q1", "b", "A", "q1", "λ"], ["q1", "∆", "#", "q2", "λ"], ["q0", "∆", "#", "q2", "λ"]],
    bends: { "q0>q2": 34 } };
  S.ap9 = { title: "AP9 · aⁿb²ⁿ, n ≥ 0", type: "ap", w: 500, h: 200, q0: "q0", z0: "#", F: ["q2"], loops: { q0: "up", q1: "up" },
    states: [{ id: "q0", x: 70, y: 120 }, { id: "q1", x: 250, y: 120 }, { id: "q2", x: 430, y: 120 }],
    trans: [["q0", "a", "#", "q0", "AA#"], ["q0", "a", "A", "q0", "AAA"], ["q0", "b", "A", "q1", "λ"], ["q1", "b", "A", "q1", "λ"], ["q1", "∆", "#", "q2", "λ"], ["q0", "∆", "#", "q2", "λ"]],
    bends: { "q0>q2": 34 } };
  S.ap8 = { title: "AP8 · aⁿbᵐ, n > m", type: "ap", w: 500, h: 200, q0: "q0", z0: "#", F: ["q2"], loops: { q0: "up", q1: "up" },
    states: [{ id: "q0", x: 70, y: 120 }, { id: "q1", x: 250, y: 120 }, { id: "q2", x: 430, y: 120 }],
    trans: [["q0", "a", "#", "q0", "A#"], ["q0", "a", "A", "q0", "AA"], ["q0", "b", "A", "q1", "λ"], ["q1", "b", "A", "q1", "λ"], ["q1", "∆", "A", "q2", "λ"], ["q0", "∆", "A", "q2", "λ"]],
    bends: { "q0>q2": 34 } };
  S.ap27 = { title: "AP27 · palíndromos, no determinista", type: "ap", w: 470, h: 210, q0: "q0", z0: "#", F: ["q2"], loops: { q0: "up", q1: "up" },
    states: [{ id: "q0", x: 70, y: 130 }, { id: "q1", x: 250, y: 130 }, { id: "q2", x: 410, y: 130 }],
    edges: [{ f: "q0", t: "q0", l: "(a,λ,A)\n(b,λ,B)" }, { f: "q0", t: "q1", l: "(a,λ,λ) (b,λ,λ)\n(λ,λ,λ)" }, { f: "q1", t: "q1", l: "(a,A,λ)\n(b,B,λ)" }, { f: "q1", t: "q2", l: "(∆,#,λ)" }] };
  S.tp3e = { title: "AP de { xⁿyᵐ / n > 0, m > n }", type: "ap", w: 600, h: 200, q0: "0", z0: "#", F: ["f"], loops: { "1": "up", "2": "up", "3": "up" },
    states: [{ id: "0", x: 50, y: 130 }, { id: "1", x: 170, y: 130 }, { id: "2", x: 300, y: 130 }, { id: "3", x: 430, y: 130 }, { id: "f", x: 550, y: 130 }],
    trans: [["0", "x", "#", "1", "X#"], ["1", "x", "X", "1", "XX"], ["1", "y", "X", "2", "λ"], ["2", "y", "X", "2", "λ"], ["2", "y", "#", "3", "#"], ["3", "y", "#", "3", "#"], ["3", "∆", "#", "f", "λ"]] };

  var rail = {
    ident: { name: "Identificador", d: { seq: [{ alt: [{ n: "Letra" }, { t: "_" }] }, { star: { alt: [{ n: "Letra" }, { n: "Dígito" }, { t: "_" }] } }] } },
    num: { name: "Número", d: { alt: [{ t: "0" }, { seq: [{ n: "Uno" }, { star: { n: "Dígito" } }] }] } },
    prog: { name: "Programa", d: { seq: [{ n: "Declara" }, { t: ";" }, { t: "{" }, { n: "Sentencia" }, { t: "}" }] } },
    decl: { name: "Declara", d: { seq: [{ n: "Tipo" }, { t: "id" }, { opt: { seq: [{ t: "[" }, { t: "entero" }, { t: "]" }] } }, { star: { seq: [{ t: ";" }, { n: "Tipo" }, { t: "id" }] } }] } },
    tipo: { name: "Tipo", d: { alt: [{ t: "int" }, { t: "float" }, { t: "boolean" }, { t: "char" }] } }
  };
  window.SSL.rails = rail;

  window.SSL.units.push({
    id: "u3", n: 3, parcial: 2, short: "GIC y AP", title: "Gramáticas independientes del contexto y autómatas de pila",
    summary: "GIC y su diseño, árboles de derivación y árbol total, ambigüedad, BNF y diagramas de sintaxis, simplificación, formas normales de Chomsky y Greibach, autómatas de pila y su relación con las GIC.",
    sections: [
      { id: "gic", title: "Gramáticas independientes del contexto", blocks: [
        { def: "GIC", txt: "GIC = ⟨ΣN, ΣT, P, S⟩ con reglas de la forma N → β, donde N ∈ ΣN y β ∈ (ΣN ∪ ΣT)*. Corresponden al Tipo 2 y describen el <b>nivel sintáctico</b>." },
        { table: { h: ["Formato estándar", "Reglas"], r: [["Forma Normal de Chomsky (FNC)", "N1 → N2N3 · N → t"], ["Forma Normal de Greibach (FNG)", "N → tW con t ∈ ΣT y W ∈ ΣN*"], ["En ambas", "S → λ solo si S no está a la derecha"]] } },
        { table: { h: ["GIC", "Reglas", "Lenguaje"], r: [
          ["GIC1", "S → aSb | λ", "{ aⁿbⁿ / n ≥ 0 }"], ["GIC2", "S → abAc · A → AdA | a", "{ ab.(ad)ⁿ.ac / n ≥ 0 } (es regular)"],
          ["GIC3", "S → AAa · A → AAa | b", "Expresiones en notación posfija (b = num, a = op)"], ["GIC6", "S → aAb | aBbb | λ · A → aAb | λ · B → aBbb | λ", "{ aⁿbᵐ / m = n ∨ m = 2n }"],
          ["GIC7", "S → xSz | yAz | yz | λ · A → yAz | yz", "{ xⁿ yᵐ zᵏ / k = m + n }"]] } }
      ] },
      { id: "diseno", title: "Diseño de GIC", blocks: [
        { ul: ["<b>Adaptación:</b> modificar una gramática conocida. { aⁿbᵐ / n &gt; m }: S → aS | aA · A → aAb | λ (a de más al inicio) o S → aSb | aA · A → aA | λ (al final).", "<b>Mezcla:</b> unir las reglas de dos gramáticas con el mismo axioma. { aⁿbᵐ / n ≤ m ≤ 2n }: S → aSbb | aSb | λ.", "<b>Operaciones:</b> unión, concatenación, estrella de Kleene, estrella positiva e inversa."] },
        { table: { h: ["Operación", "Nuevo axioma S3 y reglas agregadas"], r: [["Unión", "S3 → S1 | S2"], ["Concatenación", "S3 → S1S2"], ["Estrella de Kleene", "S3 → S1S3 | λ"], ["Estrella positiva", "S3 → S1S3 | S1"], ["Inversa", "Se invierten todas las partes derechas: N → β⁻¹"]] } },
        { note: "Para unión y concatenación los alfabetos de no terminales de G1 y G2 deben ser disjuntos." },
        { ex: "Asociación con lenguajes de programación", b: [{ ul: ["{ (ab.(ad)ⁿ.ac)ᵏ }: sentencias de asignación (a = id, b = '=', c = ';', d = operador aditivo).", "{ aⁿbⁿ / n ≥ 1 }: while anidados (a = 'while exp do', b = 'endwhile').", "{ aⁿb / n ≥ 1 }: if anidados (a = 'if exp then', b = 'prop')."] }] }
      ] },
      { id: "arboles", title: "Árboles de derivación y árbol total", blocks: [
        { def: "Árbol de derivación o de sintaxis", txt: "1) Cada nodo tiene una etiqueta. 2) La raíz tiene como etiqueta al axioma S. 3) Los nodos que no son hojas están en ΣN y las hojas en ΣT ∪ {λ}. 4) Si un nodo tiene etiqueta N y sus hijos (de izquierda a derecha) N1 … Nm, entonces N → N1 … Nm ∈ P. El recorrido en preorden corresponde a la derivación más a la izquierda; la concatenación de las hojas es el <b>producto</b> del árbol, la palabra derivada." },
        { trees: ["S( a b A( A(a) d A(a) ) c )", "S( x S( y A( y A( y z ) z ) z ) z )"], cap: "Árboles de abadac en GIC2 y de xyyyzzzz en GIC7." },
        { def: "Árbol total de un lenguaje", txt: "Representa todas las formas sentenciales y sentencias de una gramática de tipo 2 o 3. La raíz es S, los nodos internos tienen etiquetas en (ΣN ∪ ΣT)* − ΣT* y las hojas en L(G); cada hijo se obtiene aplicando <b>una sola regla</b>. Si es finito el lenguaje es finito, si es infinito el lenguaje es infinito y si no tiene hojas el lenguaje es Φ. Siguiendo un criterio fijo (más a la izquierda), una hoja repetida indica que la gramática es ambigua." },
        { tree: "S( aC( aaCB( aaaCBB(…) aabB(aabb) ) ab ) λ )", gx: 62, cap: "Primeros niveles del árbol total de S → aC | λ · C → aCB | b · B → b (aⁿbⁿ en FNG)." }
      ] },
      { id: "ambig", title: "Ambigüedad", blocks: [
        { def: "GIC ambigua", txt: "Cuando para ciertas palabras hay más de un árbol de derivación, o sea más de una derivación con un criterio fijo (más a la izquierda o más a la derecha), se dice que esas cadenas se generan con ambigüedad y que la GIC es ambigua." },
        { def: "Lenguaje inherentemente ambiguo", txt: "Cuando un lenguaje no puede ser generado sin ambigüedad por ninguna gramática de tipo i, se dice que es inherentemente ambiguo de tipo i. Ejemplo de tipo 2: { aⁱbʲcᵏ / i = j ∨ j = k }: las cadenas aⁿbⁿcⁿ tienen dos árboles." },
        { trees: ["S( S( a ) + S( S(b) * S(a) ) )", "S( S( S(a) + S(b) ) * S(a) )"], cap: "GIC22: S → S + S | S * S | a | b es ambigua: a+b*a tiene dos árboles (cada uno es un orden de prioridad distinto)." },
        { ex: "Eliminación de la ambigüedad · categorías Expresión, Término y Factor", b: [{ f: "E → E + T | T\nT → T * F | F\nF → ( E ) | a | b" }, { tree: "E( E( T( F(a) ) ) + T( T( F(b) ) * F(a) ) )", cap: "GIC24: único árbol para a+b*a. El producto queda más abajo, por eso tiene prioridad." }] },
        { p: "El <b>if anidado</b> (if e1 then if e2 then p1 else p2) también es ambiguo: no se sabe a qué if corresponde el else. Se resuelve separando PROP1 (if sin else pendiente) de PROP2 (if completo)." },
        { note: "No existe un algoritmo general que detecte la ambigüedad de una GIC: es un problema indecidible (unidad 4)." }
      ] },
      { id: "bnf", title: "BNF y diagramas de sintaxis", blocks: [
        { table: { h: ["Metacarácter", "Uso"], r: [["::=", "Reemplaza a →"], ["|", "Separa alternativas"], ["{ }", "Secuencias que se repiten: A → Aβ | λ se escribe ⟨A⟩ ::= { β }"], ["[ ]", "Secuencias optativas: A → β | λ se escribe ⟨A⟩ ::= [ β ]"], ["( )", "Agrupa alternativas con prefijos o sufijos comunes: w(x | y | z)u"], ["⟨ ⟩", "Encierran los nemotécnicos de los no terminales"]] } },
        { f: "⟨Identificador⟩ ::= ⟨Letra⟩ ⟨Resto⟩ | ⟨Guión⟩ ⟨Resto⟩\n⟨Resto⟩ ::= { ⟨Letra⟩ | ⟨Dígito⟩ | ⟨Guión⟩ }\n⟨Número⟩ ::= 0 | ⟨Uno⟩ ⟨Resto⟩        ⟨Resto⟩ ::= { ⟨Dígito⟩ }\n⟨Programa⟩ ::= ⟨Declara⟩ ; { ⟨Sentencia⟩ }\n⟨RestoIf⟩ ::= [ else { ⟨Sentencia⟩ } ]" },
        { p: "El <b>diagrama de sintaxis</b> es la forma gráfica del nivel sintáctico: un rectángulo es una estructura con su propio diagrama (no terminal), un óvalo o círculo es un componente léxico o símbolo especial (terminal) y las flechas indican qué sigue." },
        { rail: [rail.ident, rail.num], cap: "Diagramas de Identificador y Número (rectángulo: no terminal; óvalo: terminal)." },
        { rail: [rail.prog, rail.decl, rail.tipo], cap: "Diagramas del programa sencillo." }
      ] },
      { id: "simpl", title: "Simplificación de una GIC", blocks: [
        { ol: ["<b>Eliminar reglas innecesarias:</b> no terminales inútiles (los que no cumplen S ⇒* αNβ y N ⇒* w) y reglas N → N.", "<b>Considerar la generación de λ:</b> si S ⇒* λ, se agrega S → λ si S no está a la derecha; si está, nuevo axioma S1 → S | λ.", "<b>Eliminar reglas de borrado</b> N → λ: se calcula el conjunto A de anulables (N ⇒* λ) y en cada regla se reemplazan por λ en todas las combinaciones posibles. Ej.: A → BCDE con C y E anulables da A → BD | BDE | BCD.", "<b>Eliminar reglas unitarias</b> N1 → N2: se calcula Unitario(N) = {Ni / N ⇒* Ni} y se agregan a N todas las reglas no unitarias de cada Ni."] },
        { ex: "GIC28 · S → aASB | a · A → bABA | λ · B → bBa | λ", b: [{ p: "Anulables A = {A, B}. Al eliminar el borrado:" }, { f: "S → aASB | a | aSB | aAS | aS\nA → bABA | bBA | bAA | bAB | bA | bB | b\nB → bBa | ba" }] }
      ] },
      { id: "fnc-fng", title: "Formas normales de Chomsky y Greibach", blocks: [
        { ex: "FNC", b: [{ ol: ["Obtener la GIC simplificada.", "FNC de tipo 0: reemplazar los terminales de las partes derechas por no terminales nuevos (A → a).", "Reducir la longitud agregando no terminales."] }, { f: "S → aSb | ab\n2) S → ASB | AB    A → a   B → b\n3) S → AC | AB     C → SB  A → a   B → b" }] },
        { ex: "FNG", b: [{ ol: ["Obtener la GIC simplificada.", "Eliminar recursividad por izquierda (directa N → Nβ o en varios pasos N ⇒* Nβ).", "Eliminar reglas que comienzan con no terminal (sustituciones ordenadas: grupos 1, 2 y 3).", "Sustituir sufijos con terminales por no terminales nuevos."] },
          { def: "Recursividad directa por izquierda", tag: "Regla de transformación", txt: "N → Nα1 | … | Nαn | β1 | … | βm se reemplaza por N → β1N' | … | βmN' y N' → α1N' | … | αnN' | λ." },
          { f: "E → E + T | T          E → TE'    E' → +TE' | λ\nT → T * F | F          T → FT'    T' → *FT' | λ\nF → ( E ) | a | b      F → ( E ) | a | b" }] },
        { def: "Factorización por izquierda", txt: "Si N → βα1 | βα2 | … | βαk (prefijos iguales), se cambian por N → βN' y N' → α1 | … | αk. Evita la indeterminación al elegir la regla y es necesaria para buscar un AP determinista." },
        { f: "S → if C then S else S endif | if C then S endif | repeat S until C | repeat S forever\n⇒ S → if C then S A | repeat S B    A → else S endif | endif    B → until C | forever" }
      ] },
      { id: "ap", title: "Autómatas de pila", blocks: [
        { p: "El AP es un caso particular de MT, o un AF con una <b>cinta auxiliar infinita de apilamiento</b>. Resuelve la aceptación de lenguajes de tipo 2." },
        { def: "Definición formal de un Autómata de Pila", txt: "AP = ⟨Q, ΣE, ΣP, q0, z0, F, f⟩. Q: conjunto finito y no vacío de estados; ΣE: alfabeto de entrada; ΣP: alfabeto de símbolos auxiliares de la pila; q0: estado inicial; z0: símbolo inicial de la pila (∈ ΣP); F: conjunto de estados finales; f: relación de transición f : (Q − F) × (ΣE ∪ {∆, λ}) × ΣP* ⇒ 2^(Q × ΣP*)." },
        { ul: ["El dominio no incluye a F porque los estados finales son de parada.", "Funcionamiento: LEE un símbolo, DESCARGA (POP) una secuencia de la pila, y según estado, símbolo y secuencia CARGA (PUSH) otra secuencia y transiciona. Leer, POP y PUSH pueden ser λ.", "Acepta al llegar a un estado final; rechaza por <b>bloqueo</b>.", "El AP es <b>no determinista por naturaleza</b>: no todo APND tiene equivalente determinista (los palíndromos solo tienen AP no determinista).", "Para todo LIC existe un AP que lo acepta y rechaza su complemento: el problema siempre tiene solución."] },
        { def: "Configuración de un AP", tag: "Concepto", txt: "Lo que falta leer, seguido del estado actual y del contenido de la pila (tope a la izquierda): eᵢ…eₙ qₖ zₘ…z0. Ejemplo: aabb∆1# ├─ abb∆1A# ├─ bb∆1AA# ├─ b∆2A# ├─ ∆2# ├─ 3 acepta." },
        { fa: S.ap1, cap: "Rótulos (lee, saca, pone). En la pila, el primer símbolo de lo que se pone queda en el tope." },
        { sim: "ap1" },
        { table: { h: ["Criterio", "Acepta cuando", "Paso al otro criterio"], r: [["Estado final", "Al leer el fin de cadena transiciona a un estado final", "Para vaciar la pila: autolazos (λ, zi, λ) en el final"], ["Pila vacía", "Llega al fin de cadena con la pila vacía", "Transiciones (∆, z0, λ) hacia un final nuevo"]] } },
        { fa: S.ap27, cap: "AP27 no determinista: el AP tiene que \"adivinar\" la mitad de la palabra." }
      ] },
      { id: "gic-ap", title: "De GIC a AP y de AP a GIC", blocks: [
        { table: { h: ["", "Desde FNG", "Desde FNC"], r: [["Criterio de aceptación", "Pila vacía", "Estado final"], ["Análisis", "Descendente, derivación más a la izquierda", "Ascendente, derivación más a la derecha"], ["Pila inicial", "El axioma ya está cargado", "# no está cargado"], ["Fin de cadena", "No se lee explícitamente", "Se lee explícitamente"], ["Estados", "Uno solo: q", "q0 → q1 → q2 → q3"], ["Transiciones", "N → tW: lazo (t, N, W) · S → λ: (λ, S, λ)", "q0 (λ,λ,#) q1 · N → t: (t, λ, N) · N1 → N2N3: (λ, N3N2, N1) · S → λ: (λ, λ, S) · q1 (λ,S,λ) q2 · q2 (∆,#,λ) q3"]] } },
        { ex: "aⁿbⁿ en FNG: S → aC | λ · C → aCB | b · B → b", b: [{ f: "Lazos en q:  (a,S,C)  (a,C,CB)  (b,C,λ)  (b,B,λ)  (λ,S,λ)\naabb∆qS ├─ abb∆qC ├─ bb∆qCB ├─ b∆qB ├─ ∆q  acepta" }] },
        { def: "De AP a GIC", txt: "Partiendo de un AP por pila vacía: los no terminales son ternas [pXq] (pasar de p a q extrayendo X), más el axioma S. 1) S → [q0 S p] para cada estado p. 2) Si f(q, t, X) contiene (r, Y1…Yk), para toda lista de estados r1…rk: [q X rk] → t [r Y1 r1][r1 Y2 r2]…[rk−1 Yk rk]. Las reglas salen en FNG (salvo borrados fáciles de eliminar) y luego se limpian las innecesarias." }
      ] },
      { id: "props", title: "Propiedades de los LIC", blocks: [
        { ul: ["Todo LIC se describe con diagramas de sintaxis, árboles sintácticos y árboles totales.", "Todo LIC tiene un AP que lo acepta y una GIC que lo genera.", "Son cerrados para unión, concatenación, estrella de Kleene, estrella positiva e inversa.", "<b>No</b> son cerrados para la intersección ni para el complemento."] },
        { p: "Intersección: L1 = {aⁿbⁿcᵏ} y L2 = {aᵏbⁿcⁿ} son LIC, pero L1 ∩ L2 = {aⁿbⁿcⁿ} no lo es. Complemento: si lo fueran, ~L1 ∪ ~L2 = ~(L1 ∩ L2) sería LIC y por De Morgan también la intersección." },
        { def: "Lema de bombeo para LIC", txt: "Para cada GIC existe un k tal que toda w ∈ L(GIC) con |w| &gt; k puede escribirse como w = uvxyz, con v e y no ambas vacías, y uvⁱxyⁱz ∈ L(GIC) para todo i ≥ 0. Con él se prueba que {aⁿbⁿcⁿ} no es LIC." }
      ] }
    ],
    tp: { n: 3, title: "GIC y autómatas de pila", clase: [
      { id: "1.1", txt: "<p>GIC para a) {a²ⁿ bⁿ⁺¹} b) {aⁿbᵐ / |n − m| = 1} c) {aⁿ bⁿ⁺ᵐ cᵐ / n, m ≥ 1} d) {aⁿbᵐcᵖ / n ≥ m, p impar}.</p>", sol: [{ f: "a) S → aaSb | b\nb) S → aA | Bb    A → aAb | λ    B → aBb | λ\nc) S → AB    A → aAb | ab    B → bBc | bc\nd) S → AC    A → aAb | aA | λ    C → ccC | c" }] }
    ], alumnos: [
      { id: "2.1", tag: "diseño de GIC", txt: "<p>Encontrar GIC para: a) { xⁿ(y + z)ⁿ / n ≥ 0 } b) { aⁿ⁺ᵐ bⁿ cᵐ / n, m ≥ 1 } c) { 0ⁿ1ᵐ / n, m ≥ 1, n = 2m o m = 2n } d) { (a + b)ⁿ cᵐ / n, m ≥ 0, |w|a = m } e) { x²ⁿ⁺¹ zᵐ yⁿ / n &gt; 0, m impar }</p>", sol: [{ f: "a) S → xSy | xSz | λ\nb) S → aSc | aAc        A → aAb | ab\nc) S → A | B   A → 00A1 | 001   B → 0B11 | 011\nd) S → aSc | bS | λ\ne) S → xxSy | xxTy      T → xZ      Z → zzZ | z" }, { note: "Las cinco se verificaron generando todas las palabras hasta longitud 8 o 9." }] },
      { id: "2.2", tag: "árboles", txt: "<p>Para las gramáticas del 2.1, dos palabras de longitud &gt; 5 con su árbol de derivación y el árbol total con al menos 4 niveles.</p>", sol: [{ p: "Ejemplo con b) y la palabra aaabcc (n = 1, m = 2):" }, { tree: "S( a S( a A( a b ) c ) c )" }, { p: "Árbol total de b), primeros niveles: S → {aSc, aAc}; aSc → {aaScc, aaAcc}; aAc → {aaAbc, aabc}; aabc es la primera hoja." }] },
      { id: "2.3", tag: "ambigüedad", txt: "<p>Comprobar si son ambiguas y, de ser posible, dar una equivalente sin ambigüedad.</p><p>a) S → aX | Yb | λ · X → aXb | aa | b · Y → aYb | b | a<br>b) S → aX | Yb | λ · X → aXb | aX | b · Y → aYb | Yb | a<br>c) S → XY | YZ · X → aXb | ab · Y → aY | a · Z → bXa | ba<br>d) S → XY | YX · X → aaX | a · Y → abY | a</p>", sug: 1, sol: [{ table: { h: ["", "Palabra ambigua", "Equivalente sin ambigüedad"], r: [
        ["a", "ab: S ⇒ aX ⇒ ab y S ⇒ Yb ⇒ ab", "Quitar Y → a: S → aX | Yb | λ · X → aXb | aa | b · Y → aYb | b"],
        ["b", "aab: X → aXb | aX se superponen; además aⁿbⁿ sale por los dos lados de S", "S → aX | Yb | λ · X → aX | Z · Z → aZb | b · Y → Yb | Vb · V → aVb | a"],
        ["c", "aba: XY con X = ab, Y = a, y YZ con Y = a, Z = ba", "S → XY | YbXa | aYba · X → aXb | ab · Y → aY | a"],
        ["d", "aa: XY y YX con X = a, Y = a", "S → XY | VX · X → aaX | a · Y → abY | a · V → abV | aba"]] } }, { note: "Las equivalentes generan exactamente el mismo lenguaje (verificado). Ninguno de estos lenguajes es inherentemente ambiguo." }] },
      { id: "2.4", tag: "BNF", txt: "<p>Expresar en BNF con metacaracteres: a) S → XYZ · X → aX | λ · Y → aaYc | a · Z → cc | λ<br>b) S → aSa | bSb | XYd · X → cc | cd · Y → Ydd | λ</p>", sol: [{ f: "a) ⟨S⟩ ::= { a } ⟨Y⟩ [ cc ]\n   ⟨Y⟩ ::= aa ⟨Y⟩ c | a\nb) ⟨S⟩ ::= a ⟨S⟩ a | b ⟨S⟩ b | c ( c | d ) { dd } d" }] },
      { id: "2.5", tag: "BNF y diagramas", txt: "<p>BNF y diagrama de sintaxis de: a) aⁿbᵐcᵖ / n ≥ 0, m &lt; 3, p impar; b) aⁿbᵐcᵖ / n ≥ 0, m impar, p = 2n + 1; c) aⁿbᵐcᵖ / n &gt; 1, m ≥ 1, p &gt; m; d) enteros con puntos de unidades de mil.</p>", sug: 1, sol: [
        { f: "a) ⟨S⟩ ::= { a } [ b [ b ] ] c { cc }\nb) ⟨S⟩ ::= a ⟨S⟩ cc | ⟨B⟩ c        ⟨B⟩ ::= b { bb }\nc) ⟨S⟩ ::= aa { a } ⟨T⟩            ⟨T⟩ ::= b ⟨T⟩ c | bcc { c }\nd) ⟨E⟩ ::= [ + | - ] ( 0 | ⟨N⟩ [ ⟨D⟩ [ ⟨D⟩ ] ] { . ⟨D⟩ ⟨D⟩ ⟨D⟩ } )\n   ⟨N⟩ ::= 1 | … | 9      ⟨D⟩ ::= 0 | ⟨N⟩" },
        { rail: [{ name: "a)", d: { seq: [{ star: { t: "a" } }, { opt: { seq: [{ t: "b" }, { opt: { t: "b" } }] } }, { t: "c" }, { star: { seq: [{ t: "c" }, { t: "c" }] } }] } }, { name: "d) Entero", d: { seq: [{ opt: { alt: [{ t: "+" }, { t: "-" }] } }, { alt: [{ t: "0" }, { seq: [{ n: "N" }, { opt: { seq: [{ n: "D" }, { opt: { n: "D" } }] } }, { star: { seq: [{ t: "." }, { n: "D" }, { n: "D" }, { n: "D" }] } }] }] }] } }] }
      ] },
      { id: "2.6", tag: "diagramas", txt: "<p>Diagramas de sintaxis para: a) una mayúscula seguida de una o más minúsculas sin vocales consecutivas; b) expresiones aritméticas con paréntesis balanceados; c) estructuras iterativas.</p>", sug: 1, sol: [
        { rail: [{ name: "a) Palabra", d: { seq: [{ n: "May" }, { alt: [{ seq: [{ n: "Voc" }, { star: { seq: [{ n: "Cons" }, { opt: { n: "Voc" } }] } }] }, { loop: { seq: [{ n: "Cons" }, { opt: { n: "Voc" } }] } }] }] } },
          { name: "b) Expresión", d: { seq: [{ n: "Término" }, { star: { seq: [{ alt: [{ t: "+" }, { t: "-" }] }, { n: "Término" }] } }] } },
          { name: "Término", d: { seq: [{ n: "Factor" }, { star: { seq: [{ alt: [{ t: "*" }, { t: "/" }] }, { n: "Factor" }] } }] } },
          { name: "Factor", d: { alt: [{ t: "num" }, { t: "id" }, { seq: [{ t: "(" }, { n: "Expresión" }, { t: ")" }] }] } },
          { name: "c) Iterativa", d: { alt: [{ seq: [{ t: "while" }, { n: "Cond" }, { t: "do" }, { n: "Sent" }] }, { seq: [{ t: "repeat" }, { n: "Sent" }, { t: "until" }, { n: "Cond" }] }, { seq: [{ t: "for" }, { t: "id" }, { t: ":=" }, { n: "Exp" }, { t: "to" }, { n: "Exp" }, { t: "do" }, { n: "Sent" }] }] } }] }
      ] },
      { id: "2.7", tag: "autómatas de pila", txt: "<p>AP por estado final y por pila vacía para: a) { aⁿ bⁿ⁺ᵐ aᵐ / n, m ≥ 0 } b) { (x + y)ⁿ zⁿ } c) { (a + b + c)ⁿ / n &gt; 0, |w|a = |w|b } d) { xⁿ yᵐ zᵖ / m par, p = 2n + 1 } e) { xⁿyᵐ / n &gt; 0, m &gt; n } f) { xⁿyᵐ / n &lt; m }</p>", sug: 1, sol: [
        { p: "Transiciones (estado, lee, saca, nuevo, pone) con z0 = # y final f. Todas son deterministas. Para la versión por pila vacía, cambiar cada (∆, #, λ) → f por (∆, #, λ) sin pasar a f." },
        { table: { mono: true, h: ["", "Transiciones"], r: [
          ["a", "0: (a,#,A#)(a,A,AA)→0 · (b,A,λ)→1 · (b,#,B#)→2 · (∆,#,λ)→f — 1: (b,A,λ)→1 · (b,#,B#)→2 · (∆,#,λ)→f — 2: (b,B,BB)→2 · (a,B,λ)→3 — 3: (a,B,λ)→3 · (∆,#,λ)→f"],
          ["b", "0: (x,#,X#)(x,X,XX)(y,#,X#)(y,X,XX)→0 · (z,X,λ)→1 · (∆,#,λ)→f — 1: (z,X,λ)→1 · (∆,#,λ)→f"],
          ["c", "0 y 1: con a: (a,#,A#)(a,A,AA)(a,B,λ) · con b: (b,#,B#)(b,B,BB)(b,A,λ) · con c no toca la pila; todas van a 1 — 1: (∆,#,λ)→f (desde 0 no, porque n &gt; 0)"],
          ["d", "0: (x,#,XX#)(x,X,XXX)→0 · y alterna 1 ↔ 2 sin tocar la pila (paridad) · desde 0 o 2: (z,X,λ)→3 · (z,#,#)→4 — 3: (z,X,λ)→3 · (z,#,#)→4 — 4: (∆,#,λ)→f"],
          ["e", "0: (x,#,X#)→1 — 1: (x,X,XX)→1 · (y,X,λ)→2 — 2: (y,X,λ)→2 · (y,#,#)→3 — 3: (y,#,#)→3 · (∆,#,λ)→f"],
          ["f", "0: (x,#,X#)(x,X,XX)→0 · (y,X,λ)→1 · (y,#,#)→2 — 1: (y,X,λ)→1 · (y,#,#)→2 — 2: (y,#,#)→2 · (∆,#,λ)→f"]] } },
        { fa: S.tp3e, cap: "AP del inciso e)." },
        { note: "Los seis AP se probaron con todas las palabras hasta longitud 8." }] },
      { id: "2.8", tag: "FNC", txt: "<p>Simplificar y pasar a FNC: a) S → aaS | X · W → abX | bbZ · X → aaX | bY | aZ · Y → bYa | aaY · Z → bZa | bbT | ba<br>b) S → aX | bZa | λ · X → bS | Z · Y → abX | ZXa · Z → bZa | b<br>c) S → bY | ZX · X → aXb | λ · Y → abb | bZ · Z → aZb | λ</p>", sug: 1, sol: [
        { p: "<b>a)</b> W es inaccesible; Y nunca termina y T no tiene reglas: se eliminan. Queda S → aaS | X · X → aaX | aZ · Z → bZa | ba. Sin unitarias: S → aaS | aaX | aZ. FNC:" },
        { f: "S → AC | AD | AZ    C → AS    D → AX\nX → AD | AZ         Z → BE | BA    E → ZA\nA → a    B → b           L = { a^impar bᵏ aᵏ / k ≥ 1 }" },
        { p: "<b>b)</b> Y es inaccesible. S está a la derecha y genera λ: S1 → S | λ. Se elimina S → λ y la unitaria X → Z:" },
        { f: "S1 → AX | BC | λ    S → AX | BC\nX → BS | BC | b     Z → BC | b    C → ZA\nA → a    B → b" },
        { p: "<b>c)</b> X y Z son anulables y S ⇒ ZX ⇒* λ (S no está a la derecha): se agrega S → λ. Sin borrado ni unitarias, en FNC:" },
        { f: "S → BY | ZX | AC | AB | AD | λ\nC → ZB    D → XB    X → AD | AB    Z → AC | AB\nY → AE | BZ | b     E → BB    A → a    B → b" }] },
      { id: "2.9", tag: "FNG", txt: "<p>Simplificar y pasar a FNG: a) S → aaX | bW | λ · T → bXb | aYa · V → Vaa | bb · X → Sb | Z | Yaa · Y → aYa | Ybb · Z → Xb | aa<br>b) S → Zb | abY | aT · T → aW | λ · W → aWa | bWb · X → Xbb | T · Y → Sa | aW | λ · Z → Ya | aXb</p>", sug: 1, sol: [
        { p: "<b>a)</b> W no tiene reglas e Y no termina: se eliminan; T y V quedan inaccesibles. S → aaX | λ, X → Sb | Z, Z → Xb | aa. Como S está a la derecha y genera λ: S1 → S | λ. Sin borrado ni unitarias: X → Sb | b | Xb | aa. Se elimina la recursividad X → Xb con X' (Q) y se sustituye S al inicio:" },
        { f: "S1 → aAX | λ      S → aAX\nX → aAXBQ | aAXB | bQ | b | aAQ | aA\nQ → bQ | b        A → a        B → b" },
        { p: "<b>b)</b> W nunca termina: caen T → aW e Y → aW, y T → λ. Seguí los mismos pasos: anulables, unitarias (X → T), recursividad X → Xbb y sustituciones hasta que todas las reglas empiecen con terminal." }] },
      { id: "2.10", tag: "FNC ⇒ AP", txt: "<p>A partir de las FNC del 2.8, AP ascendentes con aceptación por estado final.</p>", sol: [{ p: "Para 2.8 a): q0 (λ,λ,#) q1; lazos en q1:" }, { f: "(a,λ,A) (b,λ,B)\n(λ,CA,S) (λ,DA,S) (λ,ZA,S) (λ,SA,C) (λ,XA,D)\n(λ,DA,X) (λ,ZA,X) (λ,EB,Z) (λ,AB,Z) (λ,AZ,E)\nq1 (λ,S,λ) q2      q2 (∆,#,λ) q3" }] },
      { id: "2.11", tag: "FNG ⇒ AP", txt: "<p>A partir de las FNG del 2.9, AP descendentes con aceptación por pila vacía.</p>", sol: [{ p: "Para 2.9 a), un solo estado q con S1 cargado en la pila:" }, { f: "(a,S1,AX) (λ,S1,λ) (a,S,AX)\n(a,X,AXBQ) (a,X,AXB) (b,X,Q) (b,X,λ) (a,X,AQ) (a,X,A)\n(b,Q,Q) (b,Q,λ) (a,A,λ) (b,B,λ)" }, { p: "Es no determinista: con (a, X) hay cuatro reacciones posibles. Para buscar uno determinista hay que factorizar." }] },
      { id: "2.12", tag: "factorización", txt: "<p>Factorizar por izquierda, pasar a FNG y buscar AP deterministas: a) S → abaX | ababY | aa · X → aX | ab · Y → abY | abbX<br>b) S → XY · X → aXb | bb | bZ · Y → abY | abZ | b · Z → ccZ | caZ<br>c) S → Xb | Yab · X → aXbb | aab · Y → aYb | aaX</p>", sug: 1, sol: [{ p: "<b>a)</b> S → aS' · S' → baX | babY | a ⇒ S' → bS'' | a · S'' → aX | abY ⇒ S'' → aS''' · S''' → X | bY. Luego X → aX' · X' → X | b, e Y → abY' · Y' → Y | bX. Reemplazando las unitarias, cada no terminal queda con alternativas que empiezan con terminales distintos, y el AP descendente por pila vacía resulta determinista." }, { p: "<b>b)</b> Z nunca termina (Z → ccZ | caZ): se elimina y queda X → aXb | bb, Y → abY | b. Ya no hay prefijos comunes conflictivos." }] }
    ] },
    control: [
      { t: "vf", kind: "teoría", q: "En una GIC las reglas tienen la forma N → β, con N ∈ ΣN y β ∈ (ΣN ∪ ΣT)*.", a: true },
      { t: "vf", kind: "teoría", q: "Una GIC es ambigua cuando para ciertas palabras hay más de un árbol de derivación.", a: true },
      { t: "vf", kind: "teoría", q: "Un lenguaje es inherentemente ambiguo de tipo 2 cuando existe al menos una GIC ambigua que lo genera.", a: false, why: "Es inherentemente ambiguo cuando NINGUNA gramática de ese tipo lo genera sin ambigüedad." },
      { t: "vf", kind: "teoría", q: "El AP es determinista por naturaleza: para todo AP no determinista existe uno determinista equivalente.", a: false, why: "Es no determinista por naturaleza: hay LIC (palíndromos) que solo tienen AP no determinista." },
      { t: "vf", kind: "teoría", q: "Los LIC son cerrados con respecto a la unión, la concatenación, la estrella de Kleene, la intersección y el complemento.", a: false, why: "No son cerrados para la intersección ni para el complemento." },
      { t: "vf", kind: "teoría", q: "En el AP la relación de transición no incluye a F en su dominio porque los estados finales son de parada.", a: true },
      { t: "vf", kind: "teoría", q: "En BNF las llaves { } encierran secuencias optativas.", a: false, why: "Las llaves son repetición. Los corchetes [ ] son lo optativo." },
      { t: "match", kind: "teoría", q: "Emparejá cada metacarácter de BNF con su uso.", opts: ["Repetición", "Opcional", "Alternativa", "Agrupar alternativas", "Separa izquierda y derecha"], items: [["{ }", "Repetición"], ["[ ]", "Opcional"], ["|", "Alternativa"], ["( )", "Agrupar alternativas"], ["::=", "Separa izquierda y derecha"]] },
      { t: "match", kind: "teoría", q: "Construcción de un AP a partir de una GIC: completá.", opts: ["Pila vacía", "Estado final", "Descendente", "Ascendente"], items: [["Criterio de aceptación desde FNG", "Pila vacía"], ["Criterio de aceptación desde FNC", "Estado final"], ["Tipo de análisis desde FNG", "Descendente"], ["Tipo de análisis desde FNC", "Ascendente"]] },
      { t: "fill", kind: "teoría", q: "Completá la definición formal del AP: AP = ⟨Q, ΣE, ΣP, q0, z0, F, f⟩.", blanks: [{ k: "ΣP es el", a: ["alfabeto de símbolos auxiliares de la pila", "alfabeto de la pila", "alfabeto auxiliar de la pila", "alfabeto de simbolos auxiliares de la pila"] }, { k: "z0 es el", a: ["símbolo inicial de la pila", "simbolo inicial de la pila"] }] },
      { t: "x", kind: "teoría", q: "Marcá con X los pasos para obtener una GIC simplificada (bien formada).", o: ["Eliminar reglas innecesarias", "Considerar la generación de λ", "Eliminar reglas de borrado", "Eliminar reglas unitarias o de redenominación", "Eliminar la recursividad por izquierda", "Factorizar por izquierda"], a: [0, 1, 2, 3], why: "Recursividad y factorización son pasos de la FNG, no de la simplificación." },
      { t: "mc", kind: "práctica", q: "¿Qué palabra demuestra que S → S + S | S * S | a | b es ambigua?", o: ["a+b*a", "a+b", "a*b", "a"], a: 0 },
      { t: "mc", kind: "práctica", q: "¿Qué resulta de eliminar la recursividad en E → E + T | T?", o: ["E → TE' · E' → +TE' | λ", "E → T + E | T", "E → +TE | T", "E → E'T · E' → E' + | λ"], a: 0 },
      { t: "mc", kind: "práctica", q: "En AP1 (aⁿbⁿ), ¿cuál es la configuración después de leer aa desde aabb∆q0#?", o: ["bb∆q0AA#", "bb∆q1AA#", "bb∆q0A#", "abb∆q0A#"], a: 0 },
      { t: "mc", kind: "práctica", q: "¿Qué GIC genera { aⁿ⁺ᵐ bⁿ cᵐ / n, m ≥ 1 }?", o: ["S → aSc | aAc · A → aAb | ab", "S → aSb | aAc · A → aAc | ab", "S → AB · A → aAb | ab · B → aBc | ac", "S → aSbc | abc"], a: 0, why: "Las a externas se aparean con las c (m), y las internas con las b (n)." },
      { t: "mc", kind: "práctica", q: "En FNC, ¿cómo queda S → aSb | ab?", o: ["S → AC | AB · C → SB · A → a · B → b", "S → aC | ab · C → Sb", "S → ASB | AB · A → a · B → b", "S → AB · A → aS · B → b"], a: 0 }
    ]
  });
})();
