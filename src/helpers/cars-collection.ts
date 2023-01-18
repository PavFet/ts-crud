import type Car from '../types/car';
import type Model from '../types/model';
import type Brand from '../types/brand';
import type CarJoined from '../types/car-joined';

type CarsCollectionProps = {
  cars: Car[],
  brands: Brand[],
  models: Model[],
};

class CarsCollection {
  private props: CarsCollectionProps;

  public constructor(props: CarsCollectionProps) {
    this.props = props;
  }

  private joinCar = ({ modelId, ...car }: Car) => {
    const { brands, models } = this.props;
    const carModel = models.find((model) => model.id === modelId);
    const carBrand = brands.find((brand) => brand.id === carModel?.brandId);

    return {
      ...car,
      brand: (carBrand && carBrand.title) ?? 'unknown',
      model: (carModel && carModel.title) ?? 'unknown',
    };
  };

  public getByBrandId = (brandId: string): CarJoined[] => {
    const { cars, models } = this.props;

    const brandModelsIds = models
      .filter((model) => model.brandId === brandId)
      .map((model) => model.id);

    const brandCars = cars
      .filter((car) => brandModelsIds.includes(car.modelId))
      .map(this.joinCar);

    return brandCars;
  };

  public get allCars(): CarJoined[] {
    return this.props.cars.map(this.joinCar);
  }

  public deleteCarById = (carId: string): void => {
    this.props.cars = this.props.cars.filter((car) => car.id !== carId);
  };
}

export default CarsCollection;
