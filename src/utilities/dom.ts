export function getCaretPosition(element: HTMLElement): number {
  let position = 0;

  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();

    if (selection?.rangeCount !== 0) {
      const range = window.getSelection()!.getRangeAt(0);
      const preCaretRange = range.cloneRange();

      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);

      position = preCaretRange.toString().length;
    }
  }

  return position;
}

export function setCaretPosition(element: HTMLElement, index: number) {
  const selectedText = window.getSelection();
  const selectedRange = document.createRange();

  selectedRange.setStart(element.childNodes[0], index);
  selectedRange.collapse(true);
  selectedText?.removeAllRanges();
  selectedText?.addRange(selectedRange);

  element.focus(); 
}