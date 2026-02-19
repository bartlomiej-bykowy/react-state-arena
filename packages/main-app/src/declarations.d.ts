declare global {
  interface WindowEventMap {
    "rsa:state-request": CustomEvent;
  }
}
