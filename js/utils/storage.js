/**
 * Storage - Utilidades para localStorage
 */
export class Storage {
  /**
   * Guarda un valor en localStorage
   * @param {string} key - Clave
   * @param {*} value - Valor a guardar
   */
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      return false;
    }
  }

  /**
   * Obtiene un valor de localStorage
   * @param {string} key - Clave
   * @param {*} defaultValue - Valor por defecto si no existe
   * @returns {*} Valor almacenado o valor por defecto
   */
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return defaultValue;
    }
  }

  /**
   * Elimina un valor de localStorage
   * @param {string} key - Clave
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from localStorage:', e);
      return false;
    }
  }

  /**
   * Limpia todo el localStorage
   */
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      return false;
    }
  }
}

