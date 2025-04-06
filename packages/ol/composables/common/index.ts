export const createToolTipElement = (text: string) => {
  const element = document.createElement('div');
  element.innerHTML = text;
  element.style.cursor = 'pointer';
  element.style.userSelect = 'none';
  element.style.backgroundColor = 'red';
  element.style.color = 'white';
  element.style.borderRadius = '5px';
  element.style.padding = '0 5px';
  element.style.fontSize = '12px';
  element.style.border = '2px solid white';
  return element;
};
