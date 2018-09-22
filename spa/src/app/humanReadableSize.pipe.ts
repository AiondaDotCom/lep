import { Pipe, PipeTransform } from '@angular/core';
/*
 * Formatiert die übergebene Zahl als lesbare Dateigröße
 * Usage:
 *   filesize | humanReadableSize:binary
 * Example:
 *   {{ 1024 | humanReadableSize:1 }}
 *   formats to: 1
 * Example:
 *   {{ 1000 | humanReadableSize:0 }}
 *   formats to: 1
 * 
*/
@Pipe({name: 'humanReadableSize'})
export class HumanReadableSize implements PipeTransform {
  transform(size: number, useBinary=true): string {
    // https://notetops.wordpress.com/2014/11/28/angularjs-filter-to-format-file-size/
    var base, prefixes;
   
      if (useBinary) {
        base = 1024;
        prefixes = ['Ki','Mi','Gi','Ti','Pi','Ei','Zi','Yi'];
      }
      else {
        base = 1000;
        prefixes = ['k','M','G','T','P','E','Z','Y'];
      }
   
      var exp = Math.log(size) / Math.log(base) | 0;

      return `${(size / Math.pow(base, exp)).toFixed(1)} ${((exp > 0) ? prefixes[exp - 1] + 'B' : 'Bytes')}`;
  }
}