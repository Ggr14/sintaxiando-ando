/* Unidad 4 · Lenguajes, Gramáticas y Modelos Generales */
(function () {
  var S = window.SSL.specs;
  function D(s) { var d = {}; s.split(";").forEach(function (p) { var x = p.split(",").map(function (t) { return t.trim(); }); (d[x[0]] = d[x[0]] || {})[x[1]] = [x[2], x[3], x[4]]; }); return d; }
  S.mtpal = { title: "MT de palíndromos sobre {a, b}", type: "mt", w: 660, h: 420, q0: "1", F: ["8"], r: 19,
    loops: { "2": "up", "4": "right", "5": "down", "7": "right" },
    states: [{ id: "1", x: 70, y: 210 }, { id: "2", x: 200, y: 90 }, { id: "3", x: 390, y: 90 }, { id: "4", x: 280, y: 160 }, { id: "5", x: 200, y: 330 }, { id: "6", x: 390, y: 330 }, { id: "7", x: 280, y: 260 }, { id: "8", x: 600, y: 210 }],
    delta: D("1,a,2,∆,D;1,b,5,∆,D;1,∆,8,∆,D;2,a,2,a,D;2,b,2,b,D;2,∆,3,∆,I;3,a,4,∆,I;3,∆,8,∆,D;4,a,4,a,I;4,b,4,b,I;4,∆,1,∆,D;5,a,5,a,D;5,b,5,b,D;5,∆,6,∆,I;6,b,7,∆,I;6,∆,8,∆,D;7,a,7,a,I;7,b,7,b,I;7,∆,1,∆,D"),
    bends: { "1>8": 0, "4>1": 0, "7>1": 0 } };
  S.mtinc = { title: "MT que incrementa un binario", type: "mt", w: 470, h: 170, q0: "1", F: ["3"], loops: { "1": "up", "2": "up" },
    states: [{ id: "1", x: 70, y: 110, label: "1" }, { id: "2", x: 240, y: 110 }, { id: "3", x: 400, y: 110 }],
    delta: D("1,0,1,0,D;1,1,1,1,D;1,∆,2,∆,I;2,1,2,0,I;2,0,3,1,N;2,∆,3,1,N") };
  S.mtadd = { title: "MT que suma dos unarios separados por +", type: "mt", w: 560, h: 160, q0: "1", F: ["4"], loops: { "1": "up", "2": "up" },
    states: [{ id: "1", x: 60, y: 100 }, { id: "2", x: 210, y: 100 }, { id: "3", x: 360, y: 100 }, { id: "4", x: 500, y: 100 }],
    delta: D("1,1,1,1,D;1,+,2,1,D;2,1,2,1,D;2,∆,3,∆,I;3,1,4,∆,N") };

  window.SSL.units.push({
    id: "u4", n: 4, parcial: 2, short: "MT y ALL", title: "Máquinas de Turing y modelos generales",
    summary: "Máquina de Turing y Autómata Linealmente Limitado, MT transformadoras y calculadoras, composición, variantes multicinta y multipista, comprobación de pertenencia, problema de la parada, decidibilidad y complejidad.",
    sections: [
      { id: "mt", title: "Máquina de Turing", blocks: [
        { p: "Concebida por Alan M. Turing en 1936 como modelo matemático abstracto que representa la solución de <b>cualquier problema algorítmico</b>, y en particular el reconocimiento de lenguajes de tipo 0. Tiene una cinta infinita en casilleros, un cabezal de lectura y escritura y un control." },
        { tape: { cells: ["∆", "∆", "a", "b", "a", "∆", "∆"], head: 2, q: "q0" }, cap: "Configuración inicial: la palabra rodeada de blancos y el cabezal sobre su primer símbolo." },
        { def: "Definición formal de una MÁQUINA DE TURING", txt: "MT = ⟨Q, ΣE, ΣA, q0, F, f⟩. Q: conjunto finito y no vacío de estados; ΣE: alfabeto de símbolos de entrada; ΣA: alfabeto de símbolos auxiliares (incluye a ∆); q0: estado inicial; F: conjunto de estados finales; f: función de transición f : (Q − F) × (ΣE ∪ ΣA) ⇒ Q × (ΣE ∪ ΣA) × {I, N, D}." },
        { ul: ["Funcionamiento: LEE un símbolo; según estado y símbolo ESCRIBE otro (puede ser el mismo), MUEVE el cabezal a la izquierda, a la derecha o no se mueve, y transiciona. Repite hasta un estado final (acepta) o un bloqueo (rechaza).", "El dominio no incluye a F: los estados finales son de parada.", "Σ* queda dividido en tres: palabras aceptadas, rechazadas y las que hacen que la MT <b>no se detenga</b>. Por eso el complemento de un LI no siempre tiene una MT que lo acepte.", "La MT es <b>determinista por naturaleza</b>: toda MT no determinista tiene una determinista equivalente."] },
        { def: "Configuración de una MT", tag: "Concepto", txt: "Lo que hay en la cinta antes del cabezal, seguido del estado y de lo que hay desde el cabezal, delimitado por blancos: ∆c1…ci−1 qk ci…cn∆. El operador ├─ es la transformación directa y ├─* varios pasos. L(MT) = { w / ∆q0w∆ ├─* ∆β1 qF β2∆ ∧ qF ∈ F }." },
        { fa: S.mtpal, cap: "MT de palíndromos: borra el primer símbolo, recuerda cuál era (rama 2-3-4 para a, 5-6-7 para b), va al final, compara y borra, y vuelve. Es determinista, mientras que el AP para el mismo lenguaje solo puede ser no determinista." },
        { sim: "mtpal" }
      ] },
      { id: "all", title: "Autómata linealmente limitado", blocks: [
        { p: "Es una MT con la cinta limitada a la longitud de la entrada. Acepta lenguajes de tipo 1 (dependientes del contexto)." },
        { tape: { cells: ["⟨", "a", "a", "b", "b", "⟩"], head: 1, q: "I" }, cap: "Los símbolos ⟨ y ⟩ se colocan automáticamente y el cabezal no puede pasarlos." },
        { def: "Definición formal de un ALL", txt: "ALL = ⟨Q, ΣE, ΣA, q0, F, f⟩ igual que la MT, pero ΣA incluye a ⟨ y ⟩, y para todo q ∈ (Q − F): f(q, ⟨) = (q', ⟨, D) y f(q, ⟩) = (q', ⟩, I). No se puede escribir sobre los límites ni pasarlos." },
        { ul: ["Σ* queda dividido en dos: aceptadas y rechazadas. Para todo LDC existe un ALL que lo acepta y rechaza su complemento: el problema siempre tiene solución.", "Algunos autores afirman que el ALL es determinista por naturaleza; otros lo ponen en duda. A los fines prácticos la cátedra asume que sí."] },
        { ex: "ALL de { aⁿbᵐ / n ≥ 1, m ≠ n } (ejercicio 2.1 a del TP4)", b: [{ ol: ["Verificar el formato a⁺b*: si solo hay a, aceptar (m = 0 ≠ n).", "Volver a ⟨ y marcar la primera a sin marcar con X.", "Ir a la derecha y marcar la primera b sin marcar con Y. Si se llega a ⟩ sin encontrarla, sobran a: aceptar.", "Volver a la última X y repetir. Si ya no quedan a, buscar una b sin marcar: si existe, sobran b: aceptar; si se llega a ⟩, n = m: rechazar."] }] }
      ] },
      { id: "transf", title: "MT transformadoras y calculadoras", blocks: [
        { p: "La MT es un modelo general de procesamiento: transforma una secuencia inicial (datos) en una final (resultado). La aceptación se interpreta como la <b>validación</b> de los datos de entrada." },
        { table: { mono: true, h: ["Decimal", "Unario"], r: [["0", "λ"], ["1", "1"], ["2", "11"], ["3", "111"]] } },
        { fa: S.mtadd, cap: "Suma unaria: cambia el + por 1, va al final y borra un 1." },
        { sim: "mtadd" },
        { fa: S.mtinc, cap: "Incremento binario: va al final y suma con acarreo hacia la izquierda; si desborda escribe un 1 adelante." },
        { sim: "mtinc" }
      ] },
      { id: "constr", title: "Construcción y variantes de MT", blocks: [
        { def: "Composición de MT", txt: "Dos MT sobre los mismos alfabetos y con estados disjuntos comparten la cinta: cuando una termina la otra comienza con la cinta y la posición que dejó la primera. MT3 = ⟨Q1 ∪ Q2, ΣE, ΣA, q01, F2, f3⟩, donde f3 copia f1, salvo que las transiciones hacia un final de MT1 se redirigen a q02, y copia f2." },
        { table: { h: ["Bloque", "Tarea"], r: [["M1", "Busca el primer blanco de la derecha"], ["M2", "Escribe una a en el casillero actual"], ["M3", "Mueve el cabezal un lugar a la izquierda"], ["M4", "Bifurca según lea a o b"], ["M5 = M1-M1-M2", "Escribe una a después del segundo blanco a la derecha"], ["M6 = M4-(M3 / M1)-M2", "Si empieza con b la cambia por a; si no, escribe una a después del primer blanco"]] } },
        { ul: ["<b>MT multicinta:</b> N cintas infinitas con N cabezales independientes, controlados por N funciones de transición.", "<b>MT multipista:</b> igual, pero todos los cabezales hacen el mismo movimiento.", "Para aⁿbⁿcⁿ la versión multicinta es más eficiente que la de una cinta."] }
      ] },
      { id: "decid", title: "Pertenencia, parada y decidibilidad", blocks: [
        { def: "Comprobación de pertenencia", txt: "Verificar si una palabra w está en el lenguaje que genera una gramática G. Siempre tiene solución para tipo 1 (y por jerarquía para tipo 2 y 3). Para tipo 0 no existe un algoritmo general, por la permisividad de las reglas compresoras." },
        { f: "Dada G y w con |w| = N:\n1) T0 = { S }\n2) Tk = Tk−1 ∪ { β / |β| ≤ N ∧ ∃ α ∈ Tk−1 ∧ α ⇒ β }\n3) Repetir 2) hasta que Tk = Tk−1 o w ∈ Tk" },
        { def: "Problema de la parada (Halting Problem)", txt: "Turing supuso una MT1 que, recibiendo la codificación de otra MT0, determina si se detiene para cualquier entrada, y una MT2 que se detiene si MT0 no lo hace y viceversa. Aplicada a su propia codificación, MT2 se detendría si no se detiene: una contradicción. Por el absurdo, esa máquina no existe: el problema de la parada no tiene solución algorítmica. La <b>Máquina Universal de Turing</b> es un modelo de modelos que recibe otra MT codificada." },
        { p: "Otros problemas insolubles probados a partir de este: la <b>equivalencia de GIC</b>, la <b>ambigüedad de las GIC</b> y la <b>comprobación de pertenencia para gramáticas sin restricciones</b>." },
        { table: { h: ["Concepto", "Definición"], r: [
          ["Función computable", "Existe una MT que obtiene f(w) para todo w del dominio"],
          ["Problema de decisión", "Su resultado es binario (sí/no, 0/1)"],
          ["Decidible o resoluble", "El problema de decisión es computable por una MT"],
          ["Lenguaje recursivamente enumerable", "Generado solo por gramáticas de tipo 0; es aceptable por una MT, pero algunas palabras pueden producir un bucle infinito"],
          ["Lenguaje recursivo", "Un LRE cuyo complemento también es LRE: decidible, todas las palabras hacen parar a la MT. Los LDC son un subconjunto de los recursivos"]] } },
        { table: { h: ["Familia", "∪", "∩", ".", "*", "Complemento"], r: [["LRE", "sí", "sí", "sí", "sí", "no"], ["Recursivos", "sí", "sí", "sí", "sí", "sí"], ["LIC", "sí", "no", "sí", "sí", "no"], ["LR", "sí", "sí", "sí", "sí", "sí"]] } },
        { def: "Complejidad algorítmica", txt: "La temporal se mide por la cantidad de pasos de la MT asociada hasta detenerse: se distinguen los algoritmos acotados por una función polinomial (tiempo razonable) de los exponenciales (imprácticos). La espacial, por la cantidad de casilleros que usa." }
      ] }
    ],
    tp: { n: 4, title: "MT y ALL", clase: [
      { id: "1.2", txt: "<p>MT que a) duplica cualquier secuencia sobre {a, b}; b) a partir de yᵐxⁿ agrega 0, 1 o 2 según n = m, n &gt; m o m &gt; n.</p>", sol: [{ p: "a) Marcar el primer símbolo sin copiar (A o B), ir al final y escribirlo, volver, repetir; al final restaurar A→a, B→b. b) Tachar pares y–x como en aⁿbⁿ y, según qué se acabe primero, escribir el dígito al final." }] }
    ], alumnos: [
      { id: "2.1", tag: "ALL", txt: "<p>ALL sobre {a, b} para: a) { aⁿbᵐ / n ≥ 1, m ≠ n } b) el complemento del lenguaje palíndromo c) cadenas de longitud impar cuyo símbolo central es igual al primero d) { aⁿbᵐcᵖ / n, m, p &gt; 0, n = m + p } e) { aⁿbᵐcᵖ / n &gt; 1, p ≥ 0, m = 2p + 1 }</p>", sug: 1, sol: [
        { p: "<b>a)</b> Tabla (estado, lee → nuevo, escribe, mueve). Probada con todas las palabras hasta longitud 8:" },
        { table: { mono: true, h: ["Estado", "Transiciones"], r: [["→0", "a → 1,a,D"], ["1", "a → 1,a,D · b → 2,b,D · ⟩ → F,⟩,N"], ["2", "b → 2,b,D · ⟩ → 4,⟩,I"], ["4", "a, b, X, Y → 4, igual, I · ⟨ → 5,⟨,D"], ["5", "X → 5,X,D · a → 6,X,D · Y → 8,Y,D"], ["6", "a, Y → 6, igual, D · b → 7,Y,I · ⟩ → F,⟩,N"], ["7", "Y, a → 7, igual, I · X → 5,X,D"], ["8", "Y → 8,Y,D · b → F,b,N"]] } },
        { p: "<b>b)</b> Igual que la MT de palíndromos, pero intercambiando aceptación y rechazo: aceptar cuando la comparación falla y rechazar cuando se completa. Es posible con ALL porque solo usa la cinta de la entrada." },
        { p: "<b>c)</b> Marcar a la vez un símbolo de cada extremo hasta que quede uno solo (el central), recordando el primero en el estado; comparar." },
        { p: "<b>d)</b> Por cada b y cada c, tachar una a. Aceptar si se acaban juntas." },
        { p: "<b>e)</b> Verificar al menos dos a, y por cada c tachar dos b; al final debe quedar exactamente una b." }] },
      { id: "2.2", tag: "ALL o MT", txt: "<p>Con ΣE = {0, 1}, ALL o MT que (indicar cuándo no alcanza con ALL): a) acepten aⁿbᵐcᵖ con m &gt; n y p impar; b) producto de dos unarios; c) de un palíndromo impar, uno par duplicando un símbolo central; d) de un palíndromo par, uno impar suprimiendo un central; e) generar la inversa de la palabra.</p>", sug: 1, sol: [{ ul: ["a) ALL: tachar pares a–b, verificar que sobren b y que la cantidad de c sea impar.", "b) MT: el resultado 1ⁿ·ᵐ es más largo que la entrada (1ⁿ×1ᵐ), por eso <b>no alcanza con ALL</b>. Por cada 1 del primer factor se copia el segundo al final.", "c) MT: la salida tiene longitud n + 1, más que la cinta del ALL. Se ubica el centro tachando extremos y se corre la mitad derecha un lugar.", "d) ALL: la salida es más corta; se ubica el centro y se corre la mitad derecha a la izquierda.", "e) ALL o MT: se intercambian extremos de a pares hacia el centro."] }] },
      { id: "2.3", tag: "MT 2 pistas", txt: "<p>MT de 2 pistas que recibe dos secuencias de igual longitud (una por pista) y elimina las posiciones donde ambas pistas coinciden, comprimiendo.</p>", sug: 1, sol: [{ p: "Cada casillero lee un par (s1, s2). Recorrer de izquierda a derecha: si s1 = s2 marcar el par con (∆,∆). Luego compactar: por cada hueco, correr un lugar a la izquierda el resto de los pares (los dos cabezales se mueven juntos, que es la restricción de la multipista)." }] },
      { id: "2.4", tag: "multicinta", txt: "<p>MT multicinta que: a) determine el mayor de dos binarios; b) dada una secuencia sobre {a, b, c}, indique el o los símbolos que más se repiten, si los tres se repiten igual, si no hay repeticiones o si es λ.</p>", sug: 1, sol: [{ p: "a) Un número por cinta, cabezales alineados a la derecha: el más largo (sin ceros a la izquierda) es mayor; si tienen igual largo, se comparan desde la izquierda hasta el primer dígito distinto." }, { p: "b) Copiar las a a la cinta 2, las b a la 3 y las c a la 4; luego avanzar las tres cintas a la vez y ver cuál se acaba última." }] },
      { id: "2.5", tag: "una cinta vs multicinta", txt: "<p>a) Aceptar secuencias sobre {a, b, c} con igual cantidad de a que de b. b) Transformar eliminando todas las c.</p>", sol: [
        { p: "<b>a)</b> Una cinta (probada hasta longitud 7):" },
        { table: { mono: true, h: ["Estado", "Transiciones"], r: [["→0", "c, X → 0, igual, D · a → 1,X,I · b → 2,X,I · ∆ → F,∆,N"], ["1", "a, b, c, X → 1, igual, I · ∆ → 3,∆,D"], ["3", "a, c, X → 3, igual, D · b → 5,X,I"], ["2", "a, b, c, X → 2, igual, I · ∆ → 4,∆,D"], ["4", "b, c, X → 4, igual, D · a → 5,X,I"], ["5", "a, b, c, X → 5, igual, I · ∆ → 0,∆,D"]] } },
        { p: "En multicinta basta copiar las a a la cinta 2 y las b a la 3 y avanzar ambas a la vez: lineal en vez de cuadrático." },
        { p: "<b>b)</b> Una cinta: al encontrar una c se la borra y se corre todo lo que sigue un lugar a la izquierda (estados p, mₓ y n recuerdan el símbolo que se está corriendo), luego se vuelve al inicio y se repite. Probada hasta longitud 6. En multicinta se copian a la cinta 2 solo las a y b: una sola pasada." }] },
      { id: "2.6", tag: "MT por bloques", txt: "<p>Construir una MT por bloques que acepte aⁿbⁿcⁿdⁿ.</p>", sol: [{ ol: ["<b>Bloque formato:</b> verifica a*b*c*d* y vuelve al inicio.", "<b>Bloque marcar:</b> marca la primera a sin marcar, busca y marca la primera b, luego la primera c y la primera d; vuelve al inicio.", "<b>Bloque control:</b> si no quedan a sin marcar, verifica que tampoco queden b, c ni d y acepta; si no, repite el bloque marcar."] }, { p: "Se componen como en M5 y M6: el estado final de cada bloque se redirige al inicial del siguiente." }] }
    ] },
    control: [
      { t: "vf", kind: "teoría", q: "La MT es un modelo determinista por naturaleza: para toda MT no determinista existe una determinista equivalente.", a: true },
      { t: "vf", kind: "teoría", q: "En la MT, Σ* queda dividido en dos subconjuntos: palabras aceptadas y palabras rechazadas.", a: false, why: "En tres: aceptadas, rechazadas y las que hacen que la MT no se detenga. En dos queda para el ALL y el AP." },
      { t: "vf", kind: "teoría", q: "El ALL es una MT que tiene restringida la longitud de su cinta a la longitud de la secuencia de entrada inicial.", a: true },
      { t: "vf", kind: "teoría", q: "La comprobación de pertenencia siempre tiene solución para los lenguajes de tipo 0.", a: false, why: "Siempre tiene solución para tipo 1 (y por jerarquía 2 y 3), pero no para tipo 0." },
      { t: "vf", kind: "teoría", q: "Los lenguajes recursivos son los LRE cuyo complemento también es LRE, y son decidibles por una MT.", a: true },
      { t: "vf", kind: "teoría", q: "Los LRE son cerrados para la intersección, la unión, la concatenación, la estrella de Kleene y el complemento.", a: false, why: "No son cerrados para el complemento. Los recursivos sí son cerrados para todas." },
      { t: "vf", kind: "teoría", q: "En la MT multipista los cabezales se mueven en forma independiente.", a: false, why: "Eso es la multicinta. En la multipista todos hacen el mismo movimiento." },
      { t: "fill", kind: "teoría", q: "Completá la función de transición de la MT: f : (Q − F) × (ΣE ∪ ΣA) ⇒ …", blanks: [{ k: "Rango:", a: ["Q × (ΣE ∪ ΣA) × {I, N, D}", "Qx(ΣE∪ΣA)x{I,N,D}", "Q × (ΣE ∪ ΣA) × {I,N,D}", "Q x (ΣE ∪ ΣA) x {I,N,D}"] }] },
      { t: "x", kind: "teoría", q: "Marcá con X los problemas que la cátedra menciona como insolubles.", o: ["Problema de la parada de la MT", "Equivalencia de gramáticas libres de contexto", "Ambigüedad de las GLC", "Comprobación de pertenencia para gramáticas sin restricciones", "Comprobación de pertenencia para GDC", "Minimización de un AFD"], a: [0, 1, 2, 3] },
      { t: "match", kind: "teoría", q: "Emparejá cada modelo con la forma en que divide a Σ*.", opts: ["Aceptadas / rechazadas / no se detiene", "Aceptadas / rechazadas"], items: [["Máquina de Turing", "Aceptadas / rechazadas / no se detiene"], ["Autómata Linealmente Limitado", "Aceptadas / rechazadas"], ["Autómata de Pila", "Aceptadas / rechazadas"]] },
      { t: "mc", kind: "práctica", q: "En la MT de palíndromos, ¿qué hace en el estado 2?", o: ["Avanza a la derecha hasta el blanco final, recordando que borró una a", "Compara el último símbolo con una b", "Vuelve a la izquierda hasta el inicio", "Acepta la palabra"], a: 0 },
      { t: "mc", kind: "práctica", q: "La MT de incremento binario recibe 1011. ¿Qué deja en la cinta?", o: ["1100", "1010", "10110", "0100"], a: 0 },
      { t: "mc", kind: "práctica", q: "¿Para cuál de estas tareas NO alcanza con un ALL?", o: ["Producto de dos números unarios", "Aceptar aⁿbⁿcⁿ", "Invertir una palabra", "Aceptar el complemento de los palíndromos"], a: 0, why: "El resultado es más largo que la entrada, y el ALL no puede usar más cinta." },
      { t: "mc", kind: "práctica", q: "¿Qué configuración sigue a ∆1aba∆ en la MT de palíndromos?", o: ["∆∆2ba∆", "∆a2ba∆", "∆∆5ba∆", "∆1ba∆"], a: 0, why: "1 lee a: escribe ∆, mueve a la derecha y pasa a 2." }
    ]
  });
})();
