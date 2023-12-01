const workEl = document.getElementById("work");
const isDoneEl = document.getElementById("isDone");
const tbodyEl = document.querySelector("tbody");
const updateWorkEl = document.getElementById("updateWork");
const updateIsDoneEl = document.getElementById("updateIsDone");
const updateFormEl = document.getElementById("updateForm");
const saveFormEl = document.getElementById("saveForm");
const todos = [];
let updateIndex = 0;

function save(e) {
    e.preventDefault();

    const currentDate = new Date();
    const isDoneValue = isDoneEl.checked;
    const rowColorClass = isDoneValue ? "done-row" : "not-done-row";

    const obj = {
        work: workEl.value,
        isDone: isDoneEl.checked,
        createDate: currentDate,
        updateDate: null
    };

    todos.push(obj);

    addList();

    workEl.value = "";
    workEl.focus();
    isDoneEl.checked = false;

    toastr.info('Bir kayıt eklendi!');
}

function remove(index) {
    const rowId = "tr" + (+index + 1);
    const rowElement = document.getElementById(rowId);
    const originalColor = rowElement.style.backgroundColor; // Store original color

    // Highlight the row in light blue
    rowElement.style.backgroundColor = "orange";

    Swal.fire({
        title: "Emin misiniz?",
        text: "Silinen kaydı geri getiremezsiniz!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Silebiliriz",
        cancelButtonText: "Vazgeç"
    }).then((result) => {
        if (result.isConfirmed) {
            // Delay for 0.5 seconds (500 milliseconds)
            setTimeout(() => {
                // Silme işlemi burada gerçekleştirilebilir
                Swal.fire({
                    title: "Geri getirmek için artık çok geç!",
                    text: "Listenizdeki kayıt başarıyla silindi.",
                    icon: "success",
                    confirmButtonText: "Tamam"
                });

                todos.splice(index, 1);
                const el = document.getElementById(rowId);
                el.remove();

                addList();
            }, 500);
        } else {
            // Reset the background color to the original color if the user cancels
            rowElement.style.backgroundColor = originalColor;
        }
    });
}


function addList() {
    let text = "";
    for (let i in todos) {
        text += ` 
            <tr class="${todos[i].isDone ? "done-row" : "not-done-row"}" id="tr${+i + 1}">
                <td>${+i + 1}</td>
                <td>${todos[i].work}</td>
                <td>${todos[i].isDone ? "Yapıldı." : "Yapılacak!"} </td>
                <td>
                    <button class="edit-button" onclick="edit('${i}')">Güncelle</button>
                    <button class="remove-button" onclick="remove('${i}')">Sil</button>    
                </td>
                <td>${todos[i].createDate.toLocaleString()}</td>
                <td>${todos[i].updateDate ? todos[i].updateDate.toLocaleString() : ""}</td>
            </tr>
            `;
    }

    tbodyEl.innerHTML = text;
}

function edit(index) {
    updateIndex = index;

    // Remove highlighting from previously selected row
    const prevSelectedRow = document.querySelector(".selected-row");
    if (prevSelectedRow) {
        prevSelectedRow.style.backgroundColor = ""; // Reset background color
    }

    // Highlight the selected row
    const selectedRow = document.getElementById("tr" + (+index + 1));
    selectedRow.style.backgroundColor = "lightblue"; // Change background color to yellow or any desired color

    updateFormEl.style.display = "block";
    saveFormEl.style.display = "none";

    updateWorkEl.value = todos[index].work;
    updateIsDoneEl.checked = todos[index].isDone;

    // Hareketlenmeyi engellemek için class ekleniyor
    document.body.classList.add("no-scroll");

    // Hide all "Güncelle" and "Sil" buttons
    const allOperationButtons = document.querySelectorAll(".edit-button, .remove-button");
    allOperationButtons.forEach(button => {
        button.style.display = "none";
    });
}



// ... (unchanged JavaScript code) ...

function cancel() {
    updateFormEl.style.display = "none";
    saveFormEl.style.display = "block";

    // Show all "Güncelle" and "Sil" buttons
    const allOperationButtons = document.querySelectorAll(".edit-button, .remove-button");
    allOperationButtons.forEach(button => {
        button.style.display = "inline-block"; // Set the display property accordingly
    });

    // Hareketlenmeyi engellemek için class kaldırılıyor
    document.body.classList.remove("no-scroll");

    // Remove highlighting from the selected row
    const selectedRow = document.getElementById("tr" + (+updateIndex + 1));
    if (selectedRow) {
        selectedRow.style.backgroundColor = ""; // Reset background color
    }
}

function update(e) {
    e.preventDefault();

    const updateDate = new Date();
    Swal.fire({
        title: "Emin misiniz?",
        text: "Güncellenen kaydı geri getiremezsiniz!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Vazgeç",
        confirmButtonText: "Güncelleyebiliriz!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Güncellendi!",
                text: "Listenizdeki kayıt başarıyla güncellendi.",
                icon: "success"
            });

            // Update data in todos array only if confirmed
            todos[updateIndex].work = updateWorkEl.value;
            todos[updateIndex].isDone = updateIsDoneEl.checked;
            todos[updateIndex].updateDate = updateDate;

            addList();
            cancel();
        }
    });
}

