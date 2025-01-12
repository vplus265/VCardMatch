class GameStorage {
  /**
   * @param name name of value to get 
   * @param default_value returns this value if the storage does not have requested value
   */
  static read(name, default_value) {
    return localStorage.getItem(`vcardsmatch_${name}`) || default_value;
  }

  static save(name, value) {
    localStorage.setItem(`vcardsmatch_${name}`, value);
  }
}