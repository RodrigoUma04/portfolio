import { Pipe, PipeTransform } from '@angular/core';

export interface AccentPart { text: string; accent: boolean; bold: boolean; }

@Pipe({ name: 'accent' })
export class AccentPipe implements PipeTransform {
  transform(value: string | null | undefined): AccentPart[] {
    if (!value) return [];
    const parts: AccentPart[] = [];
    const regex = /\{\{(.+?)\}\}|\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(value)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: value.slice(lastIndex, match.index), accent: false, bold: false });
      }
      if (match[1] === undefined) {
        parts.push({text: match[2], accent: false, bold: true});
      } else {
        parts.push({text: match[1], accent: true, bold: false});
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < value.length) {
      parts.push({ text: value.slice(lastIndex), accent: false, bold: false });
    }
    return parts;
  }
}
