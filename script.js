let clipboard = null;
let selectedFileElement = null;
let selectedStorage = null;

document.addEventListener('DOMContentLoaded', () => {

    const storages = [

    ];

    const storageListDiv = document.getElementById('storageList');
    storages.forEach(storage => {
        const storageItemDiv = document.createElement('div');
        storageItemDiv.classList.add('storage-item');
        storageItemDiv.textContent = `${storage.name} (${storage.type}) - ${storage.id}`;
        storageItemDiv.onclick = () => {
            selectedStorage = storage;
            displayFiles(storage);
        };
        storageListDiv.appendChild(storageItemDiv);
    });
    const storageOptions = document.querySelectorAll('.storage-option');
    storageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const storageType = option.getAttribute('data-type');
            addEmptyStorage(storageType);
            showMainPage();
        });
    });

    /*document.getElementById('addButton').addEventListener('click', addEmptyStorage);*/
    document.getElementById('addButton').addEventListener('click', showAddStoragePage);
    document.getElementById('removeButton').addEventListener('click', removeSelectedStorage);
    document.getElementById('copyButton').addEventListener('click', copyFile);
    document.getElementById('pasteButton').addEventListener('click', pasteFile);
    document.getElementById('deleteButton').addEventListener('click', deleteFile);
    document.getElementById('backButton').addEventListener('click', showMainPage);
});

function addEmptyStorage(storageType) {
    const storageListDiv = document.getElementById('storageList');
    const storageItemDiv = document.createElement('div');
    storageItemDiv.classList.add('storage-item');

    const newStorage = {
        name: 'Empty Storage',
        type: storageType,
        id: Date.now().toString(),
        files: ['file1.txt', 'file2.txt', 'image.png']
    };

    storageItemDiv.setAttribute('data-id', newStorage.id);
    storageItemDiv.textContent = `${newStorage.name} (${newStorage.type}) - ${newStorage.id}`;
    storageItemDiv.onclick = () => {
        selectedStorage = newStorage;
        displayFiles(newStorage);
    };

    storageListDiv.appendChild(storageItemDiv);
    storages.push(newStorage);
}


function removeSelectedStorage() {
    if (selectedStorage) {
        const selected = document.querySelector('.storage-item.selected');
        if (selected) {
            selected.remove();
            const fileBrowserDiv = document.querySelector('.file-browser .file-list');
            fileBrowserDiv.innerHTML = '';
            const pathDiv = document.querySelector('.file-browser .path');
            pathDiv.textContent = 'Path:';
            selectedStorage = null;
        }
    }
}
function showAddStoragePage() {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('addStoragePage').style.display = 'block';
}

function showMainPage() {
    document.getElementById('addStoragePage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'flex';
}
function copyFile() {
    if (selectedFileElement) {
        clipboard = selectedFileElement.textContent;
        alert(`Copied: ${clipboard}`);
    }
}

function pasteFile() {
    if (clipboard && selectedStorage) {
        selectedStorage.files.push(clipboard);
        displayFiles(selectedStorage);
        alert(`Pasted: ${clipboard}`);
    }
}

function deleteFile() {
    if (selectedFileElement && selectedStorage) {
        const index = selectedStorage.files.indexOf(selectedFileElement.textContent);
        if (index > -1) {
            selectedStorage.files.splice(index, 1);
            displayFiles(selectedStorage);
            selectedFileElement = null;
            alert('File deleted.');
        }
    }
}

function displayFiles(storage) {
    const storageItems = document.querySelectorAll('.storage-item');
    storageItems.forEach(item => {
        item.classList.remove('selected');
    });

    const selectedStorageItem = document.querySelector(`.storage-item[data-id="${storage.id}"]`);
    if (selectedStorageItem) {
        selectedStorageItem.classList.add('selected');
    }

    const fileBrowserDiv = document.querySelector('.file-browser .file-list');
    fileBrowserDiv.innerHTML = '';

    storage.files.forEach(file => {
        const fileDiv = document.createElement('div');
        fileDiv.classList.add('file-item');
        fileDiv.textContent = file;
        fileDiv.onclick = function() {
            const selectedFileItem = document.querySelector('.file-item.selected');
            if (selectedFileItem) {
                selectedFileItem.classList.remove('selected');
            }
            fileDiv.classList.add('selected');
            selectedFileElement = fileDiv;
        };
        fileBrowserDiv.appendChild(fileDiv);
    });

    const pathDiv = document.querySelector('.file-browser .path');
    pathDiv.textContent = `Path: /${storage.name}`;
}
