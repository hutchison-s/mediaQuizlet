// Shortcut functions for selecting DOM elements
export const elid = (id) => document.getElementById(id);
export const elsel = (selector) => document.querySelector(selector);
export const elall = (selector) => document.querySelectorAll(selector);

// Function to create new DOM element with optional id and class
export const newEl = (type, id = null, cl = null) => {
  const el = document.createElement(type);
  if (id) {
    el.id = id;
  }
  if (cl) {
    el.classList.add(cl);
  }
  return el;
};

export default {elid, elsel, elall, newEl};