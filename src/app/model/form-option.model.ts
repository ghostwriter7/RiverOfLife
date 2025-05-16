export class FormOption<V extends string> {
  constructor(
    public readonly label: string,
    public readonly value: V,
  ) {
  }
}
