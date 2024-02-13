const list = document.querySelector("#list");

async function start() {
  try {
    const resp = await fetch("data.json");
    let data = null;
    await resp.json().then((result) => {
      if (result && result.services) {
        data = result.services;

        // Группируем элементы по head и сортируем их внутри каждого узла
        const groupedData = groupAndSortByHead(data);
        console.log(groupedData);

        // Преобразуем обратно в одномерный массив
        data = [].concat(...Object.values(groupedData));
      }
    });
    await render(data);
  } catch (err) {
    console.log(err);
  }
}

function groupAndSortByHead(data) {
  const groupedData = {};

  // Группируем элементы по head
  data.forEach((item) => {
    const head = item.head || 0; // Если head не указан, считаем элемент корневым
    groupedData[head] = groupedData[head] || [];
    groupedData[head].push(item);
  });

  // Сортируем элементы внутри каждого узла по sorthead
  for (const head in groupedData) {
    groupedData[head].sort((a, b) => a.sorthead - b.sorthead);
  }

  return groupedData;
}

function render(data = []) {
  const html = data.map(toHTML).join("");
  list.innerHTML = html;
}

function toHTML(data) {
  return `
    <li class="list-group-item">
      ${data.head > 0 ? "&nbsp;&nbsp;" : ""}
      ${data.node === 1 ? `<div class="arrow ${data.head > 0 ? "triangle-right" : "triangle-down"}"></div>` : ""}
      ${data.name}: ${data.price}
    </li>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  start(); // Вызываем функцию start после загрузки документа
});