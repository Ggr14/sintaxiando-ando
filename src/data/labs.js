/* Laboratorios: teoría para las cartas y mazos */
(function () {
  var seg = '<div class="tbl-wrap"><table class="t mono"><thead><tr><th>Estado</th><th>Muestra</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>Motor (IN1, IN2)</th></tr></thead><tbody>' +
    '<tr><td>Q0 · piso 1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>STOP (0, 0)</td></tr>' +
    '<tr><td>Q1 · subiendo</td><td>S</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>SUBIR (1, 0)</td></tr>' +
    '<tr><td>Q2 · piso 2</td><td>2</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>STOP (0, 0)</td></tr>' +
    '<tr><td>Q3 · bajando</td><td>b</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>BAJAR (0, 1)</td></tr></tbody></table></div>';
  var lab2pipe = '<figure class="fig"><div class="canvas" style="padding:14px"><div style="display:flex;gap:8px;align-items:stretch;flex-wrap:wrap;font-size:.86rem">' +
    ['Archivo .txt con sentencias LMD', 'Scanner (JLex): ER → AFD → tokens', 'Parser (Cup): GIC en BNF → LALR', 'Mensajes de error sintáctico o aceptación'].map(function (t, i) { return '<div style="flex:1;min-width:130px;border:1.5px solid var(--ink);border-radius:6px;padding:8px 10px;background:' + (i === 1 ? "var(--accent-soft)" : i === 2 ? "var(--mark-soft)" : "var(--surface)") + '">' + t + "</div>"; }).join('<div style="align-self:center;font-family:var(--f-mono)">→</div>') +
    '</div></div><figcaption>JLex parte de las expresiones regulares de los componentes léxicos; Cup parte de una GIC en BNF. Ambos generan código Java.</figcaption></figure>';

  window.SSL.labs.push({
    id: "lab1", code: "Lab 1", parcial: 1, title: "MEF de un ascensor con Arduino",
    blocks: [
      { p: "Diseñar un sistema de control basado en una <b>MEF</b> para un ascensor de <b>4 pisos</b> e implementarlo en Arduino con un programa que use las <b>tablas de transición de estados y de salidas</b>. Se prueba en Tinkercad y se defiende con una maqueta." },
      { table: { h: ["Elemento", "Especificación"], r: [["Lógica de control", "Estrictamente una máquina de estados finitos"], ["Motor", "Motor amarillo de corriente continua comandado por un puente H L298N (sentido de giro: subir y bajar)"], ["Panel", "4 pulsadores normal abierto con pull-down de 10 kΩ a GND, pines 2, 3, 4 y 5"], ["Sensores", "4 fines de carrera, uno por piso, pines 6, 7, 8 y 9"], ["Puente H", "IN1 e IN2 en los pines 10 y 11"], ["Display", "7 segmentos A–G en los pines 12, 13, A0, A1, A2, A3 y A4 (los analógicos usados como digitales con pinMode)"]] } },
      { ex: "Ejemplo resuelto de la cátedra · ascensor de 2 pisos (modelo de Moore)", b: [
        { f: "MEF = ⟨Q, ΣE, ΣS, f, g⟩\nQ  = { Q0 reposo en planta baja, Q1 subiendo, Q2 reposo en primer piso, Q3 bajando }\nΣE = { B1, B2, FC1, FC2 } → 16 combinaciones, fila = B1·8 + B2·4 + FC1·2 + FC2\nΣS = { STOP, SUBIR, BAJAR }   (y lo que muestra el display)\ng : Q ⇒ ΣS   (Moore: la salida depende solo del estado)" },
        { html: seg },
        { p: "La transición sale del arreglo <code>tablaTran[16][4]</code> del programa: fila = combinación de entradas, columna = estado actual. Lo que importa: Q0 pasa a Q1 si B2 = 1; Q1 pasa a Q2 cuando FC2 = 1; Q2 pasa a Q3 si B1 = 1; Q3 pasa a Q0 cuando FC1 = 1. En cualquier otra combinación se queda en el mismo estado." },
        { f: "void loop() {\n  fila = lectura_entradas();            // B1*8 + B2*4 + FC1*2 + FC2\n  estado = tablaTran[fila][estado];     // primero el estado nuevo...\n  escritura_salidas(estado);            // ...y después la salida (Moore)\n}" },
        { note: "Sin <code>delay()</code>: el código es determinista y no bloqueante, así en cada vuelta del loop se leen otra vez las entradas." }
      ] },
      { sim: "elev2" },
      { ex: "Escalar a 4 pisos · propuesta de modelo", b: [
        { p: "Con un estado por piso detenido y estados de movimiento que recuerdan el destino quedan <b>10 estados</b>: P1–P4 (detenido), S2–S4 (subiendo hacia el piso k) y B1–B3 (bajando hacia el piso k). Desde Pi, el pulsador Bj lleva a Sj si j &gt; i o a Bj si j &lt; i. Desde Sk o Bk, el fin de carrera FCk lleva a Pk. El display muestra el número de piso detenido, S al subir y b al bajar." },
        { p: "Con 8 entradas binarias la tabla tendría 2⁸ = 256 filas. Una alternativa compacta es codificar solo el evento relevante (botón j, sensor k o nada) y armar una tabla de 9 columnas de eventos por 10 estados." },
        { note: "Es una propuesta para estudiar la lógica. En la defensa tenés que poder justificar tu propio diseño, sus estados y su tabla." }
      ] },
      { sim: "elev4" },
      { ul: ["<b>Puente H L298N:</b> invierte la polaridad del motor de CC. IN1 = 1, IN2 = 0 sube; IN1 = 0, IN2 = 1 baja; ambos en 0, motor detenido.", "<b>Pull-down:</b> la resistencia de 10 kΩ a GND fija un LOW estable cuando el pulsador no está apretado; sin ella la entrada queda flotante y la MEF podría leer falsos 1.", "<b>GND común:</b> hay que unir el GND de la fuente externa con el del Arduino; sin referencia común las señales no conmutan los transistores del driver.", "<b>Tinkercad:</b> se valida la lógica antes del montaje y se miran las transiciones por el Serial Monitor, sin riesgo de dañar la etapa de potencia."] }
    ],
    cards: [
      { tag: "MEF", q: "¿Qué es una MEF y por qué sirve para controlar el ascensor?", a: "Una máquina secuencial que produce una secuencia de salida de igual longitud y en correspondencia con la de entrada, pero que depende también del estado. El ascensor es un sistema de control secuencial: su reacción a un botón depende de dónde está y qué está haciendo." },
      { tag: "MEF", q: "Definí formalmente la MEF y decí qué es cada componente en el ascensor de 2 pisos.", a: "MEF = ⟨Q, ΣE, ΣS, f, g⟩. Q = {Q0, Q1, Q2, Q3}; ΣE = combinaciones de B1, B2, FC1, FC2; ΣS = {STOP, SUBIR, BAJAR} (más el símbolo del display); f: Q × ΣE ⇒ Q la tabla de transición; g: Q ⇒ ΣS la tabla de salida." },
      { tag: "Moore/Mealy", q: "¿El ejemplo es Mealy o Moore? ¿Cómo te das cuenta?", a: "Moore: la salida (motor y display) depende solo del estado. Q1 siempre sube y muestra S, sin importar qué entrada llegó." },
      { tag: "Moore/Mealy", q: "¿Qué diferencia hay entre Mealy y Moore al implementarlas?", a: "En Mealy la salida es instantánea: primero se obtiene la salida (según estado actual y entrada) y luego el estado nuevo. En Moore hay retardo: primero se transiciona y después se escribe la salida, que depende solo del estado nuevo." },
      { tag: "Moore/Mealy", q: "¿Cómo pasás una MEF de Moore a Mealy?", a: "Mismos estados; por cada f(q, e) = p con g(p) = s se define g'(q, e) = s. La salida pasa a la transición que llega al estado." },
      { tag: "Moore/Mealy", q: "¿Cómo pasás una MEF de Mealy a Moore?", a: "Se desdobla cada estado según la salida con que se llega: por cada f(q,e) = p con g(q,e) = s se crea pₛ con g'(pₛ) = s. Si a un estado no llegan transiciones se crea q_λ." },
      { tag: "Tabla", q: "¿Qué representa el número de fila en tablaTran?", a: "La combinación de entradas codificada en binario: B1·8 + B2·4 + FC1·2 + FC2, de 0 a 15. Cada fila es un símbolo de entrada de la MEF." },
      { tag: "Tabla", q: "¿Cuántas filas tendría la tabla del ascensor de 4 pisos si se usan todas las entradas binarias?", a: "4 pulsadores + 4 fines de carrera = 8 bits → 2⁸ = 256 combinaciones." },
      { tag: "Tabla", q: "Estando en Q0 llega FC2 = 1 (sin botones). ¿Qué hace la MEF del ejemplo?", a: "Se queda en Q0: esa combinación no está prevista como cambio en ese estado. Solo B2 hace salir de Q0." },
      { tag: "Tabla", q: "En Q0 se aprietan B1 y B2 a la vez. ¿Qué pasa según la tabla?", a: "Filas 12 a 15: pasa a Q1 (subir). Para la tabla manda B2, porque B1 no hace nada estando en planta baja." },
      { tag: "Código", q: "Explicá qué hace el loop() del programa.", a: "Lee las entradas y arma el número de fila, busca el estado nuevo en tablaTran[fila][estado] y escribe las salidas del estado nuevo (motor y display) con las tablas de salida." },
      { tag: "Código", q: "¿Por qué el programa no debe usar delay()?", a: "Porque bloquea: mientras espera no se leen sensores ni botones. El firmware debe ser determinista y no bloqueante para reaccionar en cada ciclo." },
      { tag: "Código", q: "¿Por qué la MEF se implementa con tablas y no con if anidados?", a: "La tabla es la función de transición tal cual el modelo: el programa queda independiente de la lógica, se verifica contra la MEF y se modifica cambiando datos, no código." },
      { tag: "Hardware", q: "¿Para qué sirve el puente H L298N y qué valores toman IN1 e IN2?", a: "Para invertir la polaridad del motor de CC y elegir el sentido de giro. SUBIR: IN1 = 1, IN2 = 0. BAJAR: IN1 = 0, IN2 = 1. STOP: ambos en 0." },
      { tag: "Hardware", q: "¿Por qué los pulsadores llevan resistencia pull-down de 10 kΩ?", a: "Para que la entrada lea LOW estable cuando no se presiona. Sin ella queda flotante y puede leer 1 por ruido." },
      { tag: "Hardware", q: "¿Por qué hay que unir el GND de la fuente externa con el del Arduino?", a: "Porque las señales lógicas necesitan una referencia de tierra común para conmutar los transistores del driver." },
      { tag: "Hardware", q: "¿Qué es un fin de carrera y qué rol cumple en la MEF?", a: "Un micro-switch que se activa cuando la cabina llega a un piso. Es la entrada que provoca la transición de un estado de movimiento a un estado detenido." },
      { tag: "Hardware", q: "¿Qué significa que un pulsador sea normal abierto?", a: "Que en reposo el circuito está abierto (no conduce) y al presionarlo se cierra. Con pull-down: reposo LOW, presionado HIGH." },
      { tag: "Hardware", q: "¿Por qué el display usa pines analógicos?", a: "Porque los 14 digitales no alcanzan. A0 a A5 pueden configurarse como salidas digitales con pinMode()." },
      { tag: "Display", q: "¿Qué segmentos se encienden para mostrar 1, S, 2 y b?", a: "1: B y C. S: A, C, D, F y G. 2: A, B, D, E y G. b: C, D, E, F y G." },
      { tag: "Diseño", q: "¿Cuántos estados necesitás para 4 pisos y por qué?", a: "Una propuesta: 4 detenidos + 3 subiendo hacia un destino + 3 bajando hacia un destino = 10. El estado de movimiento tiene que recordar el destino para saber en qué fin de carrera detenerse." },
      { tag: "Diseño", q: "Estando detenido en el piso 3, se aprieta el botón del piso 3. ¿Qué debería hacer la MEF?", a: "Quedarse en el mismo estado: no hay movimiento que hacer." },
      { tag: "Diseño", q: "¿Cómo agregarías un estado de puerta abierta?", a: "Un estado intermedio entre el movimiento y el reposo (al llegar FCk pasa a Puerta k) y un evento de salida (sensor o temporizador) que lo lleve al reposo. Cambian Q, f y g; la estructura del programa no." },
      { tag: "Teoría", q: "¿De qué modelo es caso particular la MEF? ¿Y el AF de la MEF?", a: "La MEF es un caso particular de la MT. El AF es una MEF de tipo Moore especial, con salidas implícitas (estados de aceptación o rechazo)." },
      { tag: "Teoría", q: "¿Qué es la configuración de una MEF? Dá un ejemplo.", a: "Estado actual, lo que falta leer y lo que se escribió, como s1…si−1 qk ei…en. Ej. MEF1 con 011: q0011 ├─ nq011 ├─ niq11 ├─ nipq2." },
      { tag: "Teoría", q: "¿Qué significa que la MEF sea determinista?", a: "Que para cada estado y cada símbolo de entrada hay una sola transición posible." },
      { tag: "Teoría", q: "¿Qué ventajas tiene representar la MEF como grafo y como tabla?", a: "El grafo se entiende de un vistazo (estados, flechas con entrada y salida). La tabla es completa y se traduce directo a un arreglo en el programa." },
      { tag: "Teoría", q: "En la MEF, ¿la cinta de salida tiene la misma longitud que la de entrada? ¿Por qué?", a: "Sí: por cada símbolo leído se escribe exactamente uno." },
      { tag: "Simulación", q: "¿Para qué se simula en Tinkercad antes del montaje?", a: "Para validar la lógica de la MEF (transiciones por el Serial Monitor) sin riesgo de dañar componentes de potencia." },
      { tag: "Arduino", q: "¿Qué hacen digitalRead, digitalWrite y pinMode?", a: "pinMode configura un pin como entrada o salida; digitalRead lee HIGH o LOW de una entrada; digitalWrite escribe HIGH o LOW en una salida." },
      { tag: "Teoría", q: "En Moore, ¿por qué se dice que la salida sufre un retardo?", a: "Porque primero se transiciona según el símbolo leído y el estado actual, y recién después se escribe la salida, que depende solo del estado al que se llegó." }
    ]
  });

  window.SSL.labs.push({
    id: "lab2", code: "Lab 2", parcial: 2, title: "Parser de SQL con JLex y Cup",
    blocks: [
      { p: "A partir de las reglas léxicas y sintácticas del subconjunto <b>LMD</b> (Lenguaje de Manipulación de Datos) de SQL, construir un <b>parser en Java</b> con las herramientas de metacompilación <b>JLex</b> y <b>Cup</b>, que detecte errores sintácticos en un archivo de texto con sentencias LMD." },
      { html: lab2pipe },
      { table: { h: ["Herramienta", "Parte de", "Genera", "Teoría detrás"], r: [["JLex", "Expresiones regulares de los componentes léxicos", "Scanner (analizador léxico) en Java que devuelve tokens", "Unidad 2: ER → AF-λ → AFD"], ["Cup", "GIC descripta en notación BNF", "Parser (analizador sintáctico) en Java", "Unidad 3: GIC, AP, análisis ascendente (LALR)"]] } },
      { ex: "Estructura de un archivo JLex", b: [{ f: "código de usuario (import java_cup.runtime.*;)\n%%\n%cup  %line  %char            ← directivas\nDIGITO=[0-9]\nID=[a-zA-Z_][a-zA-Z0-9_]*      ← macros (ER)\n%%\n\"SELECT\"   { return new Symbol(sym.SELECT); }\n{ID}       { return new Symbol(sym.ID, yytext()); }\n{DIGITO}+  { return new Symbol(sym.NUM, yytext()); }\n[ \\t\\r\\n]+ { /* ignorar */ }\n.          { System.out.println(\"Error léxico: \" + yytext()); }" }] },
      { ex: "Estructura de un archivo Cup", b: [{ f: "import java_cup.runtime.*;\nparser code {: public void syntax_error(Symbol s) { … } :};\n\nterminal SELECT, FROM, WHERE, INSERT, INTO, VALUES, UPDATE, SET, DELETE;\nterminal COMA, PCOMA, PAR_A, PAR_C, IGUAL, ID, NUM, CADENA;\nnon terminal programa, sentencia, lista_campos, lista_valores, condicion;\n\nstart with programa;\n\nprograma  ::= programa sentencia | sentencia ;\nsentencia ::= SELECT lista_campos FROM ID PCOMA\n            | SELECT lista_campos FROM ID WHERE condicion PCOMA\n            | DELETE FROM ID WHERE condicion PCOMA ;\nlista_campos ::= lista_campos COMA ID | ID ;" }] },
      { f: "⟨select⟩ ::= SELECT ( * | ⟨campo⟩ { , ⟨campo⟩ } ) FROM ⟨tabla⟩ { , ⟨tabla⟩ } [ WHERE ⟨cond⟩ ] [ ORDER BY ⟨campo⟩ ] ;\n⟨insert⟩ ::= INSERT INTO ⟨tabla⟩ [ ( ⟨campo⟩ { , ⟨campo⟩ } ) ] VALUES ( ⟨valor⟩ { , ⟨valor⟩ } ) ;\n⟨update⟩ ::= UPDATE ⟨tabla⟩ SET ⟨campo⟩ = ⟨valor⟩ { , ⟨campo⟩ = ⟨valor⟩ } [ WHERE ⟨cond⟩ ] ;\n⟨delete⟩ ::= DELETE FROM ⟨tabla⟩ [ WHERE ⟨cond⟩ ] ;" },
      { tree: "sentencia( SELECT lista_campos( lista_campos(ID) COMA ID ) FROM ID PCOMA )", gx: 66, cap: "Árbol sintáctico de SELECT nombre, edad FROM alumnos ;" },
      { html: "<h3 id=\"lab2-cartas\">Qué toman en las cartas (defensa del 29/10)</h3>" },
      { p: "Las cartas tomadas el 29/10 siguen el banco de preguntas de JLex y CUP, pero con otra numeración y varias aplicadas al código. Tipos de pregunta que salieron:" },
      { table: { h: ["Tipo", "Ejemplo que salió", "Qué hay que saber"], r: [
        ["Elegir la línea de código correcta", "Cómo se instancia el scanner en Main.java", "Escaner = new Lexico(new StringReader(args[0])); oParser = new Parser(Escaner); oParser.parse();"],
        ["Elegir la producción CUP correcta", "Lista de columnas separadas por coma", "lista ::= ID | lista COMA ID ; — BNF pura: CUP no acepta * ni ( )*"],
        ["Elegir la expresión regular correcta", "ER para identificadores de tablas y columnas", "[a-zA-Z_][a-zA-Z0-9_]*"],
        ["Palabras clave y variables de CUP", "Con qué palabra se declaran los símbolos del scanner; para qué sirve RESULT", "terminal / non terminal; RESULT = valor del no terminal del lado izquierdo"],
        ["Salida de las herramientas", "Qué muestra el resumen de generación de CUP", "Terminales, no terminales, producciones, estados y conflictos"],
        ["Arquitectura del compilador", "Entrada y salida del análisis léxico", "Caracteres → tokens (léxico); tokens → árbol (sintáctico)"]] } },
      { note: "Los distractores mezclan opciones absurdas con otras casi correctas: una coma de más en la producción, notación de EBNF que CUP no acepta, métodos que no existen (Lexico.open, CUP.createLexer). Leé las cuatro antes de elegir." },
      { ex: "Main.java de la calculadora (calc.rar)", b: [{ f: "package calculadora;\nimport java.io.StringReader;\n\npublic class Main {\n  public static void main(String[] args) {\n    Lexico Escaner = null;\n    Parser oParser = null;\n    try {\n      Escaner = new Lexico(new StringReader(args[0]));  // scanner sobre el texto\n      oParser = new Parser(Escaner);                   // el parser recibe el scanner\n      oParser.parse();                                 // pedir token → shift/reduce\n    } catch (Exception ex) {\n      System.out.println(ex.toString());\n    }\n  }\n}" }] },
      { ex: "Construir y ejecutar la calculadora", b: [{ f: "java JLex.Main calc_lex.java          → calc_lex.java.java (clase Lexico)\njava -jar java-cup-11b.jar -parser Parser -symbols Simbolos calc_cup.java\n                                       → Parser.java + Simbolos.java + resumen\njavac -cp java-cup-11b-runtime.jar calculadora/*.java\njava -cp java-cup-11b-runtime.jar;. calculadora.Main \"2+3*4\"   →  = 14;" }] },
      { table: { h: ["En CUP", "Para qué sirve"], r: [
        ["terminal / non terminal", "Declarar los tokens que entrega el scanner / las estructuras que arma el parser (con tipo opcional: terminal Integer NUMBER;)"],
        ["precedence left|right|nonassoc", "Prioridad y asociatividad; lo declarado más abajo tiene más precedencia"],
        ["start with", "Símbolo inicial de la gramática"],
        ["{: … :}", "Código Java de una acción semántica; RESULT = valor del lado izquierdo; etiquetas expr:e1 para leer valores"],
        ["parser code / action code", "Código que se agrega a la clase del parser / a la clase de acciones"],
        ["init with / scan with", "Código antes del primer token / cómo pedir el próximo Symbol"],
        ["-parser / -symbols / -expect", "Nombre de la clase del parser / de símbolos / conflictos tolerados"]] } },
      { table: { h: ["En JLex", "Para qué sirve"], r: [
        ["%class Lexico", "Nombre de la clase del scanner"],
        ["%cup", "Implementa java_cup.runtime.Scanner: next_token() devuelve Symbol"],
        ["%ignorecase · %line · %char · %state", "Sin distinguir mayúsculas · contar líneas · contar caracteres · estados léxicos"],
        ["%{ … %} · %eofval{ … %eofval}", "Código Java dentro de la clase · qué devolver al fin de archivo"],
        ["yytext() · yylength() · yybegin(E)", "Lexema reconocido · su largo · cambiar de estado léxico"],
        ["Máxima coincidencia y orden", "Gana el lexema más largo; si empatan, la regla escrita primero (palabras reservadas antes que ID)"]] } },
      { note: "Material de la cátedra: guía de instalación de JLex, Cup, JDK y NetBeans; sintaxis de los archivos fuente; sintaxis ANSI del LMD; ejemplos calc y lenguaje hipotético C0." }
    ],
    cards: [
      { tag: "Parser", q: "¿Qué es un parser y qué recibe del scanner?", a: "El analizador sintáctico: revisa que la secuencia de tokens respete la estructura de la gramática (GIC) y detecta errores sintácticos. Recibe los tokens que le entrega el scanner." },
      { tag: "Scanner", q: "¿Qué es un scanner y qué es un token?", a: "El analizador léxico: lee los caracteres y reconoce los componentes léxicos. Un token es la categoría del componente (ID, NUM, SELECT, COMA…) más su valor (lexema)." },
      { tag: "JLex", q: "¿De qué parte JLex y qué genera?", a: "De las expresiones regulares de los componentes léxicos, y genera un scanner en Java capaz de obtener los tokens y dárselos al parser." },
      { tag: "Cup", q: "¿De qué parte Cup y qué genera?", a: "De una GIC escrita en notación BNF con las reglas sintácticas, y genera un parser en Java que detecta los errores sintácticos." },
      { tag: "JLex", q: "¿Cómo se estructura un archivo de JLex?", a: "Tres partes separadas por %%: código de usuario; directivas y macros (definiciones regulares); reglas, cada una una ER con la acción en Java que devuelve el token." },
      { tag: "Cup", q: "¿Qué secciones tiene un archivo de Cup?", a: "Imports y código de usuario, declaración de terminales y no terminales, precedencias, start with (axioma) y las producciones con ::=, | y ; (y acciones entre {: :})." },
      { tag: "Cup", q: "¿Qué tipo de análisis hace el parser que genera Cup?", a: "Ascendente: Cup genera parsers LALR(1), que reducen desde las hojas hacia el axioma (derivación más a la derecha en reversa)." },
      { tag: "Teoría", q: "¿Qué modelo matemático reconoce lo que describe Cup? ¿Y JLex?", a: "Cup: GIC → Autómata de Pila (tipo 2, nivel sintáctico). JLex: ER → Autómata Finito (tipo 3, nivel léxico)." },
      { tag: "Teoría", q: "¿Por qué los tokens se describen con ER y la sintaxis con una GIC?", a: "Los componentes léxicos son lenguajes regulares. La sintaxis tiene anidamientos y recursión (paréntesis, listas, sentencias dentro de sentencias) que una GR no puede generar: hace falta tipo 2." },
      { tag: "BNF", q: "¿Qué es la BNF y cuáles son sus metacaracteres?", a: "Una notación para escribir GIC de lenguajes de programación. ::= separa izquierda y derecha, | alternativas, { } repetición, [ ] opcional, ( ) agrupar alternativas, ⟨ ⟩ no terminales." },
      { tag: "Chomsky", q: "¿Qué es una gramática dependiente del contexto?", a: "Tipo 1: sus reglas no pueden tener parte derecha más corta que la izquierda (sin compresoras), salvo S → λ con S fuera de las partes derechas. Generan LDC, nivel semántico, aceptados por un ALL." },
      { tag: "Chomsky", q: "¿En qué nivel de la jerarquía está un lenguaje como SQL? ¿Qué parte cubre cada herramienta?", a: "Su sintaxis es de tipo 2 (Cup). Sus componentes léxicos son de tipo 3 (JLex). La verificación de tipos o de que la tabla exista sería semántica, fuera del parser." },
      { tag: "GIC", q: "¿Qué es una gramática ambigua y por qué es un problema para el parser?", a: "La que da más de un árbol de derivación para una palabra. El parser no sabe qué estructura elegir (conflictos); se resuelve reescribiendo la gramática o declarando precedencias." },
      { tag: "Cup", q: "¿Para qué sirve precedence en Cup?", a: "Para resolver ambigüedades de operadores declarando su prioridad y asociatividad (precedence left OR; precedence left AND;), sin reescribir la gramática." },
      { tag: "GIC", q: "¿Cómo eliminás la ambigüedad de las expresiones aritméticas?", a: "Introduciendo niveles: E → E + T | T, T → T * F | F, F → ( E ) | id. El producto queda más abajo en el árbol y por eso tiene más prioridad." },
      { tag: "SQL", q: "¿Qué es el LMD de SQL y qué sentencias incluye?", a: "El Lenguaje de Manipulación de Datos: SELECT, INSERT, UPDATE y DELETE." },
      { tag: "SQL", q: "Escribí la estructura de un SELECT en BNF.", a: "⟨select⟩ ::= SELECT ( * | ⟨campo⟩ { , ⟨campo⟩ } ) FROM ⟨tabla⟩ [ WHERE ⟨cond⟩ ] ;" },
      { tag: "SQL", q: "Escribí la estructura de un INSERT en BNF.", a: "⟨insert⟩ ::= INSERT INTO ⟨tabla⟩ [ ( ⟨campo⟩ { , ⟨campo⟩ } ) ] VALUES ( ⟨valor⟩ { , ⟨valor⟩ } ) ;" },
      { tag: "Errores", q: "Dá un ejemplo de error léxico y uno sintáctico en una sentencia SQL.", a: "Léxico: un símbolo que ningún patrón reconoce, como SELECT # FROM t (lo detecta el scanner). Sintáctico: SELECT nombre alumnos; (falta FROM) (lo detecta el parser)." },
      { tag: "Errores", q: "¿Quién detecta que una tabla consultada no existe?", a: "Nadie en este laboratorio: es un error semántico (coherencia con las declaraciones), no léxico ni sintáctico." },
      { tag: "JLex", q: "¿Qué es una macro en JLex? Dá un ejemplo.", a: "Un nombre para una expresión regular que se reutiliza en las reglas: DIGITO=[0-9] y luego {DIGITO}+ para los números." },
      { tag: "JLex", q: "¿Qué hace yytext() en JLex?", a: "Devuelve el lexema reconocido, el texto que coincidió con la ER, para guardarlo como valor del token." },
      { tag: "Cup", q: "¿Qué son terminal y non terminal en Cup?", a: "Las declaraciones de los símbolos de la GIC: terminales son los tokens que entrega el scanner; no terminales son las estructuras sintácticas." },
      { tag: "Cup", q: "¿Para qué sirve start with?", a: "Para indicar el axioma de la gramática. Si no está, Cup toma el no terminal de la primera producción." },
      { tag: "Integración", q: "¿Cómo se conectan el scanner y el parser?", a: "El scanner se genera compatible con Cup (%cup) y devuelve objetos Symbol con el código del token definido en sym.java. El parser pide un token por vez." },
      { tag: "Integración", q: "¿Qué archivos genera Cup?", a: "La clase del parser y la clase sym con las constantes de los terminales, que usa el scanner." },
      { tag: "Teoría", q: "¿Qué es un árbol de derivación? Dá uno para una sentencia SELECT.", a: "Árbol con el axioma en la raíz, no terminales en los nodos internos y terminales en las hojas; cada nodo con sus hijos es una regla. SELECT campo FROM tabla; → sentencia(SELECT lista(ID) FROM ID PCOMA)." },
      { tag: "Teoría", q: "¿Por qué un AP necesita la pila para analizar SQL?", a: "Para recordar estructuras abiertas que todavía no se cerraron (paréntesis de una lista de valores, subconsultas, listas recursivas). Un AF no tiene memoria suficiente." },
      { tag: "Teoría", q: "¿Qué diferencia hay entre análisis descendente y ascendente?", a: "Descendente: del axioma hacia las hojas, derivación más a la izquierda (AP desde FNG, pila vacía). Ascendente: de las hojas al axioma, derivación más a la derecha (AP desde FNC, estado final). Cup es ascendente." },
      { tag: "Teoría", q: "¿Qué es una gramática independiente del contexto?", a: "Tipo 2: la parte izquierda de cada regla es un solo no terminal y la derecha cualquier secuencia. Genera LIC, nivel sintáctico, aceptados por un AP." },
      { tag: "Compilación", q: "¿En qué fase del compilador están el scanner y el parser?", a: "En la fase de análisis, junto con el análisis semántico. La síntesis genera código intermedio, lo optimiza y genera código de máquina." },
      { tag: "Herramientas", q: "¿Qué hace falta instalar para el laboratorio?", a: "JDK, NetBeans, JLex (Main.java) y el proyecto java_cup. La cátedra deja la guía de instalación y ejemplos (calc y lenguaje hipotético C0)." }
    ]
  });

  window.SSL.labs.push({
    id: "lab0", code: "Lab GCC", parcial: 1, title: "Proceso de compilación con GCC",
    blocks: [
      { p: "Actividad de la unidad 1: seguir un programa en C por cada etapa con gcc y leer el ensamblador generado (GNU as, sintaxis AT&T)." },
      { table: { mono: true, h: ["Comando", "Qué obtiene"], r: [["gcc -E prog.c -o prog.txt", "Preprocesado: #include insertado y macros #define reemplazadas"], ["gcc -S prog.c", "prog.s, el código ensamblador"], ["gcc -c prog.c", "prog.o, el objeto"], ["gcc prog.c -o prog", "El ejecutable (compila y enlaza)"]] } },
      { f: "int main () { int a=2, b=3, r; r = a + b; return 0; }\n\n_main:  pushl %ebp\n        movl %esp, %ebp\n        andl $-16, %esp       # alinea la pila a múltiplo de 16\n        subl $16, %esp        # reserva 16 bytes para locales\n        call ___main          # inicializa el entorno de C\n        movl $2, 12(%esp)     # a\n        movl $3, 8(%esp)      # b\n        movl 12(%esp), %edx\n        movl 8(%esp), %eax\n        addl %edx, %eax\n        movl %eax, 4(%esp)    # r\n        movl $0, %eax         # return 0\n        leave\n        ret" }
    ],
    cards: [
      { tag: "Preprocesador", q: "¿Qué hace gcc -E y qué se ve en el archivo resultante?", a: "Solo preprocesa: inserta el contenido de los #include y reemplaza las macros #define. Aparecen líneas # 1 \"archivo.c\" que indican de qué archivo viene cada parte." },
      { tag: "Preprocesador", q: "¿Qué diferencia hay entre #include \"x.h\" y #include <x.h>?", a: "Con comillas se busca en la carpeta del fuente; con ángulos, en la carpeta de bibliotecas por defecto." },
      { tag: "Preprocesador", q: "¿Qué hace #define MAX(x, y) (x > y) ? x : y en el preprocesado?", a: "Es una macro con parámetros: cada MAX(a, b) se reemplaza textualmente por (a > b) ? a : b." },
      { tag: "Ensamblador", q: "¿Qué indican los sufijos b, w, l y q en las instrucciones?", a: "El tamaño de los datos: byte (8), word (16), long (32) y quad (64 bits)." },
      { tag: "Ensamblador", q: "¿Qué significan % y $ en el ensamblador de GCC?", a: "% antecede a los registros (%eax) y $ a los valores inmediatos ($5)." },
      { tag: "Ensamblador", q: "¿Dónde se guardan las variables globales y las locales?", a: "Las globales en la sección de datos (.data); las locales y los parámetros en la pila, con offsets sobre %esp o %ebp." },
      { tag: "Ensamblador", q: "¿Para qué sirven pushl %ebp y movl %esp, %ebp al inicio de _main?", a: "Arman el marco de pila: guardan la base anterior y fijan la nueva base en el tope actual." },
      { tag: "Ensamblador", q: "¿Qué hace andl $-16, %esp?", a: "Alinea el puntero de pila a un múltiplo de 16, lo que hace más eficiente el acceso a las variables locales." },
      { tag: "Ensamblador", q: "¿Qué es call ___main?", a: "Una llamada a una función de inicialización generada por el compilador (entorno de ejecución, variables estáticas) antes de ejecutar main." },
      { tag: "Enlace", q: "Si el programa usa printf sin #include <stdio.h>, ¿compila? ¿Cambia el .s?", a: "Compila con un warning de declaración implícita. El .s es igual al de la versión con include: las bibliotecas se agregan recién en el enlazado." },
      { tag: "Registros", q: "¿Para qué se usan EAX, ECX, EBP y ESP?", a: "EAX acumulador y valor de retorno; ECX contador de ciclos; EBP base del marco de pila; ESP tope de la pila." },
      { tag: "Directivas", q: "¿Qué indican .text, .data y .globl?", a: ".text la sección de código, .data la de datos, .globl un símbolo global visible desde otros módulos." },
      { tag: "Etapas", q: "Nombrá las fases para ejecutar un programa de alto nivel.", a: "Compilación (genera el objeto), enlace (une módulos y bibliotecas en el ejecutable) y carga (el S.O. ubica los segmentos y calcula direcciones absolutas)." },
      { tag: "Etapas", q: "¿Qué hace el cargador?", a: "Ubica los segmentos del ejecutable en memoria y suma la dirección base de cada segmento a las direcciones relativas." },
      { tag: "Modos", q: "¿Qué diferencia hay entre movl (%ebx), %eax y movl 8(%eax), %ebx?", a: "El primero es indirecto: carga lo apuntado por EBX. El segundo es indexado: lo apuntado por EAX más un desplazamiento de 8 bytes." }
    ]
  });
})();
