/**
 * Time Estimator - Estima el tiempo para descifrar una contraseña
 */
export class TimeEstimator {
  // Ataques en intentos por segundo
  static ATTACKS = {
    common: 1e6,        // 1 millón de intentos/seg (ataque común)
    advanced: 1e9,      // 1 billón de intentos/seg (ataque avanzado)
    massive: 1e12,      // 1 trillón de intentos/seg (ataque masivo)
    quantum: 1e15       // 1 cuatrillón de intentos/seg (ataque cuántico)
  };

  /**
   * Estima el tiempo para descifrar una contraseña
   * @param {number} entropy - Entropía en bits
   * @param {string} attackType - Tipo de ataque (common, advanced, massive, quantum)
   * @returns {string} Tiempo estimado formateado
   */
  static estimate(entropy, attackType = 'common') {
    if (entropy <= 0) {
      return 'Inmediato';
    }

    const combinations = Math.pow(2, entropy);
    const attemptsPerSecond = this.ATTACKS[attackType] || this.ATTACKS.common;
    const seconds = combinations / attemptsPerSecond;

    return this.formatTime(seconds);
  }

  /**
   * Estima el tiempo para todos los tipos de ataques
   * @param {number} entropy - Entropía en bits
   * @returns {Object} Tiempos estimados para cada tipo de ataque
   */
  static estimateAll(entropy) {
    return {
      common: this.estimate(entropy, 'common'),
      advanced: this.estimate(entropy, 'advanced'),
      massive: this.estimate(entropy, 'massive'),
      quantum: this.estimate(entropy, 'quantum')
    };
  }

  /**
   * Formatea el tiempo en unidades legibles
   * @param {number} seconds - Tiempo en segundos
   * @returns {string} Tiempo formateado
   */
  static formatTime(seconds) {
    if (seconds < 1) {
      return 'Menos de 1 segundo';
    }

    if (seconds < 60) {
      return `${Math.round(seconds)} segundo${Math.round(seconds) !== 1 ? 's' : ''}`;
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
      return `${Math.round(minutes)} minuto${Math.round(minutes) !== 1 ? 's' : ''}`;
    }

    const hours = minutes / 60;
    if (hours < 24) {
      return `${Math.round(hours)} hora${Math.round(hours) !== 1 ? 's' : ''}`;
    }

    const days = hours / 24;
    if (days < 30) {
      return `${Math.round(days)} día${Math.round(days) !== 1 ? 's' : ''}`;
    }

    const months = days / 30;
    if (months < 12) {
      return `~${Math.round(months)} mes${Math.round(months) !== 1 ? 'es' : ''}`;
    }

    const years = days / 365;
    if (years < 1000) {
      return `~${Math.round(years)} año${Math.round(years) !== 1 ? 's' : ''}`;
    }

    const centuries = years / 100;
    return `~${Math.round(centuries)} siglo${Math.round(centuries) !== 1 ? 's' : ''}`;
  }
}

