document.addEventListener('DOMContentLoaded', () => {
    const loadDataButton = document.getElementById('load-data');
    const clearButton = document.getElementById('clear');
    const statusDiv = document.getElementById('status');
    const tableContainer = document.getElementById('table-container');

    let tableCreated = false;
    

    let currentSortColumn = null; 
    let isAscending = true; 

    loadDataButton.addEventListener('click', () => {
        const url = document.getElementById('url-input').value;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                statusDiv.textContent = `Дані формату JSON успішно завантажено. Кількість записів рівна ${data.length}.`;
                loadDataButton.disabled = true;
                clearButton.disabled = false;
                if (!tableCreated) { 
                    createTable(data);
                    tableCreated = true;
                }
            })
            .catch(error => {
                statusDiv.textContent = `Помилка: ${error.message}`;
            });
    });

    

    clearButton.addEventListener('click', () => {
        document.getElementById('url-input').value = '';
        statusDiv.textContent = '';
        tableContainer.innerHTML = '';
        loadDataButton.disabled = false;
        clearButton.disabled = true;
        tableCreated = false;
        
        const tableOption = document.querySelector('.table-option');
        const tableButtons = document.querySelector('.table-buttons');
        const tableRow = document.querySelector('.row');
        if (tableOption) tableOption.remove();
        if (tableButtons) tableButtons.remove();
        if (tableRow) tableRow.remove();
    });

    function createTable(data) {

        const tableOption = document.querySelector('.table-option');
        const tableButtons = document.querySelector('.table-buttons');
        const tableRow = document.querySelector('.row');
        if (tableOption) tableOption.remove();
        if (tableButtons) tableButtons.remove();
        if (tableRow) tableRow.remove();

        addInterfaceElements();
        const table = document.createElement('div');
        table.className = 'table';

        const columns = ['ID', 'NAME', 'USERNAME', 'EMAIL'];
        columns.forEach(col => {
            const header = document.createElement('div');
            header.className = 'header-cell';
        
            const sortButtonAsc = document.createElement('button');
            sortButtonAsc.className = 'sort-button';
            sortButtonAsc.textContent = '▲';
            sortButtonAsc.dataset.column = col.toLowerCase();
            header.appendChild(sortButtonAsc);
        
            const columnName = document.createElement('span');
            columnName.textContent = col;
            header.appendChild(columnName);
        
            const sortButtonDesc = document.createElement('button');
            sortButtonDesc.className = 'sort-button';
            sortButtonDesc.textContent = '▼';
            sortButtonDesc.dataset.column = col.toLowerCase();
            header.appendChild(sortButtonDesc);
        
            const column = document.createElement('div');
            column.className = 'column';
            column.appendChild(header);
        
            data.forEach(item => {
                const cell = document.createElement('div');
                cell.className = 'table-cell';
                cell.textContent = item[col.toLowerCase()];
                column.appendChild(cell);
            });
        
            table.appendChild(column);
        });
        
        

        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);

        const sortButtons = document.querySelectorAll('.sort-button');
        sortButtons.forEach(button => {
            button.addEventListener('click', () => {
                const column = button.dataset.column;

                if (currentSortColumn === column) {
                    isAscending = !isAscending;
                } else {
                    currentSortColumn = column; 
                    isAscending = true; 
                }

                data.sort((a, b) => {
                    const valueA = isNaN(parseFloat(a[column])) ? a[column] : parseFloat(a[column]);
                    const valueB = isNaN(parseFloat(b[column])) ? b[column] : parseFloat(b[column]);
                
                    if (isAscending) {
                        if (valueA < valueB) return -1;
                        if (valueA > valueB) return 1;
                        return 0;
                    } else {
                        if (valueA > valueB) return -1;
                        if (valueA < valueB) return 1;
                        return 0;
                    }
                });
                

                createTable(data);
                
                const headers = document.querySelectorAll('.header-cell');
                headers.forEach(header => {
                    if (header.dataset.column === currentSortColumn) {
                        header.classList.toggle('sorted', true);
                        header.classList.toggle('ascending', isAscending);
                        
                    } else {
                        header.classList.remove('sorted', 'ascending');
                    }
                });
            });
        });
    }

    function addInterfaceElements() {
        const tableOptionHTML = `
        <p class="table-option">Відобразити Ваш варіант таблиці?</p>
        <div class="table-buttons">
            <button class="btn light-green">Так</button>
            <button class="btn red">Ні</button>
        </div>
        <div class="row">
            <h2 class="table-title">ТАБЛИЦЯ ДЛЯ ВАРІАНТУ 2</h2>
            <button class="btn red sort-clear">Очистити сортування</button>
        </div>
        `;
        tableContainer.insertAdjacentHTML('beforebegin', tableOptionHTML);

    }
});



