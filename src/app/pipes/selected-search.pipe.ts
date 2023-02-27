import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Pipe({
  name: 'selectedSearch',
})
export class SelectedSearchPipe implements PipeTransform {
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

@NgModule({
  imports: [CommonModule],
  declarations: [SelectedSearchPipe],
  exports: [SelectedSearchPipe],
})
export class SelectedSearchPipeModule {}
