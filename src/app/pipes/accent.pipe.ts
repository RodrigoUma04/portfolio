import { Pipe, PipeTransform } from '@angular/core';

export interface AccentPart { text: string; accent: boolean; }

@Pipe({ name: 'accent' })
export class AccentPipe implements PipeTransform {
  transform(value: string | null | undefined): AccentPart[] {
    if (!value) return [];
    const parts: AccentPart[] = [];
    const regex = /\{\{(.+?)\}\}/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(value)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: value.slice(lastIndex, match.index), accent: false });
      }
      parts.push({ text: match[1], accent: true });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < value.length) {
      parts.push({ text: value.slice(lastIndex), accent: false });
    }
    return parts;
  }
}