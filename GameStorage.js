class GameStorage {
  static read(name, default_value) {
    return localStorage.getItem(`vcardsmatch_${name}`) || default_value;
  }

  static save(name, value) { 
    localStorage.setItem(`vcardsmatch_${name}`, value);
  }
  
  // removes everything 
  static clear(){
    localStorage.clear();
  }
}