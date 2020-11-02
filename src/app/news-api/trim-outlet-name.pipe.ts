import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimOutletName'
})
export class TrimOutletNamePipe implements PipeTransform {

  transform(title: string, outletName: string): any {
    // const endIndex = title.indexOf(outletName);
    // return title.substring(0, endIndex - 2);
    return title.replace(` - ${outletName}`, '');
  }

}
