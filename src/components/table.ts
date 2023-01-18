export type TableProps<Type> = {
  title: string,
  columns: Type,
  rowsData: Type[],
  onDelete: (id: string) => void,
};

type RowData = {
  id: string,
  [key: string]: string,
};

class Table<T extends RowData> {
  public htmlElement: HTMLTableElement;

  private props: TableProps<T>;

  private tbody: HTMLTableSectionElement;

  private thead: HTMLTableSectionElement;

  public constructor(props: TableProps<T>) {
    this.props = props;
    this.htmlElement = document.createElement('table');
    this.thead = document.createElement('thead');
    this.tbody = document.createElement('tbody');

    this.initialize();
    this.renderView();
  }

  private initializeHead = () => {
    const { title, columns } = this.props;

    const headersArrays = Object.values(columns);
    const headersRowHtmlStr = `${headersArrays.map((header) => `<th>${header}</th>`).join('')}<th></th>`;

    this.thead.innerHTML = `
    <tr>
      <th colspan="${headersArrays.length + 1}" class="text-center h3">${title}</th>
    </tr>
    <tr>${headersRowHtmlStr}</tr>
    `;
  };

  private initializeTbody = () => {
    const { rowsData, columns } = this.props;

    this.tbody.innerHTML = '';
    const rowsHtmlElements = rowsData.map((rowData) => {
      const rowHtmlElement = document.createElement('tr');

      const cellsHtmlStr = Object.keys(columns).map((key) => `<td>${rowData[key]}</td>`).join(' ');

      rowHtmlElement.innerHTML = cellsHtmlStr;
      return rowHtmlElement;
    });
    this.tbody.append(...rowsHtmlElements);
  };

   private initialize = (): void => {
    this.initializeHead();
    this.initializeTbody();

    this.htmlElement.className = 'table table-dark table-striped';
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
    const { title, columns } = this.props;

    const headersArray = Object.values(columns);
    const headersRowHtmlString = headersArray.map((header) => `<th>${header}</th>`).join('');

    this.thead.innerHTML = `
      <tr>
        <th colspan="${headersArray.length}" class="text-center h3">${title}</th>
      </tr>
      <tr>${headersRowHtmlString}</tr>`;
  };

  private renderBodyView = (): void => {
    const { rowsData, columns } = this.props;

    this.tbody.innerHTML = '';
    const rowsHtmlElements = rowsData
      .map((rowData) => {
        const rowHtmlElement = document.createElement('tr');

        const cellsHtmlString = Object.keys(columns)
          .map((key) => `<td>${rowData[key]}</td>`)
          .join(' ');

        rowHtmlElement.innerHTML = cellsHtmlString;

        this.addActionsCell(rowHtmlElement, rowData.id);

        return rowHtmlElement;
      });

    this.tbody.append(...rowsHtmlElements);
  };

  private addActionsCell = (rowHtmlElement: HTMLTableRowElement, id: string): void => {
    const { onDelete } = this.props;

    const buttonCell = document.createElement('td');

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.innerHTML = 'Delete';
    deleteButton.className = 'btn btn-danger';
    deleteButton.addEventListener('click', () => onDelete(id));
    deleteButton.style.width = '80px';

    buttonCell.append(deleteButton);
    rowHtmlElement.append(buttonCell);
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
