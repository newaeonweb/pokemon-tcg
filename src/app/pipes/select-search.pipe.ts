import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectSearch',
})
export class SelectSearchPipe implements PipeTransform {
  transform(items: any[], searchTxt: string): any[] {
    if (!items || !items.length) return items;
    if (!searchTxt || !searchTxt.length) return items;
    return items.filter((item) => {
      console.log(item.name);
      return (
        item.name.toString().toLowerCase().indexOf(searchTxt.toLowerCase()) > -1
      );
    });
  }
}
