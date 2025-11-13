# Cipher - Password Strength Education

Proyecto educativo sobre la fortaleza de contraseñas. Aplicación web SPA (Single Page Application) que permite analizar la fortaleza de contraseñas en tiempo real.

## Características

- **Análisis en tiempo real** de contraseñas
- **Cálculo de entropía** (nivel de sorpresa)
- **Estimación de tiempo de descifrado** para diferentes tipos de ataques
- **Detección de patrones comunes** (palabras comunes, secuencias, repeticiones)
- **Interfaz reactiva** con actualización instantánea
- **Modo libre** para análisis personalizado
- **Ejercicio guiado** paso a paso
- **Comparación visual** de contraseñas

## 📁 Estructura del Proyecto

```
cipher/
├── index.html              # Único archivo HTML (SPA)
├── js/
│   ├── app.js              # Punto de entrada principal
│   ├── router.js           # Router para navegación
│   ├── modules/
│   │   ├── password-analyzer.js    # Analizador principal
│   │   ├── entropy-calculator.js   # Calculador de entropía
│   │   ├── pattern-detector.js     # Detector de patrones
│   │   ├── time-estimator.js       # Estimador de tiempo
│   │   └── ui-updater.js           # Actualizador de UI
│   └── utils/
│       └── storage.js      # Utilidades para localStorage
├── css/
│   └── styles.css          # Estilos adicionales (si es necesario)
└── data/
    └── common-passwords.json  # Lista de contraseñas comunes (futuro)
```

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura
- **TailwindCSS** - Estilos (via CDN)
- **JavaScript ES6+** - Lógica (Vanilla JS, sin frameworks)
- **ES6 Modules** - Organización del código
- **localStorage API** - Persistencia de datos

## Cómo Usar

### Opción 1: Abrir directamente (Recomendado)

1. Abre `index.html` en tu navegador
2. La aplicación se cargará automáticamente
3. Navega entre las páginas usando los botones o el hash en la URL

### Opción 2: Servidor local (Recomendado para desarrollo)

Para usar ES6 Modules, necesitas un servidor local:

```bash
# Usando Python
python -m http.server 8000

# Usando Node.js (http-server)
npx http-server

# Usando PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

## 📖 Páginas

1. **Splash** (`#splash`) - Página de bienvenida
2. **Home** (`#home`) - Página principal con opciones
3. **Intro** (`#intro`) - Introducción y captura de nombre
4. **Exercise** (`#exercise`) - Analizador básico de contraseñas
5. **Guided Exercise** (`#guidedexe`) - Ejercicio guiado paso a paso
6. **Comparison** (`#comparison`) - Comparación visual de 3 contraseñas
7. **Libre** (`#libre`) - Modo libre con análisis en tiempo real
8. **Fin** (`#fin`) - Página final

## Funcionalidades

### Análisis de Contraseñas

- **Longitud**: Número de caracteres
- **Variedad**: Tipos de caracteres utilizados (mayúsculas, minúsculas, números, símbolos)
- **Entropía**: Nivel de sorpresa calculado en bits
- **Tiempo de descifrado**: Estimación para 4 tipos de ataques:
  - Ataque común (1 millón de intentos/seg)
  - Ataque avanzado (1 billón de intentos/seg)
  - Ataque masivo (1 trillón de intentos/seg)
  - Ataque cuántico (1 cuatrillón de intentos/seg)

### Detección de Patrones

- **Palabras comunes**: Detecta palabras comunes del diccionario
- **Secuencias**: Detecta secuencias comunes (123, abc, qwerty)
- **Repeticiones**: Detecta repeticiones excesivas de caracteres
- **Patrones de teclado**: Detecta patrones comunes de teclado

## Métricas

### Cálculo de Entropía

La entropía se calcula usando la fórmula:
```
Entropía = log2(charsetSize^length)
```

Donde:
- `charsetSize`: Tamaño del charset utilizado (26 minúsculas + 26 mayúsculas + 10 números + 32 símbolos)
- `length`: Longitud de la contraseña

### Estimación de Tiempo

El tiempo se estima usando:
```
Tiempo = (2^entropía) / (intentos por segundo)
```

### Score de Fortaleza

El score se calcula así:
- **Longitud** (máx 40 puntos): `length * 2`
- **Variedad** (máx 20 puntos): `variety.score * 20`
- **Entropía** (máx 30 puntos): `entropy / 2`
- **Penalización** (máx -10 puntos): `-patterns.penalty`

**Niveles de fortaleza:**
- **0-30**: Débil (rojo)
- **31-50**: Moderada (naranja)
- **51-70**: Fuerte (amarillo)
- **71-100**: Muy fuerte (verde)

##  Seguridad

- **IMPORTANTE**: Todo el procesamiento es local
- No se envían datos a servidores
- No se almacenan contraseñas
- Solo se procesan en memoria del navegador
- Privacidad garantizada

##  Personalización

### Colores

Los colores se pueden personalizar en `index.html` en la sección `tailwind.config`:

```javascript
colors: {
  "primary": "#13ec5b",
  "background-light": "#f6f8f6",
  "background-dark": "#0D0D0D",
}
```

### Fuentes

Las fuentes se cargan desde Google Fonts:
- **Space Grotesk**: Fuente principal
- **Material Symbols**: Iconos

##  Notas

- La aplicación requiere JavaScript para funcionar
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)
- No requiere build process
- Funciona sin servidor (excepto para ES6 Modules)

##  Futuras Mejoras

- [ ] Lista completa de contraseñas comunes
- [ ] Detección de patrones de teclado más avanzada
- [ ] Soporte para múltiples idiomas
- [ ] Modo oscuro/claro mejorado
- [ ] Animaciones más suaves
- [ ] Optimización de performance
- [ ] Service Worker para cache

##  Licencia

Este proyecto es educativo y de código abierto.

##  Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

---

**Cipher © 2025 — Proyecto educativo.**

