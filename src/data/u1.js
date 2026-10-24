/* Unidad 1 · Lingüística Matemática */
(function () {
  var chomskyNest = '<figure class="fig"><div class="canvas" style="padding:16px"><div style="max-width:560px;margin:0 auto;font-size:.88rem">' +
    '<div style="border:1.5px solid var(--ink);border-radius:10px;padding:10px 12px 12px;display:flex;flex-direction:column;gap:6px"><b style="font-family:var(--f-display)">Tipo 0 · Irrestricta → L. recursivamente enumerables · Pragmático · MT</b>' +
    '<div style="border:1.5px solid var(--ink);border-radius:10px;padding:10px 12px 12px;display:flex;flex-direction:column;gap:6px;background:var(--sunk)"><b style="font-family:var(--f-display)">Tipo 1 · Dependiente del contexto → LDC · Semántico · ALL</b>' +
    '<div style="border:1.5px solid var(--ink);border-radius:10px;padding:10px 12px 12px;display:flex;flex-direction:column;gap:6px;background:var(--surface)"><b style="font-family:var(--f-display)">Tipo 2 · Independiente del contexto → LIC · Sintáctico · AP</b>' +
    '<div style="border:1.5px solid var(--accent);border-radius:10px;padding:10px 12px;background:var(--accent-soft)"><b style="font-family:var(--f-display)">Tipo 3 · Regular → LR · Léxico · AF</b></div></div></div></div>' +
    '<div style="text-align:center;font-family:var(--f-mono);margin-top:10px">L0 ⊇ L1 ⊇ L2 ⊇ L3</div></div></div><figcaption>Cada tipo surge de aplicar restricciones al anterior, por eso los conjuntos de lenguajes quedan contenidos unos en otros.</figcaption></figure>';
  function stage(t, s, c) { return '<div style="flex:1;min-width:120px;border:1.5px solid var(--ink);border-radius:6px;padding:8px 10px;background:' + c + '"><div style="font-family:var(--f-display);font-weight:700">' + t + '</div><div style="font-size:.8rem;color:var(--muted)">' + s + "</div></div>"; }
  var pipeline = '<figure class="fig"><div class="canvas" style="padding:14px"><div style="display:flex;flex-direction:column;gap:10px">' +
    '<div class="kicker">Fase de análisis</div><div style="display:flex;gap:8px;flex-wrap:wrap">' + stage("Léxico · Scanner", "reconoce componentes léxicos, llena la tabla de símbolos", "var(--accent-soft)") + stage("Sintáctico · Parser", "revisa la estructura, arma el árbol", "var(--accent-soft)") + stage("Semántico", "coherencia de tipos y declaraciones", "var(--accent-soft)") + "</div>" +
    '<div class="kicker">Fase de síntesis</div><div style="display:flex;gap:8px;flex-wrap:wrap">' + stage("Código intermedio", "de 3 direcciones, a partir del árbol semántico", "var(--mark-soft)") + stage("Optimización", "elimina instrucciones redundantes", "var(--mark-soft)") + stage("Generación de código", "ensamblador del procesador", "var(--mark-soft)") + "</div>" +
    '<div style="font-size:.82rem;color:var(--muted)">La tabla de símbolos y el manejo de errores acompañan a todas las etapas.</div></div></div><figcaption>Etapas de un compilador según la clase 5.</figcaption></figure>';

  window.SSL.units.push({
    id: "u1", n: 1, parcial: 1, short: "Lingüística", title: "Lingüística matemática",
    summary: "Niveles de un lenguaje, alfabetos, palabras y lenguajes, operaciones, gramáticas estructuradas por frases, jerarquía de Chomsky y proceso de compilación.",
    sections: [
      { id: "lenguaje", title: "Introducción al lenguaje", blocks: [
        { def: "Signo", txt: "Algo que evoca o representa una cosa o concepto." },
        { table: { h: ["Tipo de signo", "Intención comunicativa", "Qué es", "Ejemplo"], r: [
          ["Índice", "Sin intención (no hay emisor-receptor)", "Da indicios de una entidad o hecho; manifestaciones naturales o culturales", "Humo → fuego; huellas → animal"],
          ["Ícono", "Con intención", "Por su aspecto se asemeja bastante a lo que representa", "Dibujo de una llama → fuego"],
          ["Símbolo", "Con intención", "Meramente convencional, no guarda parecido con lo que representa", "FIRE, la palabra árabe para fuego"]] } },
        { table: { h: ["Lenguaje formal", "Lenguaje natural"], r: [
          ["Se formaliza antes de usar", "Se usa antes de formalizar"], ["No es ambiguo", "Es ambiguo"], ["De dominio específico", "De dominio general"], ["Para humanos y/o máquinas", "Para humanos"],
          ["Programación, música, matemática, química", "Idiomas: oral, escrito, lengua de señas, Braille, Morse"]] } },
        { def: "Significante y significado", tag: "Concepto", txt: "Un símbolo se compone de un <b>significante</b> (no depende del contexto), que es la imagen gráfica o sonora con la que lo representamos, y de un <b>significado</b> (depende del contexto), que es el concepto asociado. Ejemplo: <code>$</code> es el significante; según el contexto significa PESO o DÓLAR." }
      ] },
      { id: "niveles", title: "Niveles de un lenguaje", blocks: [
        { p: "Para facilitar su estudio se definen 4 dimensiones, que permiten analizar un texto en etapas de complejidad ascendente: <b>léxico, sintáctico, semántico y pragmático</b>." },
        { def: "Nivel léxico", txt: "Es la dimensión del lenguaje que trata sobre la relación entre los símbolos que representan las distintas palabras que se utilizan para formar una frase válida. Es lo que normalmente llamamos diccionario. Cada palabra se denomina componente léxico." },
        { def: "Nivel sintáctico", txt: "Es la dimensión del lenguaje que estudia la forma en la que se organizan los componentes léxicos para formar una frase válida, es decir la estructura de la secuencia. Este nivel es <b>independiente del contexto</b>, tanto en los lenguajes naturales como en los formales." },
        { def: "Nivel semántico", txt: "Es la dimensión del lenguaje que analiza el significado o connotación de los componentes léxicos y de las frases válidas. Es <b>muy sensible al contexto</b>. Los lenguajes naturales son polisemánticos; en los formales la semántica es simple, ya que no admiten ambigüedades." },
        { def: "Nivel pragmático", txt: "Es la dimensión del lenguaje que trata sobre hechos o acciones que evocan las frases; tiene en cuenta el contexto donde se aplica el lenguaje, por lo tanto es <b>fuertemente dependiente</b> del mismo." },
        { ex: "Ejemplos en C/C++ (los que suelen tomar para emparejar)", b: [
          { table: { h: ["Sentencia", "Nivel del error", "Por qué"], r: [
            ["<code>int 2num = 5;</code>", "Léxico", "<code>2num</code> no es un identificador válido: el componente léxico está mal formado"],
            ["<code>float x = 3.4.5;</code>", "Léxico", "No existe un componente léxico número con dos puntos"],
            ["<code>if (N &gt;= 0) S1 = S1 + N else S2 = S2 + N;</code>", "Sintáctico", "Falta <code>;</code>: la estructura <code>if (exp) sentencia else sentencia</code> no se cumple"],
            ["<code>x = (a + b;</code>", "Sintáctico", "Paréntesis sin cerrar"],
            ["<code>float I, V[100]; ... V[I] = 23.45;</code>", "Semántico", "Se usa un float como índice: incoherencia entre declaración y uso"],
            ["<code>int Num; char Cad[10]; Num = Cad;</code>", "Semántico", "Tipos incompatibles en la asignación"],
            ["<code>int d = 0; r = 10 / d;</code>", "Pragmático", "División por cero en tiempo de ejecución"],
            ["<code>scanf(\"%f\", &amp;N1);</code> y el operador tipea letras", "Pragmático", "El error aparece al ejecutar, por el dato ingresado"],
            ["<code>while (1) { cont--; }</code>", "Pragmático", "Ciclo infinito: la acción que evoca no termina"]] } }
        ] },
        { note: "<b>Regla práctica:</b> si el compilador no puede ni separar las palabras, es léxico; si las palabras existen pero están mal ordenadas, sintáctico; si está bien escrito pero no tiene sentido con las declaraciones (tipos), semántico; si compila pero falla o hace algo indebido al ejecutarse, pragmático." }
      ] },
      { id: "alfabetos", title: "Alfabetos, palabras y lenguajes", blocks: [
        { def: "Alfabeto", txt: "Conjunto finito no vacío de símbolos diferentes. Se nota Σ; los símbolos abstractos se escriben con las primeras letras minúsculas (a, b, c…)." },
        { def: "Palabra o cadena", txt: "Secuencia finita de símbolos pertenecientes a un alfabeto. Se notan con las últimas letras minúsculas (w, x, y, z)." },
        { def: "Palabra vacía λ", txt: "Es aquella secuencia que no contiene símbolo alguno. No es un símbolo del alfabeto: es una palabra de longitud cero." },
        { ul: ["<b>Prefijo:</b> secuencia de cero o más símbolos iniciales de una palabra.", "<b>Sufijo:</b> secuencia de cero o más símbolos finales de una palabra.", "<b>Subcadena:</b> secuencia de símbolos obtenida al eliminar un sufijo o un prefijo de una palabra.", "<b>Σ*</b>: conjunto de todas las palabras formadas con símbolos del alfabeto, es decir el Conjunto Universal de arreglos con repeticiones de símbolos sobre Σ.", "<b>Σ⁺ = Σ* − {λ}</b>: el conjunto universal sin la palabra vacía."] },
        { def: "Lenguaje", txt: "Cualquier subconjunto L del Conjunto Universal de palabras sobre un alfabeto Σ: <b>L ⊆ Σ*</b>." },
        { table: { h: ["Caso particular", "Notación", "Contenido"], r: [["Lenguaje universal", "Σ*", "Todas las palabras"], ["Lenguaje vacío", "Φ", "Ninguna palabra: { }"], ["Lenguaje de la palabra vacía", "Lλ", "{ λ } (tiene un elemento)"]] } },
        { note: "<b>Trampa clásica del V/F:</b> Φ y Lλ no son lo mismo. |Φ| = 0 y |Lλ| = 1." }
      ] },
      { id: "ops-palabras", title: "Operaciones con palabras", blocks: [
        { def: "Concatenación", txt: "Función con dominio en Σ* × Σ* y rango en Σ*. Dadas las palabras u y v, la concatenación de u con v da como resultado otra palabra w formada por la secuencia de símbolos de u seguida de la secuencia de símbolos de v. Notación w = u.v" },
        { p: "Propiedades: <b>asociativa</b>, <b>no conmutativa</b> (en general u.v ≠ v.u), <b>elemento neutro λ</b>." },
        { def: "Potenciación", txt: "Función con dominio en Σ* × N y rango en Σ*. Dada la palabra u y el natural i, la potencia con base u y exponente i da como resultado otra palabra formada por una sucesión de i palabras u. Por definición u⁰ = λ y u¹ = u." },
        { def: "Longitud", txt: "Función con dominio en Σ* y rango en N. Da como resultado la cantidad de símbolos que forman la palabra. |λ| = 0 y |u|ₐ es la cantidad de símbolos a que hay en u." },
        { def: "Inversa", txt: "Función con dominio en Σ* y rango en Σ*. Da como resultado la imagen especular de u. λ⁻¹ = λ, es involutiva: (u⁻¹)⁻¹ = u. Si u⁻¹ = u, u es palíndromo." },
        { ex: "Ejercicio 1.1 de clase · x = abbcb, y = ab", b: [{ table: { mono: true, h: ["Operación", "Resultado", "¿Palíndromo?"], r: [["x.y", "abbcbab", ""], ["y.x", "ababbcb", ""], ["x²", "abbcbabbcb", ""], ["y⁻¹", "ba", ""], ["(y⁻¹)²", "baba", ""], ["x.y⁻¹", "abbcbba", "sí"], ["x⁰", "λ", "sí"], ["(x²)⁻¹", "bcbbabcbba", ""], ["(x⁻¹)².x²", "bcbbabcbbaabbcbabbcb", "sí"], ["long(x²)", "10", ""], ["|(y²)⁻¹|", "4", ""], ["|xⁿ|_b", "3n", ""]] } }] },
        { note: "<b>Cuidado con alfabetos de símbolos múltiples.</b> Si Σ = {1, 2, 10}, la palabra z = 10 tiene <b>un</b> símbolo: z⁻¹ = 10 y |z| = 1. La longitud se cuenta en símbolos, no en caracteres." }
      ] },
      { id: "ops-lenguajes", title: "Operaciones con lenguajes", blocks: [
        { def: "Notación 2^C", tag: "Notación", txt: "El conjunto C2 de todos los subconjuntos de C1 se nota C2 = 2^C1 porque |C2| = 2^|C1|. Por eso las operaciones con lenguajes tienen dominio y rango en 2^Σ*." },
        { def: "Unión", txt: "Función con dominio en 2^Σ* × 2^Σ* y rango en 2^Σ*. Dados L1 y L2, da como resultado otro lenguaje L3 formado por todas las palabras de L1 y todas las de L2 sin repeticiones." },
        { def: "Diferencia", txt: "Da como resultado otro lenguaje formado por todas las palabras de L1 excepto aquellas que pertenezcan también a L2." },
        { def: "Intersección", txt: "Da como resultado otro lenguaje formado por todas las palabras que pertenecen a L1 y que también pertenecen a L2." },
        { def: "Complemento", txt: "Función con dominio en 2^Σ* y rango en 2^Σ*. Da como resultado otro lenguaje formado por todas las palabras que pertenecen a Σ* y que no pertenecen a L1. ~L1 = Σ* − L1; ~Σ* = Φ y ~Σ⁺ = Lλ." },
        { def: "Producto o concatenación", txt: "Da como resultado otro lenguaje formado por todas las palabras que resultan de concatenar una palabra de L1 con una palabra de L2, y solo en ese orden." },
        { def: "Potenciación", txt: "Dado L1 y un natural i ≥ 2, da como resultado el producto de L1 consigo mismo (i − 1) veces. Por definición L⁰ = Lλ y L¹ = L." },
        { def: "Clausura, cierre o estrella de Kleene", txt: "Función con dominio en 2^Σ* y rango en 2^Σ*. Dado L1, la operación \"L1 estrella\" da como resultado otro lenguaje formado por todas las potencias de base L1 y exponente i, <b>desde i igual a cero</b> hasta infinito. Φ* = Lλ y Lλ* = Lλ." },
        { def: "Clausura o estrella positiva", txt: "Dado L1, la operación \"L1 estrella positiva\" da como resultado otro lenguaje formado por todas las potencias de base L1 y exponente i, <b>desde i igual a uno</b> hasta infinito. Φ⁺ = Φ y Lλ⁺ = Lλ. Si λ ∈ L, entonces L⁺ = L*." },
        { def: "Inversa", txt: "Da como resultado otro lenguaje formado por todas las inversas de las palabras de L1. (L1.L2)⁻¹ = L2⁻¹.L1⁻¹." },
        { table: { h: ["Operación", "Asociativa", "Conmutativa", "Neutro"], r: [["Unión", "sí", "sí", "Φ"], ["Diferencia", "no", "no", "Φ (a derecha)"], ["Intersección", "sí", "sí", "Σ*"], ["Producto", "sí", "no", "Lλ"]] } },
        { ex: "Truco para acotar longitudes", b: [
          { p: "Si se agrega λ a un lenguaje, la potencia n ya contiene todas las potencias menores: (L ∪ Lλ)ⁿ = L⁰ ∪ L¹ ∪ … ∪ Lⁿ." },
          { f: "Identificador = (Letras ∪ Guión) . (Letras ∪ Dígitos ∪ Guión)*\nIdentificador de hasta 40 = (Letras ∪ Guión) . (Letras ∪ Dígitos ∪ Guión ∪ Lλ)^39" },
          { p: "Cuando los componentes tienen longitud variable (nombres y apellidos de hasta 45 símbolos) no alcanza con la potencia: se plantea el lenguaje sin límite y se lo <b>intersecta</b> con (unisimbólicos ∪ Lλ)^45." },
          { f: "N = MAY . MIN⁺        NYA = N . (E . N)⁺\nNYA40 = NYA ∩ (MAY ∪ MIN ∪ E ∪ Lλ)^40" }
        ] },
        { ex: "Ejercicio 1.3 a) de clase · enteros con punto de miles, sin ceros no significativos", b: [{ f: "N = {1,…,9}   Z = {0}   P = {.}\nE = Z ∪ (N ∪ N.(N∪Z) ∪ N.(N∪Z)²) . (P.(N∪Z)³)*" }] }
      ] },
      { id: "gramaticas", title: "Gramáticas estructuradas por frases", blocks: [
        { p: "Un lenguaje se puede describir por <b>extensión</b> (listado), por <b>comprensión</b> (atributos, por ejemplo { w / |w| = 50 }) o por <b>patrones</b> ({ 0.1ⁿ.0 / n ≥ 1 }). Para lenguajes complejos conviene un conjunto de reglas de generación: una gramática." },
        { def: "Definición formal de una GRAMÁTICA estructurada por frases", txt: "G = ⟨ΣN, ΣT, P, S⟩ donde <b>ΣN</b> es el alfabeto de símbolos No-terminales o variables de la gramática; <b>ΣT</b> es el alfabeto de símbolos Terminales o símbolos del lenguaje; <b>P</b> es el conjunto finito no vacío de reglas de producción de la forma α → β, donde α = α1.N.α2 con α1, α2 ∈ Σ*, N ∈ ΣN y β ∈ Σ*; <b>S</b> es el Símbolo Inicial o Axioma, comienzo de cualquier proceso de derivación, S ∈ ΣN. Además Σ = ΣN ∪ ΣT y ΣN ∩ ΣT = Φ." },
        { note: "En el Tema C pidieron completar esta definición: ΣN es…, ΣT es…, α ∈ …, β ∈ …. Las respuestas: α ∈ Σ*.ΣN.Σ* (al menos un no terminal) y β ∈ Σ*." },
        { def: "Derivación", txt: "Proceso que parte del axioma y aplica reglas hasta llegar a una palabra: S ⇒ α1 ⇒ … ⇒ w, equivalente a S ⇒* w. ⇒ es derivación directa (una regla) y ⇒* derivación a la larga (una cantidad finita de reglas)." },
        { ul: ["<b>Forma sentencial:</b> cualquier secuencia γ que se obtenga a partir del axioma en un proceso de derivación.", "<b>Sentencia:</b> forma sentencial compuesta solo por símbolos terminales.", "<b>Derivación más a la izquierda / derecha:</b> según desde dónde se busca la subsecuencia a reemplazar.", "<b>L(G) = { w / w ∈ ΣT* ∧ S ⇒* w }</b>", "<b>Equivalencia:</b> G ≡ G' ⇔ L(G) = L(G'). En general cada lenguaje tiene varias gramáticas equivalentes."] },
        { ex: "Gramática de un subconjunto del español · derivación más a la izquierda de \"María corre.\"", b: [
          { f: "⟨frase⟩ → ⟨sujeto⟩ ⟨predicado⟩ ⟨punto⟩\n⟨sujeto⟩ → ⟨artículo⟩ ⟨sustantivo⟩\n⟨artículo⟩ → El | La | λ\n⟨predicado⟩ → ⟨verbo⟩ ⟨objeto⟩\n⟨objeto⟩ → ⟨preposición⟩ ⟨sujeto⟩ | ⟨adverbio⟩ | λ" },
          { tree: "frase( sujeto( artículo(λ) sustantivo(María) ) predicado( verbo(corre) objeto(λ) ) punto(•) )", gx: 58, cap: "La gramática describe la sintaxis, no la semántica: también genera \"La nave corre con el perro\"." }
        ] },
        { ex: "G2 = ⟨{S,X,Y,Z}, {x,y,z}, {S → XSZ | Y, Y → yY | λ, X → x, Z → z}, S⟩", b: [
          { p: "Derivación más a la derecha: S ⇒ XSZ ⇒ XSz ⇒ XYz ⇒ XyYz ⇒ Xyz ⇒ xyz. Lenguaje: L(G2) = { xⁿ yᵏ zⁿ / n ≥ 0, k ≥ 0 }." },
          { tree: "S( X(x) S( Y( y Y(λ) ) ) Z(z) )", cap: "Árbol de derivación de xyz en G2." }
        ] }
      ] },
      { id: "chomsky", title: "Jerarquía de Chomsky", blocks: [
        { table: { h: ["Tipo", "Gramática", "Lenguaje", "Nivel", "Modelo aceptor", "Forma de las reglas"], r: [
          ["0", "Irrestricta (GI)", "Recursivamente enumerable", "Pragmático", "Máquina de Turing", "α → β con al menos un N en α"],
          ["1", "Dependiente del contexto (GDC)", "Dependiente del contexto", "Semántico", "Autómata Linealmente Limitado", "|α| ≤ |β| (sin compresoras); S → λ si S no está a la derecha"],
          ["2", "Independiente del contexto (GIC)", "Independiente del contexto", "Sintáctico", "Autómata de Pila", "|α| = 1: N → β"],
          ["3", "Regular (GR)", "Regular", "Léxico", "Autómata Finito", "N → wN | w (por derecha) o N → Nw | w (por izquierda)"]] } },
        { html: chomskyNest },
        { def: "Tipo 0 · Irrestricta", txt: "Gramática estructurada por frases sin ninguna restricción: en la parte izquierda al menos un no terminal y en la derecha cualquier secuencia, inclusive vacía. Ejemplo: L(G) = { ww / w ∈ ΣT* }." },
        { def: "Tipo 1 · Dependiente del contexto", txt: "Sus reglas se restringen en la longitud de su parte derecha, que no puede ser menor que la de la parte izquierda, o sea <b>no tienen reglas compresoras</b>, excepto S → λ siempre que S no figure a la derecha de ninguna regla. Ejemplo: { aⁿbⁿcⁿ / n ≥ 1 }." },
        { def: "Tipo 2 · Independiente del contexto", txt: "Sus reglas se restringen en la longitud de su parte izquierda, que debe ser igual a 1: un no terminal a la izquierda y cualquier secuencia a la derecha. Ejemplo: S → aSb | ab genera { aⁿbⁿ / n ≥ 1 }." },
        { def: "Tipo 3 · Regular", txt: "Parte izquierda de longitud 1 y parte derecha con una secuencia de terminales con un no terminal como sufijo (GR por derecha), como prefijo (GR por izquierda) o solo terminales. Existe equivalencia entre ambas formas." },
        { ex: "Cómo identifico el tipo de una gramática (diagrama de la cátedra)", b: [{ ol: [
          "¿Todas las reglas tienen la forma N → wN | w, o todas la forma N → Nw | w? → <b>Tipo 3</b>.",
          "Si no: ¿todas las reglas cumplen |α| = 1 (contexto vacío a la izquierda)? → <b>Tipo 2</b>.",
          "Si no: ¿todas cumplen |α| ≤ |β|, o sea sin reglas compresoras? → <b>Tipo 1</b>.",
          "Si no → <b>Tipo 0</b>." ] }, { note: "Siempre se pide <b>el mayor tipo</b> (el más restringido) que cumpla todas las reglas. Una sola regla compresora la manda a tipo 0. Mezclar reglas regulares por derecha y por izquierda la saca de tipo 3." }] },
        { ex: "Ejemplos resueltos en clase (ejercicio 1.5)", b: [{ table: { h: ["Reglas", "Tipo", "Justificación", "Lenguaje"], r: [
          ["S → SXb · X → aX · aaXb → aab · SX → a", "0", "Contexto en reglas 3 y 4, que además son compresoras", "Empiezan con a, terminan con b, sin b consecutivas…"],
          ["S → aXY | λ · X → aXb | b · Y → bYc | bc", "2", "Contexto vacío a la izquierda; no cumple forma regular", "{λ} ∪ { aⁿ bⁿ⁺ᵏ cᵏ / n ≥ 1, k ≥ 1 }"],
          ["S → aS | bX | cZ | b | c | λ · X → bX | cZ | b | c · Z → cZ | c", "3", "Todas N → wN o N → w", "{ aⁿ bᵐ cᵖ / n, m, p ≥ 0 }"],
          ["S → xBSz · S → xyz · Bx → xB · By → yy", "1", "Hay contexto pero no hay reglas compresoras", "{ xⁿ yⁿ zⁿ / n > 0 }"],
          ["S → XC · X → aY | ab · Y → Xb · C → CC | c", "2", "Contexto vacío; S → XC y C → CC no son regulares", "{ aⁿ bⁿ cᵐ / n > 0, m > 0 }"],
          ["S → ASB · AAS → CCBB · A → aa · B → b · C → c", "1", "Contexto en AAS → CCBB, sin compresoras", "{ a^2(n−2) c² b^(n+2) / n ≥ 2 }"]] } }] }
      ] },
      { id: "lp", title: "Gramática de un lenguaje de programación hipotético", blocks: [
        { p: "Terminales: palabras clave (if, while, break, else, then, do), tipos (int, float, boolean, char), id, entero, real, literal, falso, cierto, delimitadores { } ; [ ] y operadores = + &lt; or. No terminales: P (programa, axioma), D, T, A, E, S, W, I, R." },
        { f: "1) P → D ; { S }\n2) D → D ; D | T id A\n3) T → int | float | boolean | char\n4) A → [ entero ] | λ\n5) E → entero | real | falso | cierto | literal | id | id[E] | E + E | E < E | E or E\n6) S → S ; S | W | break | I | id = E | id[E] = E\n7) W → while E do { S }\n8) I → if E then { S } R\n9) R → else { S } | λ" },
        { p: "Genera <code>int id ; { id = entero }</code> y también programas de semántica dudosa como <code>boolean id ; { id = entero }</code>: la gramática representa la <b>sintaxis</b>, no la semántica." },
        { ex: "Gramáticas de componentes léxicos", b: [{ f: "Identificadores:  I → LR | GR   L → a|…|z   D → 0|…|9   R → LR | DR | GR | λ   G → _\nNaturales con 0:  N → 0 | UR   R → DR | λ   D → 0 | U   U → 1|…|9" }] }
      ] },
      { id: "compilacion", title: "Proceso de compilación", blocks: [
        { def: "Traductor", txt: "Programa que traduce o convierte desde un texto o programa escrito en un lenguaje fuente hasta un texto o programa equivalente escrito en un lenguaje destino produciendo, si cabe, mensajes de error." },
        { table: { h: ["Traductor", "Qué hace", "Ejemplo"], r: [
          ["Preprocesador", "Modifica el fuente antes de la compilación con macros y directivas (#include, #define, #ifndef)", "cpp de C"],
          ["Compilador", "Traduce de un lenguaje de alto nivel a código máquina; en general genera un fichero objeto con código y tabla de símbolos", "C++, Delphi"],
          ["Intérprete", "Traduce sentencia por sentencia y la ejecuta sin guardar el código máquina", "Lisp, Snobol"],
          ["Pseudo intérprete", "Pseudocompila a un pseudoejecutable que interpreta un motor de ejecución", "Java"],
          ["Intérprete de comandos", "Traduce sentencias simples a invocaciones de programas de una biblioteca", "Shell de Unix, copy en MS-DOS"],
          ["Ensamblador", "Compilador sencillo: correspondencia uno a uno entre instrucciones ensamblador y máquina", "MOV AH,09h"],
          ["Transpilador", "Fuente a fuente, de un LAN a otro, para portabilidad", "Java → C++"],
          ["Traductor de idiomas", "Entre lenguajes naturales", "Traductor de Google"]] } },
        { p: "Fases para ejecutar un programa de alto nivel: <b>compilación</b> (genera el objeto), <b>enlace</b> (el enlazador une los módulos, estructura la memoria de variables y agrega rutinas de librerías y del S.O.) y <b>carga</b> (el cargador, parte del S.O., ubica los segmentos y convierte direcciones relativas en absolutas sumando la dirección base)." },
        { html: pipeline },
        { ex: "posición = inicial + velocidad * 60 (las tres variables son float)", b: [{ table: { mono: true, h: ["Etapa", "Salida"], r: [
          ["Scanner", "id1 = id2 + id3 * nument"],
          ["Parser (prefija)", "= id1 + id2 * id3 nument"],
          ["Semántico", "= id1 + id2 * id3 entareal(nument)"],
          ["Código intermedio", "temp1 = entareal(60) · temp2 = id3 * temp1 · temp3 = id2 + temp2 · id1 = temp3"],
          ["Optimización", "temp1 = id3 * 60.0 · id1 = id2 + temp1"],
          ["Generación", "MOVF id3,R2 · MULF #60.0,R2 · MOVF id2,R1 · ADDF R2,R1 · MOVF R1,id1"]] } },
          { tree: "=( id1 +( id2 *( id3 entareal(60) ) ) )", cap: "Árbol semántico: la conversión de tipo entareal se agrega en el análisis semántico." }] },
        { ex: "Actividad de laboratorio · proceso de compilación con GCC", b: [
          { table: { mono: true, h: ["Comando", "Resultado"], r: [["gcc -E prog.c -o prog.txt", "Solo preprocesa: expande #include y reemplaza macros #define"], ["gcc -S prog.c", "Genera el ensamblador prog.s (sintaxis AT&T)"], ["gcc -c prog.c", "Genera el objeto prog.o"], ["gcc prog.c -o prog", "Compila y enlaza el ejecutable"]] } },
          { p: "En el ensamblado de GNU as los registros llevan prefijo % y los inmediatos $; los sufijos b, w, l, q indican 8, 16, 32 y 64 bits. Directivas: <code>.file .text .data .globl .align .long .def/.endef .scl .type</code>. Las variables globales van a la sección de datos; las locales y parámetros a la pila (offsets sobre %esp o %ebp)." },
          { p: "Con <code>#include &lt;stdio.h&gt;</code> o sin él, el .s queda igual: las bibliotecas se agregan recién en el <b>enlazado</b>. Sin el include solo aparece un warning de declaración implícita." }
        ] }
      ] }
    ],
    tp: { n: 1, title: "Lingüística matemática", clase: [
      { id: "1.2", txt: "<p>Σ = {0, 1, a, b}, L1 = {a, b}, L2 = {λ, 0, 1}. Resolver e indicar cardinalidad.</p>", sol: [{ table: { mono: true, h: ["Op.", "Resultado", "Card."], r: [["L2.L1", "{a, b, 0a, 0b, 1a, 1b}", "6"], ["L2²", "{λ, 0, 1, 00, 01, 10, 11}", "7"], ["L1⁺", "secuencias de a y b de long ≥ 1", "∞"], ["L2⁺", "secuencias de 0 y 1 incluida λ (= L2*)", "∞"], ["(L1 ∪ L2)¹⁰", "secuencias de a, b, 0, 1 de long ≤ 10, incluida λ", "finito"], ["L1* ∩ L2⁺", "{λ}", "1"], ["L1⁺ ∩ L2*", "Φ", "0"], ["L1⁺ − (L1²)*", "secuencias de a y b de longitud impar", "∞"], ["(L2.L1)⁺", "secuencias sin dos números consecutivos que terminan en letra", "∞"]] } }] },
      { id: "1.4", txt: "<p>Gramáticas para: a) secuencias de cinco dígitos; b) sus palíndromos; c) secuencias de {a,b} sin dos a consecutivas; d) naturales impares sin ceros no significativos.</p>", sol: [{ f: "a) S → AAAAA      A → 0|1|…|9\nb) S → 0A0|…|9A9   A → 0B0|…|9B9   B → 0|…|9\nc) S → abS | bS | a | λ\nd) S → 1Y|2X|3Y|…|9Y   X → 1Y|2X|…|9Y|0X   Y → 1Y|2X|…|9Y|0X|λ" }] }
    ], alumnos: [
      { id: "2.1", tag: "operaciones con palabras", txt: "<p>Sean x = 111, y = 211, z = 10 palabras sobre Σ = {1, 2, 10}. Completar el cuadro con la definición o el resultado: y², (yz)², z⁻¹y², xy, ? → λ, ? → 111112111, (xy)⁻¹, |(yz)²|, ? → 11121110, (xz)⁻¹, ? → 5, |y²z³|, ? → 1010, |(zx)⁴|₁, |(yx)ⁿ|₁.</p>", sug: 1, sol: [
        { note: "10 es <b>un solo símbolo</b>. Las longitudes se cuentan en símbolos: |z| = 1, |y| = 3." },
        { table: { mono: true, h: ["Definición", "Resultado"], r: [["y²", "211211"], ["(yz)²", "2111021110"], ["z⁻¹y²", "10211211 (z⁻¹ = 10)"], ["xy", "111211"], ["x⁰ (o cualquier potencia 0)", "λ"], ["x.y⁻¹.x", "111112111"], ["(xy)⁻¹", "112111"], ["|(yz)²|", "8"], ["x.y.z", "11121110"], ["(xz)⁻¹", "10111"], ["|xy|₁", "5"], ["|y²z³|", "9"], ["z²", "1010"], ["|(zx)⁴|₁", "12"], ["|(yx)ⁿ|₁", "5n"]] } }] },
      { id: "2.2", tag: "potencias de Σ", txt: "<p>Con Wₖ el conjunto de todas las palabras de longitud k sobre Σ = {a, b}, obtener a) W1, b) W3, c) W5, d) W0. e) ¿Cardinalidad de Wn? f) ¿Y para palabras de longitud n con m símbolos?</p>", sol: [{ ul: ["W1 = {a, b}", "W3 = {aaa, aab, aba, abb, baa, bab, bba, bbb}", "W5 = las 32 secuencias de a y b de longitud 5", "W0 = {λ}", "|Wn| = 2ⁿ", "Con m símbolos: mⁿ"] }] },
      { id: "2.3", tag: "operaciones con lenguajes", txt: "<p>L1 = {a, ba}, L2 = {a, b, ba}, L3 = {a, b}, L4 = {a, ab}, L5 = {b, λ} sobre Σ = {a, b}. Resolver, indicar cardinalidad y describir con palabras los infinitos: a) L1⁺ b) L2³ c) L2* d) (L4*)⁻¹ e) L5¹⁰ f) ~(L5² ∪ L2) g) L2* − (L1*.L5) h) (L3 ∪ L5)ⁿ i) L5⁺ ∩ ~L2* j) ~(L3⁺ ∪ L2⁺) k) L1²⁰ l) ~L1* m) L5.L4⁺ n) L4* − L1⁺ o) (L3²)⁺ p) (L3.L5⁺)⁻¹</p>", sug: 1, sol: [{ table: { h: ["", "Resultado", "Card."], r: [
        ["a", "Secuencias no vacías que terminan en a y donde toda b va seguida de a", "∞"], ["b", "26 palabras de longitud 3 a 6 (aaa, aab, …, bababa)", "26"], ["c", "Σ*: todas las secuencias de a y b, con λ (porque a, b ∈ L2)", "∞"],
        ["d", "{a, ba}*: λ o secuencias donde toda b va seguida de a", "∞"], ["e", "{λ, b, bb, …, b¹⁰}", "11"], ["f", "Todas las secuencias excepto λ, a, b, ba y bb", "∞"],
        ["g", "Secuencias que contienen bb (L1*.L5 son las que no tienen b consecutivas)", "∞"], ["h", "Secuencias de a y b de longitud ≤ n, con λ", "2ⁿ⁺¹ − 1"], ["i", "Φ (L2* = Σ*)", "0"],
        ["j", "{λ}", "1"], ["k", "Concatenaciones de 20 bloques a o ba (todas distintas)", "2²⁰"], ["l", "Secuencias con alguna b que no va seguida de a (contienen bb o terminan en b)", "∞"],
        ["m", "Secuencias con al menos una a y sin b consecutivas", "∞"], ["n", "{λ} ∪ secuencias que empiezan con a, terminan con b y no tienen b consecutivas", "∞"], ["o", "Secuencias de longitud par ≥ 2", "∞"], ["p", "{bⁿa / n ≥ 0} ∪ {bⁿ / n ≥ 1}", "∞"]] } }] },
      { id: "2.4", tag: "operaciones combinadas", txt: "<p>L1 = {a, b}, L2 = {aa, ba}, L3 = {λ, 1, 2}, L4 = {a, 2}, L5 = {b, λ} sobre Σ = {a, b, 1, 2}. Encontrar operaciones que den: a) Φ b) {λ} c) {bb} d) {a, b, ba, bb} e) {aa, aa1, aa2, ab, ab1, ab2} f) secuencias de letras de long ≥ 0 g) letras de long 10 h) números de long &lt; 10 i) letras de long &gt; 10 j) letras de long impar k) letras de long par que terminan en a l) long par no múltiplo de 3 m) al menos una letra n) empiezan con letra sin números consecutivos o) empiezan y terminan con letra sin números consecutivos.</p>", sug: 1, sol: [{ f: "a) L1 ∩ L3                 b) L3 ∩ L5                c) L5² − L5\nd) L5 . L1                 e) L2⁻¹ . L3              f) L1*\ng) L1¹⁰                    h) L3⁹                    i) L1¹¹ . L1*\nj) L1 . (L1²)*             k) L1.(L1²)*.(L1 ∩ L4)\nSea A = (L1 ∪ L3) − (L3 ∩ L5) = {a,b,1,2} y D = L3 − L5 = {1,2}\nl) (A²)* − (A⁶)*           m) A* . L1 . A*\nn) L1 . (L3 . L1)* . L3    o) L1 . (L3 . L1)*" }, { p: "Hay muchas respuestas válidas: verificá la tuya con dos o tres palabras de ejemplo y con una que no debería estar." }] },
      { id: "2.5", tag: "elegir operaciones", txt: "<p>Σ = {a, b, 0, 1}, L1 = {a, b}, L2 = {λ, 1, 0}, L3 = {a, ab}, L4 = {01, 10}. Determinar qué operaciones de la tabla dan cada lenguaje: {aa, baa, ab, bab}; secuencias sin letras; long &lt; 8 con 0 y 1; long &gt; 8 con 0 y 1; long = 8 con 0 y 1; dos o más letras que empiezan con a sin b consecutivas; long impar con a, b; al menos una letra.</p>", sol: [{ table: { h: ["Lenguaje", "Operaciones correctas"], r: [
        ["{aa, baa, ab, bab}", "L3⁻¹.L1 y (L1.L3)⁻¹"], ["Sin letras", "L2⁺, (L2²)⁺, L2*, (L2*)³ (todas: λ ∈ L2)"], ["Long &lt; 8 con 0 y 1", "L2⁷ y L2⁷ ∪ L2⁶"], ["Long &gt; 8 con 0 y 1", "L2* − L2⁸"],
        ["Long = 8 con 0 y 1", "L2⁸ − L2⁷ y (L2 − L1*)⁸"], ["Dos o más letras, empiezan con a, sin bb", "L3⁺ − L1"], ["Long impar con a, b", "(L1²)*.L1, L1⁺ − (L1²)⁺, L1* − (L1²)*"], ["Al menos una letra", "~(L2)*"]] } }, { note: "Verificado por fuerza bruta hasta longitud 6." }] },
      { id: "2.6", tag: "potencias", txt: "<p>Sea L = {λ, x}. Obtener Lⁿ para n = 0, 1, 2, 3. ¿Cuántos elementos tiene Lⁿ? ¿Cuáles son sus palabras?</p>", sol: [{ f: "L⁰ = {λ}   L¹ = {λ, x}   L² = {λ, x, xx}   L³ = {λ, x, xx, xxx}\nLⁿ = {xᵏ / 0 ≤ k ≤ n}  →  |Lⁿ| = n + 1" }] },
      { id: "2.7", tag: "palíndromos", txt: "<p>Sea Σ = {a, o, m, r, ba, bo, le, li, te, se, re}. Encontrar los palíndromos de Σ* que sean palabras válidas del castellano, de longitud 1, 2 y 3.</p>", sug: 1, sol: [{ p: "La longitud se cuenta en <b>símbolos</b> del alfabeto, por eso todo símbolo solo es palíndromo." }, { ul: ["Longitud 1: a, o, le, te, se, re", "Longitud 2: ba.ba = baba, bo.bo = bobo", "Longitud 3: a.m.a = ama, a.r.a = ara, o.r.o = oro, a.le.a = alea, a.se.a = asea, a.te.a = atea, a.re.a = area, a.li.a = alia, o.le.o = oleo, o.re.o = oreo, ba.r.ba = barba"] }, { note: "Ignorando tildes. La lista depende del diccionario que acepte la cátedra." }] },
      { id: "2.8", tag: "expresiones con L", txt: "<p>Con L = {a, b}, definir con expresiones de L los lenguajes de palabras de: a) longitud impar; b) longitud par que no sea múltiplo de 3; c) longitud múltiplo de 3 o de 5; d) longitud que no sea múltiplo de 5 ni de 7.</p>", sol: [{ f: "a) L . (L²)*\nb) (L²)* − (L⁶)*\nc) (L³)* ∪ (L⁵)*\nd) L* − ((L⁵)* ∪ (L⁷)*)" }] },
      { id: "2.9", tag: "lenguajes de datos", txt: "<p>Definir alfabeto, lenguajes base y operaciones para: a) código de producto N-F (N de 1 a 3 dígitos, F de 2 a 5 mayúsculas); b) precio E.D (E entero sin signo de hasta 6 dígitos, D dos dígitos); c) patente de vehículo en sus dos formatos; d) correo electrónico; e) CUIL.</p>", sug: 1, sol: [{ f: "D = {0,…,9}  N = {1,…,9}  Z = {0}  M = {A,…,Z}  m = {a,…,z}\nG = {-}  P = {.}  E = {□}  R = {@}  U = {_}\na) D.(D ∪ Lλ)² . G . M² . (M ∪ Lλ)³\nb) (Z ∪ N.(D ∪ Lλ)⁵) . P . D²\nc) M³.E.D³  ∪  M².E.D³.E.M²          (AAA 999 y AA 999 AA)\nd) (m∪D).(m∪D∪P∪U∪G)* . R . (m∪D∪G)⁺ . (P.(m∪D∪G)⁺)* . P . m² . m*\ne) {20, 23, 24, 27} . G . D⁸ . G . D" }] },
      { id: "2.10", tag: "diseño de gramáticas", txt: "<p>Gramáticas sobre Σ = {a, b} y cuatro derivaciones de distinta longitud para: a) longitud impar; b) exactamente tres a; c) palíndromos de longitud par que empiezan con b; d) sin b consecutivas; e) al menos dos a consecutivas; f) cantidad par de a e impar de b; g) aⁿbⁿ, n ≥ 0; h) números reales sin ceros no significativos con Σ = {0,…,9, −, +, •}.</p>", sug: 1, sol: [{ f: "a) S → aA | bA | a | b        A → aS | bS\nb) S → bS | aA   A → bA | aB   B → bB | aC   C → bC | λ\nc) S → bAb      A → aAa | bAb | λ\nd) S → aS | bA | λ             A → aS | λ\ne) S → aS | bS | aaA           A → aA | bA | λ\nf) S → aA | bB   A → aS | bC   B → aC | bS | λ   C → aB | bA\n   (S: a par b par · A: a impar · B: b impar · C: ambas impares)\ng) S → aSb | λ\nh) S → +E | -E | E    E → 0 | 0P | UR    R → DR | P | λ\n   P → •F    F → DF | U    D → 0 | U    U → 1 | … | 9" }, { p: "Ejemplo b): S ⇒ bS ⇒ baA ⇒ baaB ⇒ baabB ⇒ baabaC ⇒ baaba." }] },
      { id: "2.11", tag: "jerarquía de Chomsky", txt: "<p>Para cada conjunto de producciones: formalizar, indicar el mayor tipo justificando, obtener 3 palabras de longitud &gt; 4 y enunciar el lenguaje.</p><p>a) S → Sxx | By · A → Azz | zz · B → By | A<br>b) S → aDS | a · aD → Da · Da → aD · aDa → aya · DD → D<br>c) S → SRW | a · WR → RW · baa → λ · Y → b · R → aba<br>d) S → HL | MN | 0 · N → HL | MN | 0 · M → 1 · H → 0 · L → HN | ML | 1<br>e) S → 0Xx | 0x · X → YXx · X → 00 · YX → XYY · YYx → 0xx<br>f) S → bSE | xSE · S → xR | bT | 1Q · E → x | b | 1 · R → b · Q → 1 · T → x<br>g) S → wV | bX · V → wS | bZ | b · X → wZ | bS | w · Z → wX | bV<br>h) S → ASB | y · Ay → yA · A → x · B → y<br>i) S → 0QC | xS | cS | λ · QC → 0xB | xQC | cQC · xB → 0S | xxB | cxB<br>j) S → aZ · X → bX | b · Z → aX | Sc<br>k) S → Sa | Xaaa · X → Yb | Ybb | Y · Y → Ycc | λ<br>l) S → ASB | AB · BB → B · A → x · B → y</p>", sug: 1, sol: [{ table: { h: ["", "Tipo", "Justificación", "Lenguaje"], r: [
        ["a", "3", "Todas N → Nw o N → w (regular por izquierda)", "{ z²ⁿ yᵐ x²ᵏ / n ≥ 1, m ≥ 1, k ≥ 0 }"],
        ["b", "0", "DD → D es compresora", "{a} ∪ secuencias de a e y que empiezan y terminan con a, sin y consecutivas, con al menos una y"],
        ["c", "0", "baa → λ es compresora", "{ a } (W nunca desaparece)"],
        ["d", "2", "Parte izquierda de longitud 1; S → HL no es regular (está en FNC)", "Secuencias de 0 y 1 con cantidad impar de 0"],
        ["e", "1", "Hay contexto (YX, YYx) y ninguna regla es compresora", "{0x, 000x} ∪ { 0⁴x²(0x²)ⁿx / n ≥ 0 }"],
        ["f", "2", "S → bSE no es regular", "{ w c v / w ∈ {b,x}ⁿ, c ∈ {xb, bx, 11}, v ∈ {x,b,1}ⁿ, n ≥ 0 }"],
        ["g", "3", "Regular por derecha", "Secuencias de w y b con cantidad impar de w y cantidad impar de b"],
        ["h", "1", "Ay → yA tiene contexto y no es compresora", "{ w ∈ {x,y}* / |w|y = |w|x + 1 }"],
        ["i", "0", "S → λ con S a la derecha (xB → 0S, S → xS) rompe la excepción de tipo 1", "{ w ∈ {0,x,c}* / |w|₀ múltiplo de 3 }"],
        ["j", "2", "Mezcla Z → Sc (izquierda) con S → aZ (derecha)", "{ aᵏ⁺² bᵐ cᵏ / k ≥ 0, m ≥ 1 }"],
        ["k", "3", "Regular por izquierda (con reglas unitarias y de borrado)", "{ c²ⁿ bᵐ aᵏ / n ≥ 0, 0 ≤ m ≤ 2, k ≥ 3 }"],
        ["l", "0", "BB → B es compresora", "{ xⁿ yᵐ / n ≥ 1, 1 ≤ m ≤ n }"]] } }, { note: "Lenguajes verificados generando todas las palabras cortas con un programa. En e) y b) la descripción es la sugerida; justificá con derivaciones." }] }
    ] },
    control: [
      { t: "vf", kind: "teoría", q: "Es lo mismo el lenguaje vacío que el lenguaje que contiene solamente la palabra vacía.", a: false, why: "Φ = { } no tiene elementos; Lλ = {λ} tiene uno." },
      { t: "vf", kind: "teoría", q: "La ESTRELLA DE KLEENE de un lenguaje da como resultado otro lenguaje formado por todas las potencias de base L1 y exponente i, desde i igual a uno hasta infinito.", a: false, why: "La de Kleene arranca en i = 0. La que arranca en i = 1 es la estrella positiva." },
      { t: "vf", kind: "teoría", q: "El nivel sintáctico es independiente del contexto, tanto en los lenguajes naturales como en los formales.", a: true, why: "Así lo define la cátedra: sin importar el significado, los componentes deben colocarse en un orden determinado." },
      { t: "vf", kind: "teoría", q: "El nivel semántico es la dimensión del lenguaje que trata sobre hechos o acciones que evocan las frases.", a: false, why: "Esa es la definición del nivel pragmático. El semántico analiza el significado de los componentes y de las frases." },
      { t: "vf", kind: "teoría", q: "Un alfabeto es un conjunto finito no vacío de símbolos diferentes.", a: true },
      { t: "vf", kind: "teoría", q: "La concatenación de palabras es conmutativa y tiene como elemento neutro a λ.", a: false, why: "Tiene neutro λ, pero no es conmutativa: en general u.v ≠ v.u." },
      { t: "vf", kind: "teoría", q: "Si un lenguaje contiene la palabra vacía, las operaciones estrella positiva y de Kleene son iguales.", a: true, why: "Si λ ∈ L, entonces L¹ ya aporta λ y L⁺ = L*." },
      { t: "vf", kind: "teoría", q: "Las gramáticas de tipo 1 pueden tener reglas compresoras siempre que la parte izquierda tenga contexto.", a: false, why: "Tipo 1 no admite reglas compresoras (|α| ≤ |β|), salvo S → λ con S fuera de las partes derechas." },
      { t: "match", kind: "teoría", q: "Emparejá cada gramática con su lenguaje y modelo matemático.", opts: ["Máquina de Turing", "Autómata Linealmente Limitado", "Autómata de Pila", "Autómata Finito"], items: [["Tipo 0 · Irrestricta", "Máquina de Turing"], ["Tipo 1 · Dependiente del contexto", "Autómata Linealmente Limitado"], ["Tipo 2 · Independiente del contexto", "Autómata de Pila"], ["Tipo 3 · Regular", "Autómata Finito"]] },
      { t: "match", kind: "teoría", q: "Emparejá cada sentencia en C con el nivel de su error.", opts: ["Léxico", "Sintáctico", "Semántico", "Pragmático"], items: [["<code>int 2num = 5;</code>", "Léxico"], ["<code>x = (a + b;</code>", "Sintáctico"], ["<code>int n; char c[10]; n = c;</code>", "Semántico"], ["<code>int d = 0; r = 10 / d;</code>", "Pragmático"]] },
      { t: "match", kind: "teoría", q: "Clasificá cada componente del compilador en la fase de ANÁLISIS o de SÍNTESIS.", opts: ["Análisis", "Síntesis"], items: [["Scanner", "Análisis"], ["Parser", "Análisis"], ["Verificación semántica", "Análisis"], ["Generación de código intermedio", "Síntesis"], ["Optimización de código intermedio", "Síntesis"], ["Generación de código de máquina", "Síntesis"]] },
      { t: "fill", kind: "teoría", q: "Completá la definición formal G = ⟨ΣN, ΣT, P, S⟩. En las reglas α → β:", blanks: [{ k: "α ∈", a: ["Σ*.ΣN.Σ*", "Σ* ΣN Σ*", "Σ*ΣNΣ*", "(ΣN ∪ ΣT)*.ΣN.(ΣN ∪ ΣT)*"] }, { k: "β ∈", a: ["Σ*", "(ΣN ∪ ΣT)*", "(ΣN∪ΣT)*"] }], why: "α = α1.N.α2 con α1, α2 ∈ Σ* y N ∈ ΣN. Σ = ΣN ∪ ΣT." },
      { t: "x", kind: "teoría", q: "Marcá con X los traductores que NO generan un fichero con el código máquina completo antes de ejecutar.", o: ["Intérprete", "Compilador", "Ensamblador", "Intérprete de comandos", "Pseudo intérprete (el motor interpreta el pseudoejecutable)"], a: [0, 3, 4], why: "El intérprete ejecuta sentencia por sentencia sin guardar el código; el de comandos invoca programas; el pseudo intérprete genera un pseudoejecutable que se interpreta." },
      { t: "mc", kind: "práctica", q: "Con L1 = {a, b} y L2 = {λ, 0, 1}, ¿cuál es la cardinalidad de L2.L1?", o: ["6", "5", "4", "9"], a: 0, why: "{a, b, 0a, 0b, 1a, 1b}: λ.a = a y λ.b = b." },
      { t: "mc", kind: "práctica", q: "¿Cuál es el mayor tipo de la gramática S → aSb | ab?", o: ["Tipo 2", "Tipo 3", "Tipo 1", "Tipo 0"], a: 0, why: "Parte izquierda de longitud 1, pero aSb no tiene el no terminal como prefijo ni sufijo." },
      { t: "mc", kind: "práctica", q: "¿Cuál es el mayor tipo de S → xBSz | xyz · Bx → xB · By → yy?", o: ["Tipo 1", "Tipo 0", "Tipo 2", "Tipo 3"], a: 0, why: "Hay reglas con contexto (Bx, By) pero ninguna compresora." },
      { t: "mc", kind: "práctica", q: "Sea x = abbcb. ¿Cuál es (x²)⁻¹?", o: ["bcbbabcbba", "abbcbabbcb", "bcbbaabbcb", "bcbbabbcba"], a: 0 },
      { t: "mc", kind: "práctica", q: "Con L1 = {a, b}, ¿qué expresión da todas las secuencias de a y b de longitud impar?", o: ["L1.(L1²)*", "L1* − (L1²)⁺", "(L1²)⁺.L1", "L1* − L1²"], a: 0, why: "L1* − (L1²)⁺ incluye λ, que tiene longitud par (0). (L1²)⁺.L1 no incluye las de longitud 1. También valdría L1⁺ − (L1²)⁺." },
      { t: "mc", kind: "práctica", q: "¿Qué lenguaje genera S → aS | bX | cZ | b | c | λ · X → bX | cZ | b | c · Z → cZ | c?", o: ["{ aⁿ bᵐ cᵖ / n, m, p ≥ 0 }", "{ aⁿ bⁿ cⁿ / n ≥ 0 }", "{ aⁿ bᵐ cᵖ / n, m, p ≥ 1 }", "{ (abc)ⁿ / n ≥ 0 }"], a: 0 }
    ]
  });
})();
