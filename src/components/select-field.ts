type OptionType = {
  title: string,
  value: string,
};

export type SelectFieldProps = {
  labelText: string,
  onChange: (newValue: string) => void,
  options: OptionType[],
};

class SelectField {
  private static uniqId = 0;

  private props: SelectFieldProps;

  private htmlSelectElement: HTMLSelectElement;

  private htmlLabelElement: HTMLLabelElement;

  public htmlElement: HTMLDivElement;

  constructor(props: SelectFieldProps) {
    this.props = props;

    SelectField.uniqId += 1;
    this.htmlElement = document.createElement('div');
    this.htmlSelectElement = document.createElement('select');
    this.htmlLabelElement = document.createElement('label');

    this.initialize();
  }

  private initialize = (): void => {
    const elementId = `select-${SelectField.uniqId}`;

    this.htmlLabelElement.setAttribute('for', elementId);

    this.htmlSelectElement.className = 'form-select';
    this.htmlSelectElement.id = elementId;

    this.htmlElement.className = 'form-group my-5';
    this.htmlElement.append(
      this.htmlLabelElement,
      this.htmlSelectElement,
    );
  };
}

export default SelectField;
