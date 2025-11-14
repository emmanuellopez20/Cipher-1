/**
 * Storage - Utilidades para sessionStorage
 */
export class Storage {
  /**
   * Guarda un valor en sessionStorage
   * @param {string} key - Clave
   * @param {*} value - Valor a guardar
   */
  static set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error saving to sessionStorage:', e);
      return false;
    }
  }

  /**
   * Obtiene un valor de sessionStorage
   * @param {string} key - Clave
   * @param {*} defaultValue - Valor por defecto si no existe
   * @returns {*} Valor almacenado o valor por defecto
   */
  static get(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (e) {
      console.error('Error reading from sessionStorage:', e);
      return defaultValue;
    }
  }

  /**
   * Elimina un valor de sessionStorage
   * @param {string} key - Clave
   */
  static remove(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from sessionStorage:', e);
      return false;
    }
  }

  /**
   * Limpia todo el sessionStorage
   */
  static clear() {
    try {
      sessionStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing sessionStorage:', e);
      return false;
    }
  }
}



