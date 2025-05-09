import { Injectable, Type } from '@angular/core'
import { DialogComponent } from '../../interfaces/dialog-component.interface';

@Injectable({providedIn: 'root'})
export class DialogService {
  private readonly dialogMap = new Map<Type<DialogComponent>, DialogComponent>();

  public register(componentType: Type<DialogComponent>, dialog: DialogComponent): void {
    this.dialogMap.set(componentType, dialog);
  }

  public open<T extends DialogComponent>(componentType: Type<T>, inputs: Parameters<T['open']>[0]): void {
    const dialogRef = this.dialogMap.get(componentType);

    if (!dialogRef) throw new Error(`Dialog with type ${componentType.name} is not registered`);

    dialogRef.open(inputs);
  }

  public close<T extends DialogComponent>(componentType: Type<T>): ReturnType<T['close']> {
    const dialogRef = this.dialogMap.get(componentType) as T;

    if (!dialogRef) throw new Error(`Dialog with type ${componentType.name} is not registered`);

    return dialogRef.close();
  }
}
