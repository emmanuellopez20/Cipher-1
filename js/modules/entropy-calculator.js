/**
 * Entropy Calculator - Calcula la entropía de una contraseña
 */
export class EntropyCalculator {
  /**
   * Calcula la entropía de una contraseña
   * @param {string} password - Contraseña a analizar
   * @returns {number} Entropía en bits
   */
  static calculate(password) {
    if (!password || password.length === 0) {
      return 0;
    }

    // Detectar charset utilizado
    let charsetSize = 0;
    
    // Minúsculas (a-z)
    if (/[a-z]/.test(password)) {
      charsetSize += 26;
    }
    
    // Mayúsculas (A-Z)
    if (/[A-Z]/.test(password)) {
      charsetSize += 26;
    }
    
    // Números (0-9)
    if (/[0-9]/.test(password)) {
      charsetSize += 10;
    }
    
    // Símbolos comunes
    if (/[^a-zA-Z0-9]/.test(password)) {
      // Caracteres especiales comunes: !@#$%^&*()_+-=[]{}|;:,.<>?
      charsetSize += 32;
    }

    // Calcular entropía: log2(charsetSize^length)
    const entropy = Math.log2(Math.pow(charsetSize, password.length));

    return entropy;
  }

  /**
   * Calcula el charset utilizado
   * @param {string} password - Contraseña a analizar
   * @returns {Object} Información del charset
   */
  static getCharsetInfo(password) {
    return {
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSymbols: /[^a-zA-Z0-9]/.test(password),
      size: this.getCharsetSize(password)
    };
  }

  /**
   * Obtiene el tamaño del charset
   * @param {string} password - Contraseña a analizar
   * @returns {number} Tamaño del charset
   */
  static getCharsetSize(password) {
    let size = 0;
    
    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/[0-9]/.test(password)) size += 10;
    if (/[^a-zA-Z0-9]/.test(password)) size += 32;
    
    return size;
  }
}



