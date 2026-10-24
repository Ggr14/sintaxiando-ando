# Sintaxiando Ando

Guía de estudio de **Sintaxis y Semántica de los Lenguajes** (UTN FRT, 2026).

- Teoría de las 4 unidades con las definiciones de la cátedra.
- Gráficos y simuladores paso a paso: AFD, AFND, AF-λ, MEF de Mealy y Moore, autómatas de pila, máquinas de Turing y el ascensor del Laboratorio 1.
- Defensas de TP: enunciados de "Problemas a resolver por los alumnos" con tiempo y resolución.
- Cartas de laboratorio con un minuto por carta (Lab 1, Lab 2 y GCC).
- Simulacros de parcial con la estructura del Tema C del primer parcial 2026, y el Tema C resuelto.
- Control de lectura al final de cada unidad.

## Cómo se arma

El sitio es un solo `index.html` autocontenido. Las fuentes están en `src/` (estilos, motor y datos por unidad) y se combinan con:

```
python3 build.py
```

Para publicarlo con GitHub Pages: Settings → Pages → Deploy from a branch → `main` / root.
