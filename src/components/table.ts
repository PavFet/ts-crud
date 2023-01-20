const countObjectProperties = (object: Object): number => Object.keys(object).length;

type RowData = {
  id: string,
  [key: string]: string,
};

export type TableProps<Type> = {
  title: string,
  columns: Type,
  rowsData: Type[],
  editedCarId: string | null,
  onDelete: (id: string) => void,
  onEdit: (id: string) => void,
};

class Table<Type extends RowData> {
  private props: TableProps<Type>;

  private tbody: HTMLTableSectionElement;

  private headerObj: Omit<Type, 'id'>;

  private thead: HTMLTableSectionElement;

  public htmlElement: HTMLTableElement;

  public constructor(props: TableProps<Type>) {
    this.props = props;
    const { id, ...headerObj } = this.props.columns;
    this.headerObj = headerObj;
    this.checkColumnsCompatability();

    this.htmlElement = document.createElement('table');
    this.thead = document.createElement('thead');
    this.tbody = document.createElement('tbody');

    this.initialize();
    this.renderView();
  }

  private checkColumnsCompatability = (): void => {
    const { rowsData, columns } = this.props;

    if (this.props.rowsData.length === 0) return;
    const columnCount = countObjectProperties(columns);

    const columnsCompatableWithRowsData = rowsData.every((row) => {
      const rowCellsCount = countObjectProperties(row);

      return rowCellsCount === columnCount;
    });

    if (!columnsCompatableWithRowsData) {
      throw new Error('Nesutampa lentelės stulpelių skaičius su eilučių stulpelių skaičiumi');
    }
  };

  private initialize = (): void => {
    this.htmlElement.className = 'table table-dark table-striped p-3';
    this.htmlElement.append(
      this.thead,
      this.tbody,
    );
  };

  private renderView = (): void => {
    this.renderHeadView();
    this.renderBodyView();
  };

  private renderHeadView = (): void => {
    const { title } = this.props;
    const headersArray = Object.values(this.headerObj);
    const headersRowHtmlString = `${headersArray.map((header) => `<th>${header}</th>`).join('')}<th>OPTIONS</th>`;

    this.thead.innerHTML = `
      <tr>
        <th colspan="${headersArray.length + 1}" class="text-center h3">${title}</th>
      </tr>
      <tr>${headersRowHtmlString}</tr>`;
  };

  private renderBodyView = (): void => {
    const { rowsData } = this.props;

    this.tbody.innerHTML = '';
    const rowsHtmlElements = rowsData
      .map((rowData) => {
        const rowHtmlElement = document.createElement('tr');

        const cellsHtmlString = Object.keys(this.headerObj)
          .map((key) => `<td>${rowData[key]}</td>`)
          .join(' ');

        rowHtmlElement.innerHTML = cellsHtmlString;

        this.addActionsCell(rowHtmlElement, rowData.id);

        return rowHtmlElement;
      });

    this.tbody.append(...rowsHtmlElements);
  };

  private addActionsCell = (tr: HTMLTableRowElement, id: string): void => {
    const { onDelete, onEdit, editedCarId } = this.props;

    const buttonCell = document.createElement('td');
    buttonCell.className = 'd-flex justify-content-center gap-3';

    const isCancelButton = editedCarId === id;
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.innerHTML = isCancelButton ? 'Cancel' : '✎';
    editButton.className = `btn btn-${isCancelButton ? 'dark' : 'warning'}`;
    editButton.style.width = '80px';
    editButton.addEventListener('click', () => onEdit(id));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.innerHTML = 'Delete';
    deleteButton.className = 'btn btn-danger';
    deleteButton.style.width = '80px';
    deleteButton.addEventListener('click', () => onDelete(id));

    buttonCell.append(editButton, deleteButton);
    tr.append(buttonCell);
  };

  public updateProps = (newProps: Partial<TableProps<Type>>): void => {
    this.props = {
      ...this.props,
      ...newProps,
    };

    this.renderView();
  };
}

export default Table;
