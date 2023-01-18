import CarsCollection from '../helpers/cars-collection';
import Table from './table';
import cars from '../data/cars';
import brands from '../data/brands';
import models from '../data/models';
import stringifyProps, { StringifyObjectProps } from '../helpers/stringify-object';
import CarJoined from '../types/car-joined';
import SelectField from './select-field';

class App {
  private htmlElement: HTMLElement;

  private selectedBrandId: null | string;

  private brandSelect: SelectField;

  private carTable: Table<StringifyObjectProps<CarJoined>>;

  private carsCollection: CarsCollection;

  public constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);
    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);
    this.carsCollection = new CarsCollection({ cars, brands, models });

    this.carTable = new Table({
      title: 'Car list',
      columns: {
        id: 'ID',
        brand: 'Brand',
        model: 'Model',
        price: 'Price',
        year: 'Year',
      },
      rowsData: this.carsCollection.allCars.map(stringifyProps),
    });
    this.brandSelect = new SelectField({
      labelText: 'Brand',
      options: brands.map(({ id, title }) => ({ title, value: id })),
      onChange: this.handleBrandChange,
    });
    this.selectedBrandId = null;

    this.htmlElement = foundElement;

    this.initialize();
  }

  private handleBrandChange = (brandId: string): void => {
    this.selectedBrandId = brandId;
  };

  public initialize = (): void => {
    const container = document.createElement('div');
    container.className = 'container my-3';
    container.append(
      this.brandSelect.htmlElement,
      this.carTable.htmlElement,
    );

    this.htmlElement.append(container);
  };
}

export default App;
