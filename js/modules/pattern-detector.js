/**
 * Pattern Detector - Detecta patrones comunes en contraseñas
 */
export class PatternDetector {
  // Palabras comunes
  static COMMON_WORDS = [
    'password', 'password1', 'password123', 'admin', 'administrator',
    '123456', '12345678', 'qwerty', 'abc123', 'letmein', 'welcome',
    'monkey', 'dragon', 'master', 'sunshine', 'ashley', 'bailey',
    'shadow', 'michael', 'jennifer', 'jordan', 'superman', 'harley'
  ];

  // Secuencias comunes
  static SEQUENCES = [
    '123', '1234', '12345', '123456', '1234567', '12345678', '123456789',
    'abc', 'abcd', 'abcde', 'abcdef', 'qwerty', 'qwertyui', 'asdf',
    'qwertz', 'azerty', '987654321', '87654321', '7654321'
  ];

  /**
   * Detecta patrones comunes en una contraseña
   * @param {string} password - Contraseña a analizar
   * @returns {Object} Información de patrones detectados
   */
  static detect(password) {
    if (!password || password.length === 0) {
      return {
        commonWords: false,
        sequences: false,
        repetitions: false,
        keyboardPatterns: false,
        penalty: 0
      };
    }

    const lowerPassword = password.toLowerCase();
    
    return {
      commonWords: this.detectCommonWords(lowerPassword),
      sequences: this.detectSequences(password),
      repetitions: this.detectRepetitions(password),
      keyboardPatterns: this.detectKeyboardPatterns(password),
      penalty: this.calculatePenalty(password, lowerPassword)
    };
  }

  /**
   * Detecta palabras comunes
   * @param {string} password - Contraseña en minúsculas
   * @returns {boolean} True si contiene palabras comunes
   */
  static detectCommonWords(password) {
    return this.COMMON_WORDS.some(word => password.includes(word));
  }

  /**
   * Detecta secuencias comunes
   * @param {string} password - Contraseña a analizar
   * @returns {boolean} True si contiene secuencias comunes
   */
  static detectSequences(password) {
    return this.SEQUENCES.some(seq => password.toLowerCase().includes(seq.toLowerCase()));
  }

  /**
   * Detecta repeticiones excesivas
   * @param {string} password - Contraseña a analizar
   * @returns {boolean} True si tiene repeticiones excesivas
   */
  static detectRepetitions(password) {
    // Detectar caracteres repetidos 3 o más veces consecutivas
    const repetitionPattern = /(.)\1{2,}/;
    return repetitionPattern.test(password);
  }

  /**
   * Detecta patrones de teclado
   * @param {string} password - Contraseña a analizar
   * @returns {boolean} True si contiene patrones de teclado
   */
  static detectKeyboardPatterns(password) {
    // Patrones comunes de teclado
    const keyboardPatterns = [
      'qwerty', 'asdf', 'zxcv', 'qwertz', 'azerty',
      '1234', '5678', 'qwer', 'asdf', 'zxcv'
    ];
    
    return keyboardPatterns.some(pattern => 
      password.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Calcula la penalización por patrones comunes
   * @param {string} password - Contraseña a analizar
   * @param {string} lowerPassword - Contraseña en minúsculas
   * @returns {number} Penalización (0-10)
   */
  static calculatePenalty(password, lowerPassword) {
    let penalty = 0;

    // Penalización por palabras comunes
    if (this.detectCommonWords(lowerPassword)) {
      penalty += 5;
    }

    // Penalización por secuencias
    if (this.detectSequences(password)) {
      penalty += 3;
    }

    // Penalización por repeticiones
    if (this.detectRepetitions(password)) {
      penalty += 2;
    }

    // Penalización por patrones de teclado
    if (this.detectKeyboardPatterns(password)) {
      penalty += 2;
    }

    return Math.min(penalty, 10);
  }
}

