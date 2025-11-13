/**
 * Password Analyzer - Analiza la fortaleza de una contraseña
 */
import { EntropyCalculator } from './entropy-calculator.js';
import { TimeEstimator } from './time-estimator.js';
import { PatternDetector } from './pattern-detector.js';

export class PasswordAnalyzer {
  /**
   * Analiza una contraseña completamente
   * @param {string} password - Contraseña a analizar
   * @returns {Object} Análisis completo de la contraseña
   */
  static analyze(password) {
    if (!password) {
      return this.getEmptyAnalysis();
    }

    // Longitud
    const length = password.length;

    // Variedad de caracteres
    const variety = this.getVariety(password);

    // Entropía
    const entropy = EntropyCalculator.calculate(password);

    // Patrones
    const patterns = PatternDetector.detect(password);

    // Tiempo de descifrado
    const crackTime = TimeEstimator.estimateAll(entropy);

    // Fortaleza (score 0-100)
    const strength = this.calculateStrength(length, variety, entropy, patterns);

    // Feedback
    const feedback = this.getFeedback(length, variety, entropy, patterns, strength);

    return {
      password,
      length,
      variety,
      entropy: Math.round(entropy * 10) / 10,
      strength,
      crackTime,
      patterns,
      feedback
    };
  }

  /**
   * Obtiene la variedad de caracteres
   * @param {string} password - Contraseña a analizar
   * @returns {Object} Información de variedad
   */
  static getVariety(password) {
    const charsetInfo = EntropyCalculator.getCharsetInfo(password);
    const types = [
      charsetInfo.hasLowercase ? 'minúsculas' : null,
      charsetInfo.hasUppercase ? 'mayúsculas' : null,
      charsetInfo.hasNumbers ? 'números' : null,
      charsetInfo.hasSymbols ? 'símbolos' : null
    ].filter(Boolean);

    const count = types.length;
    const max = 4;

    return {
      hasLowercase: charsetInfo.hasLowercase,
      hasUppercase: charsetInfo.hasUppercase,
      hasNumbers: charsetInfo.hasNumbers,
      hasSymbols: charsetInfo.hasSymbols,
      count,
      max,
      score: count / max,
      description: count === 0 ? 'Ninguno' : types.join(', ')
    };
  }

  /**
   * Calcula la fortaleza de la contraseña (score 0-100)
   * @param {number} length - Longitud
   * @param {Object} variety - Variedad de caracteres
   * @param {number} entropy - Entropía
   * @param {Object} patterns - Patrones detectados
   * @returns {Object} Información de fortaleza
   */
  static calculateStrength(length, variety, entropy, patterns) {
    let score = 0;

    // Puntos por longitud (máx 40 puntos)
    score += Math.min(length * 2, 40);

    // Puntos por variedad (máx 20 puntos)
    score += variety.score * 20;

    // Puntos por entropía (máx 30 puntos)
    score += Math.min(entropy / 2, 30);

    // Penalización por patrones (máx -10 puntos)
    score -= patterns.penalty;

    // Asegurar que el score esté entre 0 y 100
    score = Math.max(0, Math.min(100, score));

    // Determinar nivel de fortaleza
    let level, color;
    if (score < 30) {
      level = 'weak';
      color = '#ef4444'; // rojo
    } else if (score < 50) {
      level = 'moderate';
      color = '#f59e0b'; // naranja
    } else if (score < 70) {
      level = 'strong';
      color = '#eab308'; // amarillo
    } else {
      level = 'very-strong';
      color = '#22c55e'; // verde
    }

    return {
      score: Math.round(score),
      level,
      color
    };
  }

  /**
   * Obtiene feedback sobre la contraseña
   * @param {number} length - Longitud
   * @param {Object} variety - Variedad
   * @param {number} entropy - Entropía
   * @param {Object} patterns - Patrones
   * @param {Object} strength - Fortaleza
   * @returns {Array<string>} Array de mensajes de feedback
   */
  static getFeedback(length, variety, entropy, patterns, strength) {
    const feedback = [];

    // Feedback sobre longitud
    if (length < 8) {
      feedback.push('La contraseña es muy corta. Se recomienda al menos 8 caracteres.');
    } else if (length < 12) {
      feedback.push('La contraseña tiene una longitud aceptable.');
    } else {
      feedback.push('La contraseña tiene una buena longitud.');
    }

    // Feedback sobre variedad
    if (variety.count < 2) {
      feedback.push('Agrega más tipos de caracteres (mayúsculas, números, símbolos).');
    } else if (variety.count < 4) {
      feedback.push('Buen uso de variedad de caracteres.');
    } else {
      feedback.push('Excelente variedad de caracteres.');
    }

    // Feedback sobre patrones
    if (patterns.commonWords) {
      feedback.push('[!] Evita palabras comunes del diccionario.');
    }
    if (patterns.sequences) {
      feedback.push('[!] Evita secuencias comunes (123, abc, qwerty).');
    }
    if (patterns.repetitions) {
      feedback.push('[!] Evita repeticiones excesivas de caracteres.');
    }

    // Feedback general
    if (strength.score >= 70) {
      feedback.push('[OK] Contraseña muy fuerte.');
    } else if (strength.score >= 50) {
      feedback.push('[OK] Contraseña fuerte.');
    } else if (strength.score >= 30) {
      feedback.push('[!] Contraseña moderada. Considera mejorarla.');
    } else {
      feedback.push('[X] Contraseña débil. Se recomienda cambiarla.');
    }

    return feedback;
  }

  /**
   * Obtiene análisis vacío
   * @returns {Object} Análisis vacío
   */
  static getEmptyAnalysis() {
    return {
      password: '',
      length: 0,
      variety: {
        hasLowercase: false,
        hasUppercase: false,
        hasNumbers: false,
        hasSymbols: false,
        count: 0,
        max: 4,
        score: 0,
        description: 'Ninguno'
      },
      entropy: 0,
      strength: {
        score: 0,
        level: 'weak',
        color: '#ef4444'
      },
      crackTime: {
        common: 'Inmediato',
        advanced: 'Inmediato',
        massive: 'Inmediato',
        quantum: 'Inmediato'
      },
      patterns: {
        commonWords: false,
        sequences: false,
        repetitions: false,
        keyboardPatterns: false,
        penalty: 0
      },
      feedback: ['Escribe una contraseña para analizarla.']
    };
  }
}

