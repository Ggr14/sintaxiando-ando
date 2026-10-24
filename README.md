# Sintaxiando Ando

Guía de estudio interactiva de **Sintaxis y Semántica de los Lenguajes** (UTN Facultad Regional Tucumán, ciclo 2026).

**Sitio:** https://ggr14.github.io/sintaxiando-ando/

## Qué es

Es una página web pensada para preparar la materia tal como se evalúa este año: defensas de trabajos prácticos, laboratorios con cartas y parciales con teoría estilo verdadero o falso. Reúne la teoría de las clases, ejercicios resueltos y herramientas para practicar con tiempo, todo en un mismo lugar.

El contenido está organizado igual que la materia:

- **Primer parcial:** Unidad 1 (lingüística matemática) y Unidad 2 (lenguajes regulares y autómatas finitos), más el Laboratorio 1.
- **Segundo parcial:** Unidad 3 (gramáticas independientes del contexto y autómatas de pila) y Unidad 4 (máquinas de Turing y modelos generales), más el Laboratorio 2.

## Qué incluye

- **Teoría por unidad**, con las definiciones tal como las presenta la cátedra (que es como aparecen en los verdadero o falso), tablas comparativas y notas sobre las trampas más comunes.
- **Gráficos y simuladores paso a paso**: autómatas finitos deterministas y no deterministas, AF-λ, máquinas de Mealy y Moore, autómatas de pila y máquinas de Turing. Se escribe una palabra y se ve cómo se mueve el cabezal, cómo cambian los estados y cómo se llena la pila, con la secuencia de configuración en la notación de la cátedra. También hay árboles de derivación y diagramas de sintaxis.
- **Práctica con dibujo**: ejercicios de los TP y parciales para resolver dibujando el autómata finito, la MEF, el autómata de pila o la máquina de Turing en un lienzo. Al tocar "Corregir", la página compara el dibujo con la solución probando todas las palabras cortas (o la salida, en las MEF) y, si algo falla, muestra una palabra concreta donde el diseño se equivoca. No usa IA: cualquier diseño que reconozca el mismo lenguaje cuenta como correcto.
- **Laboratorios**: la teoría de cada enunciado (MEF del ascensor con Arduino, parser de SQL con JLex y Cup, proceso de compilación con GCC) y un simulador del ascensor con la tabla de transición y el display de 7 segmentos.
- **Cartas de laboratorio**: un simulador de la evaluación con preguntas de opción múltiple y un minuto por carta. Al final muestra el puntaje y repasa las que se fallaron.
- **Defensas de TP**: sale al azar un enunciado de la parte "Problemas a resolver por los alumnos", con reloj, y después se compara con la resolución.
- **Simulacros de parcial** con la misma estructura y puntaje que el primer parcial 2026 (Tema C). Cada simulacro es un tema distinto, armado al azar. Además está el Tema C resuelto.
- **Control de lectura** al final de cada unidad, con preguntas de teoría y de práctica.

El progreso (secciones leídas, controles aprobados y mejor puntaje en cartas) se guarda en el navegador de cada persona.

Las resoluciones de los ejercicios para alumnos son propias y están marcadas como sugeridas; muchas se verificaron con programas (minimizaciones, gramáticas, autómatas de pila y máquinas de Turing). Ante cualquier duda, manda el criterio de la cátedra.

## Agradecimientos

A **Franco Martinez Soria**, por la idea de crear artifacts de estudio para las materias de la UTN FRT.

Franco es el autor de varias guías de este estilo para otras materias, que fueron la inspiración para esta. Si cursás alguna de ellas, te recomiendo visitarlas:

- [Backeando Ando](https://franco704.github.io/backeando-ando/) (de Franco) · Desarrollo de Software
- [Iterando Ando](https://franco704.github.io/iterando-ando/) (de Franco) · Matemática Superior
- [Economizar](https://franco704.github.io/economizar/) (de Franco) · Economía
- [Diseñando Ando](https://franco704.github.io/disenando-ando/) (de Franco) · Diseño de Sistemas de Información

Y a la cátedra de Sintaxis y Semántica de los Lenguajes (Ing. Jorge Buabud), cuyo material de clases y trabajos prácticos es la base de todo el contenido.

## Cómo se arma

El sitio es un único `index.html` autocontenido. Las fuentes están en `src/` (estilos, motor y datos de cada unidad, laboratorio y parcial) y se combinan con:

```
python3 build.py
```
