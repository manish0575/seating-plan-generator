let excelData = [];



// ========================
// GENERATE PAGES
// ========================

document
  .getElementById("generateBtn")
  .addEventListener("click", function () {

    generatePages();

});





function generatePages() {

  const output =
    document.getElementById("output");

  output.innerHTML = "";



  const collegeName =
    document.getElementById("collegeName").value;

  const examName =
    document.getElementById("examName").value;

  const semester =
    document.getElementById("semester").value;

  const examTime =
    document.getElementById("examTime").value;

  const totalPages =
    parseInt(document.getElementById("totalPages").value);

  const rows =
    parseInt(document.getElementById("rows").value);

  const cols =
    parseInt(document.getElementById("cols").value);



  for (let p = 1; p <= totalPages; p++) {

    const page =
      document.createElement("div");

    page.className = "page";



    // =====================
    // HEADER PART
    // =====================

    page.innerHTML = `

    <div class="edit-bar">

      <input type="text"
        value="${100 + p}"
        class="roomInput">

      <input type="number"
        value="${rows}"
        class="rowInput">

      <input type="number"
        value="${cols}"
        class="colInput">

      <button onclick="updatePage(this)">
        Modify
      </button>

    </div>



    <div class="title">

      <h1>${collegeName}</h1>

      <h2>${examName}</h2>

      <h3>SEATING PLAN</h3>

    </div>



    <div class="top-info">

      <div class="left-info">

        Date : ${new Date().toLocaleDateString()}
        <br>

        Semester : ${semester}

      </div>

      <div>

        Time :- ${examTime}

      </div>

    </div>



    <div class="room">

      Room No :
      <span class="roomText">
        ${100 + p}
      </span>

    </div>



    <div class="table-container"></div>



    <div class="bottom-box">

      <table>

        <tr>
          <td></td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
        </tr>

      </table>

    </div>

    `;



    output.appendChild(page);



    createTable(page, rows, cols);

  }

}





// ========================
// CREATE TABLE
// ========================

function createTable(page, rows, cols) {

  const tableContainer =
    page.querySelector(".table-container");



  let table =
    `<table class="seatTable">`;



  // HEADER

  table += `<tr>`;

  table += `<th>S.No</th>`;


  for (let c = 0; c < cols; c++) {

    table += `
      <th>Col-${c + 1}</th>
    `;
  }

  table += `</tr>`;



  // BODY

  for (let r = 0; r < rows; r++) {

    table += `<tr>`;



    table += `
      <td>${r + 1}</td>
    `;



    for (let c = 0; c < cols; c++) {

      table += `
        <td></td>
      `;
    }



    table += `</tr>`;
  }



  table += `</table>`;



  tableContainer.innerHTML = table;

}





// ========================
// MODIFY PAGE
// ========================

function updatePage(btn) {

  const page =
    btn.closest(".page");



  const roomNo =
    page.querySelector(".roomInput").value;

  const rows =
    parseInt(
      page.querySelector(".rowInput").value
    );

  const cols =
    parseInt(
      page.querySelector(".colInput").value
    );



  page.querySelector(".roomText")
    .innerText = roomNo;



  createTable(page, rows, cols);

}





// ========================
// FILL DATA BUTTON
// ========================

const fillBtn =
  document.createElement("button");

fillBtn.innerText =
  "Fill Data";

document
  .querySelector(".controls")
  .appendChild(fillBtn);





fillBtn.addEventListener("click", function () {

  const file =
    document.getElementById("excelFile").files[0];



  if (!file) {

    alert("Select Excel File");

    return;
  }



  const reader =
    new FileReader();



  reader.onload = function (e) {

    const data =
      new Uint8Array(e.target.result);



    const workbook =
      XLSX.read(data, {
        type: "array"
      });



    const sheetName =
      workbook.SheetNames[0];



    const worksheet =
      workbook.Sheets[sheetName];



    const jsonData =
      XLSX.utils.sheet_to_json(
        worksheet,
        { header: 1 }
      );



    excelData = jsonData
      .map(row => row[0])
      .filter(item => item !== undefined);



    fillAllPages();

  };



  reader.readAsArrayBuffer(file);

});





// ========================
// FILL ALL PAGES
// ========================

function fillAllPages() {

  let currentIndex = 0;



  const pages =
    document.querySelectorAll(".page");



  pages.forEach(page => {

    const rows =
      parseInt(
        page.querySelector(".rowInput").value
      );



    const cols =
      parseInt(
        page.querySelector(".colInput").value
      );



    const table =
      page.querySelector(".seatTable");



    const tableRows =
      table.querySelectorAll("tr");



    // BODY STARTS FROM 1
    for (let r = 1; r <= rows; r++) {

      const cells =
        tableRows[r].querySelectorAll("td");



      for (let c = 1; c <= cols; c++) {

        // PERFECT VERTICAL FILL
        const dataIndex =
          currentIndex +
          ((c - 1) * rows) +
          (r - 1);



        cells[c].innerText =
          excelData[dataIndex] || "";

      }

    }



    // IMPORTANT FIX
    currentIndex += rows * cols;

  });

}