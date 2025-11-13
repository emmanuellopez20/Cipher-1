/**
 * Pruebas unitarias para Password Analyzer
 * Ejecutar con: node tests/password-analyzer.test.js
 */

// Importar módulos (simulado para Node.js)
// En el navegador estos serían importaciones ES6

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('=== Ejecutando Pruebas Unitarias ===\n');

    for (const test of this.tests) {
      try {
        await test.fn();
        console.log(`[PASS] ${test.name}`);
        this.passed++;
      } catch (error) {
        console.error(`[FAIL] ${test.name}`);
        console.error(`  Error: ${error.message}`);
        if (error.stack) {
          console.error(`  Stack: ${error.stack.split('\n')[1]}`);
        }
        this.failed++;
      }
    }

    console.log(`\n=== Resultados ===`);
    console.log(`Total: ${this.tests.length}`);
    console.log(`Pasadas: ${this.passed}`);
    console.log(`Fallidas: ${this.failed}`);
    console.log(`\n${this.failed === 0 ? 'Todas las pruebas pasaron!' : 'Algunas pruebas fallaron.'}`);

    return this.failed === 0;
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
  }

  assertTrue(condition, message) {
    this.assert(condition, message || 'Expected true');
  }

  assertFalse(condition, message) {
    this.assert(!condition, message || 'Expected false');
  }

  assertApproxEqual(actual, expected, tolerance = 0.1, message) {
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(message || `Expected approximately ${expected}, but got ${actual}`);
    }
  }
}

// Simular módulos para Node.js
// En producción, estos se cargarían desde los archivos reales
const EntropyCalculator = require('../js/modules/entropy-calculator.js');
const TimeEstimator = require('../js/modules/time-estimator.js');
const PatternDetector = require('../js/modules/pattern-detector.js');
const PasswordAnalyzer = require('../js/modules/password-analyzer.js');

const runner = new TestRunner();

// Pruebas para EntropyCalculator
runner.test('EntropyCalculator: Contraseña vacía retorna 0', () => {
  const entropy = EntropyCalculator.calculate('');
  runner.assertEqual(entropy, 0, 'Entropía de cadena vacía debe ser 0');
});

runner.test('EntropyCalculator: Contraseña con solo minúsculas', () => {
  const entropy = EntropyCalculator.calculate('password');
  runner.assertTrue(entropy > 0, 'Entropía debe ser mayor que 0');
  runner.assertApproxEqual(entropy, Math.log2(Math.pow(26, 8)), 1, 'Entropía debe ser aproximadamente log2(26^8)');
});

runner.test('EntropyCalculator: Contraseña con mayúsculas y minúsculas', () => {
  const entropy = EntropyCalculator.calculate('Password');
  runner.assertTrue(entropy > 0, 'Entropía debe ser mayor que 0');
  const expected = Math.log2(Math.pow(52, 8)); // 26 minúsculas + 26 mayúsculas
  runner.assertApproxEqual(entropy, expected, 1, 'Entropía debe aumentar con mayúsculas');
});

runner.test('EntropyCalculator: Contraseña con números', () => {
  const entropy = EntropyCalculator.calculate('password123');
  runner.assertTrue(entropy > 0, 'Entropía debe ser mayor que 0');
  const expected = Math.log2(Math.pow(36, 11)); // 26 minúsculas + 10 números
  runner.assertApproxEqual(entropy, expected, 1, 'Entropía debe aumentar con números');
});

runner.test('EntropyCalculator: Contraseña con símbolos', () => {
  const entropy = EntropyCalculator.calculate('password!');
  runner.assertTrue(entropy > 0, 'Entropía debe ser mayor que 0');
  const expected = Math.log2(Math.pow(58, 9)); // 26 minúsculas + 32 símbolos
  runner.assertApproxEqual(entropy, expected, 1, 'Entropía debe aumentar con símbolos');
});

runner.test('EntropyCalculator: getCharsetInfo detecta tipos correctamente', () => {
  const info = EntropyCalculator.getCharsetInfo('Password123!');
  runner.assertTrue(info.hasLowercase, 'Debe detectar minúsculas');
  runner.assertTrue(info.hasUppercase, 'Debe detectar mayúsculas');
  runner.assertTrue(info.hasNumbers, 'Debe detectar números');
  runner.assertTrue(info.hasSymbols, 'Debe detectar símbolos');
  runner.assertEqual(info.size, 94, 'Tamaño del charset debe ser 94 (26+26+10+32)');
});

// Pruebas para TimeEstimator
runner.test('TimeEstimator: Entropía 0 retorna tiempo inmediato', () => {
  const time = TimeEstimator.estimate(0, 'common');
  runner.assertEqual(time, 'Inmediato', 'Tiempo para entropía 0 debe ser inmediato');
});

runner.test('TimeEstimator: Estima tiempo para ataque común', () => {
  const entropy = 40;
  const time = TimeEstimator.estimate(entropy, 'common');
  runner.assertTrue(time !== 'Inmediato', 'Debe estimar tiempo para entropía 40');
  runner.assertTrue(typeof time === 'string', 'Tiempo debe ser un string');
});

runner.test('TimeEstimator: Estima tiempo para todos los ataques', () => {
  const entropy = 50;
  const times = TimeEstimator.estimateAll(entropy);
  runner.assertTrue(times.common !== undefined, 'Debe tener tiempo para ataque común');
  runner.assertTrue(times.advanced !== undefined, 'Debe tener tiempo para ataque avanzado');
  runner.assertTrue(times.massive !== undefined, 'Debe tener tiempo para ataque masivo');
  runner.assertTrue(times.quantum !== undefined, 'Debe tener tiempo para ataque cuántico');
});

runner.test('TimeEstimator: Ataque cuántico es más rápido que común', () => {
  const entropy = 60;
  const commonTime = TimeEstimator.estimate(entropy, 'common');
  const quantumTime = TimeEstimator.estimate(entropy, 'quantum');
  runner.assertTrue(quantumTime !== commonTime, 'Ataque cuántico debe tener tiempo diferente');
});

// Pruebas para PatternDetector
runner.test('PatternDetector: Detecta palabras comunes', () => {
  const patterns = PatternDetector.detect('password');
  runner.assertTrue(patterns.commonWords, 'Debe detectar "password" como palabra común');
});

runner.test('PatternDetector: Detecta secuencias', () => {
  const patterns = PatternDetector.detect('abc123');
  runner.assertTrue(patterns.sequences, 'Debe detectar secuencias');
});

runner.test('PatternDetector: Detecta repeticiones', () => {
  const patterns = PatternDetector.detect('password111');
  runner.assertTrue(patterns.repetitions, 'Debe detectar repeticiones');
});

runner.test('PatternDetector: Detecta patrones de teclado', () => {
  const patterns = PatternDetector.detect('qwerty');
  runner.assertTrue(patterns.keyboardPatterns, 'Debe detectar patrones de teclado');
});

runner.test('PatternDetector: Calcula penalización correctamente', () => {
  const patterns = PatternDetector.detect('password');
  runner.assertTrue(patterns.penalty > 0, 'Debe tener penalización para palabra común');
  runner.assertTrue(patterns.penalty <= 10, 'Penalización no debe exceder 10');
});

runner.test('PatternDetector: Contraseña sin patrones tiene penalización 0', () => {
  const patterns = PatternDetector.detect('Xk9$mP2#qR7');
  runner.assertEqual(patterns.penalty, 0, 'Contraseña sin patrones debe tener penalización 0');
});

// Pruebas para PasswordAnalyzer
runner.test('PasswordAnalyzer: Analiza contraseña vacía', () => {
  const analysis = PasswordAnalyzer.analyze('');
  runner.assertEqual(analysis.length, 0, 'Longitud debe ser 0');
  runner.assertEqual(analysis.entropy, 0, 'Entropía debe ser 0');
  runner.assertEqual(analysis.strength.score, 0, 'Score debe ser 0');
});

runner.test('PasswordAnalyzer: Analiza contraseña simple', () => {
  const analysis = PasswordAnalyzer.analyze('password');
  runner.assertEqual(analysis.length, 8, 'Longitud debe ser 8');
  runner.assertTrue(analysis.entropy > 0, 'Entropía debe ser mayor que 0');
  runner.assertTrue(analysis.strength.score >= 0, 'Score debe ser >= 0');
  runner.assertTrue(analysis.strength.score <= 100, 'Score debe ser <= 100');
});

runner.test('PasswordAnalyzer: Detecta variedad de caracteres', () => {
  const analysis = PasswordAnalyzer.analyze('Password123!');
  runner.assertTrue(analysis.variety.hasLowercase, 'Debe tener minúsculas');
  runner.assertTrue(analysis.variety.hasUppercase, 'Debe tener mayúsculas');
  runner.assertTrue(analysis.variety.hasNumbers, 'Debe tener números');
  runner.assertTrue(analysis.variety.hasSymbols, 'Debe tener símbolos');
  runner.assertEqual(analysis.variety.count, 4, 'Debe tener 4 tipos de caracteres');
});

runner.test('PasswordAnalyzer: Calcula fortaleza correctamente', () => {
  const analysis = PasswordAnalyzer.analyze('Xk9$mP2#qR7');
  runner.assertTrue(analysis.strength.score >= 70, 'Contraseña fuerte debe tener score >= 70');
  runner.assertEqual(analysis.strength.level, 'very-strong', 'Debe ser muy fuerte');
});

runner.test('PasswordAnalyzer: Genera feedback', () => {
  const analysis = PasswordAnalyzer.analyze('password');
  runner.assertTrue(analysis.feedback.length > 0, 'Debe generar feedback');
  runner.assertTrue(Array.isArray(analysis.feedback), 'Feedback debe ser un array');
});

runner.test('PasswordAnalyzer: Calcula tiempo de crackeo para todos los ataques', () => {
  const analysis = PasswordAnalyzer.analyze('Password123!');
  runner.assertTrue(analysis.crackTime.common !== undefined, 'Debe tener tiempo para ataque común');
  runner.assertTrue(analysis.crackTime.advanced !== undefined, 'Debe tener tiempo para ataque avanzado');
  runner.assertTrue(analysis.crackTime.massive !== undefined, 'Debe tener tiempo para ataque masivo');
  runner.assertTrue(analysis.crackTime.quantum !== undefined, 'Debe tener tiempo para ataque cuántico');
});

runner.test('PasswordAnalyzer: Contraseña débil tiene score bajo', () => {
  const analysis = PasswordAnalyzer.analyze('123');
  runner.assertTrue(analysis.strength.score < 30, 'Contraseña débil debe tener score < 30');
  runner.assertEqual(analysis.strength.level, 'weak', 'Debe ser débil');
});

runner.test('PasswordAnalyzer: Contraseña fuerte tiene score alto', () => {
  const analysis = PasswordAnalyzer.analyze('Xk9$mP2#qR7wL4@nB5');
  runner.assertTrue(analysis.strength.score >= 70, 'Contraseña fuerte debe tener score >= 70');
  runner.assertEqual(analysis.strength.level, 'very-strong', 'Debe ser muy fuerte');
});

// Ejecutar pruebas
if (require.main === module) {
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { TestRunner, runner };

