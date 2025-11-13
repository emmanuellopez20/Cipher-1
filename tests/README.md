# Pruebas Unitarias - Cipher

## Descripción

Este directorio contiene las pruebas unitarias para validar la funcionalidad de los módulos de análisis de contraseñas.

## Estructura de Pruebas

- `test-runner.html` - Pruebas ejecutables en el navegador
- `password-analyzer.test.js` - Pruebas para Node.js (requiere configuración)

## Cómo Ejecutar las Pruebas

### Opción 1: Pruebas en el Navegador (Recomendado)

1. **Abrir el archivo de pruebas**:
   ```bash
   # Abrir test-runner.html en tu navegador
   open tests/test-runner.html
   # O simplemente arrastra el archivo a tu navegador
   ```

2. **Ejecutar las pruebas**:
   - Haz clic en el botón "Ejecutar Pruebas"
   - Los resultados se mostrarán en la página

3. **Requisitos**:
   - Navegador moderno (Chrome, Firefox, Safari, Edge)
   - Servidor local para ES6 Modules (ver abajo)

### Opción 2: Servidor Local para Pruebas en el Navegador

Para usar ES6 Modules, necesitas un servidor local:

```bash
# Usando Python
cd "/Users/jesuslopez/Desktop/pantallas cipher"
python -m http.server 8000

# Luego abre en el navegador:
# http://localhost:8000/tests/test-runner.html
```

```bash
# Usando Node.js (http-server)
cd "/Users/jesuslopez/Desktop/pantallas cipher"
npx http-server

# Luego abre en el navegador:
# http://localhost:8080/tests/test-runner.html
```

```bash
# Usando PHP
cd "/Users/jesuslopez/Desktop/pantallas cipher"
php -S localhost:8000

# Luego abre en el navegador:
# http://localhost:8000/tests/test-runner.html
```

### Opción 3: Pruebas en Node.js (Requiere configuración)

1. **Instalar dependencias** (si es necesario):
   ```bash
   npm install
   ```

2. **Ejecutar pruebas**:
   ```bash
   node tests/password-analyzer.test.js
   ```

**Nota**: Las pruebas en Node.js requieren que los módulos estén configurados para CommonJS. Actualmente, los módulos usan ES6 Modules, por lo que se recomienda usar la opción del navegador.

## Pruebas Incluidas

### EntropyCalculator
- Contraseña vacía retorna 0
- Contraseña con solo minúsculas
- Contraseña con mayúsculas y minúsculas
- Contraseña con números
- Contraseña con símbolos
- Detección de tipos de caracteres

### TimeEstimator
- Entropía 0 retorna tiempo inmediato
- Estimación de tiempo para ataque común
- Estimación de tiempo para todos los ataques
- Comparación de tiempos entre ataques

### PatternDetector
- Detección de palabras comunes
- Detección de secuencias
- Detección de repeticiones
- Detección de patrones de teclado
- Cálculo de penalización

### PasswordAnalyzer
- Análisis de contraseña vacía
- Análisis de contraseña simple
- Detección de variedad de caracteres
- Cálculo de fortaleza
- Generación de feedback
- Cálculo de tiempo de crackeo
- Contraseña débil vs fuerte

## Interpretación de Resultados

### Pruebas Pasadas
- `[PASS]` - La prueba pasó correctamente
- Se muestra en verde

### Pruebas Fallidas
- `[FAIL]` - La prueba falló
- Se muestra en rojo
- Se muestra el error específico

### Resumen
- Total de pruebas ejecutadas
- Número de pruebas pasadas
- Número de pruebas fallidas

## Agregar Nuevas Pruebas

Para agregar nuevas pruebas, edita `test-runner.html` y agrega:

```javascript
runner.test('Nombre de la prueba', () => {
  // Tu código de prueba aquí
  runner.assertEqual(actual, expected, 'Mensaje de error');
});
```

## Métodos de Aserción Disponibles

- `assertEqual(actual, expected, message)` - Verifica igualdad estricta
- `assertTrue(condition, message)` - Verifica que sea verdadero
- `assertFalse(condition, message)` - Verifica que sea falso
- `assertApproxEqual(actual, expected, tolerance, message)` - Verifica igualdad aproximada
- `assert(condition, message)` - Verifica condición general

## Ejemplos de Pruebas

```javascript
// Prueba simple
runner.test('Ejemplo: Contraseña tiene longitud correcta', () => {
  const analysis = PasswordAnalyzer.analyze('password');
  runner.assertEqual(analysis.length, 8, 'Longitud debe ser 8');
});

// Prueba con aproximación
runner.test('Ejemplo: Entropía es aproximadamente correcta', () => {
  const entropy = EntropyCalculator.calculate('password');
  runner.assertApproxEqual(entropy, 37.6, 1, 'Entropía debe ser aproximadamente 37.6');
});

// Prueba con múltiples aserciones
runner.test('Ejemplo: Contraseña tiene todas las características', () => {
  const analysis = PasswordAnalyzer.analyze('Password123!');
  runner.assertTrue(analysis.variety.hasLowercase, 'Debe tener minúsculas');
  runner.assertTrue(analysis.variety.hasUppercase, 'Debe tener mayúsculas');
  runner.assertTrue(analysis.variety.hasNumbers, 'Debe tener números');
  runner.assertTrue(analysis.variety.hasSymbols, 'Debe tener símbolos');
});
```

## Solución de Problemas

### Error: "Cannot find module"
- Asegúrate de estar ejecutando las pruebas desde el servidor local
- Verifica que los archivos de módulos existan en `js/modules/`

### Error: "CORS policy"
- Usa un servidor local para ejecutar las pruebas
- No abras el archivo HTML directamente desde el sistema de archivos

### Error: "Module not found"
- Verifica que los imports en `test-runner.html` sean correctos
- Asegúrate de que los módulos exporten correctamente las clases

## Notas

- Las pruebas se ejecutan de forma asíncrona
- Los errores se capturan y se muestran sin detener la ejecución
- Todas las pruebas se ejecutan independientemente
- El resultado final muestra un resumen de todas las pruebas

## Mejoras Futuras

- [ ] Agregar más pruebas para casos edge
- [ ] Agregar pruebas de rendimiento
- [ ] Agregar pruebas de integración
- [ ] Configurar CI/CD para ejecutar pruebas automáticamente
- [ ] Agregar cobertura de código
- [ ] Agregar pruebas visuales

---

**Nota**: Estas pruebas validan la funcionalidad básica de los módulos. Para pruebas más exhaustivas, considera agregar más casos de prueba y pruebas de integración.

