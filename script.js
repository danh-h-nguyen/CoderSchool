const BASE_URL = "https://frcz3-8080.csb.app";

let pageNumber = 1;
let search;
let url;
let pageMiddle;
let newButton;

async function getJobs(pageNumber, search) {
  try {
    url = search
      ? `${BASE_URL}/jobs?_page=${pageNumber}&title_like=${search}`
      : `${BASE_URL}/jobs?_page=${pageNumber}`;

    console.log(url);
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      const listOfJobs = data;
      return listOfJobs;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

const renderJobs = async (pageNumber, search) => {
  try {
    const jobs = await getJobs(pageNumber, search);

    const list = document.querySelector("#list");
    list.innerHTML = "";

    jobs.forEach((job) => {
      const newLi = document.createElement("li");
      newLi.innerHTML = `
           ${job.title}
        `;
      list.appendChild(newLi);
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

const disabledPage = (pageNumber) => {
  previousButton.disabled = pageNumber === 1;
  pageFirst.disabled = pageNumber === 1;

  pageMiddle = document.querySelector("#pageMiddle");
  pageMiddle.innerHTML = "";
  if (pageNumber < 4) {
    for (let i = 1; i <= 4; i++) {
      newButton = document.createElement("button");
      newButton.innerHTML = i;
      newButton.id = `page${i}`;
      pageMiddle.appendChild(newButton);
    }
    const ellipsisButton = document.createElement("button");
    ellipsisButton.innerHTML = "...";
    pageMiddle.appendChild(ellipsisButton);
  } else {
    const ellipsisButtonBefore = document.createElement("button");
    ellipsisButtonBefore.innerHTML = "...";
    pageMiddle.appendChild(ellipsisButtonBefore);
    for (let i = pageNumber - 1; i <= pageNumber + 1; i++) {
      newButton = document.createElement("button");
      newButton.innerHTML = i;
      if (newButton.innerHTML !== "...") {
        newButton.id = `page${i}`;
      }
      pageMiddle.appendChild(newButton);
    }
    const ellipsisButtonAfter = document.createElement("button");
    ellipsisButtonAfter.innerHTML = "...";
    pageMiddle.appendChild(ellipsisButtonAfter);
  }
};

const highlightSelectedPage = (pageNumber) => {
  const selectedPage = document.querySelector(`#page${pageNumber}`);
  selectedPage.id = `selectedPage`;
};

let previousButton = document.querySelector("#previousButton");
let pageFirst = document.querySelector("#pageFirst");
let pageLast = document.querySelector("#pageLast");
let nextButton = document.querySelector("#nextButton");
let searchInput = document.querySelector("#searchInput");

renderJobs(pageNumber, search);
disabledPage(pageNumber);
highlightSelectedPage(pageNumber);

nextButton.addEventListener("click", () => {
  pageNumber = pageNumber + 1;
  disabledPage(pageNumber);
  renderJobs(pageNumber, search);
  highlightSelectedPage(pageNumber);
});

previousButton.addEventListener("click", () => {
  pageNumber = pageNumber === 1 ? 1 : pageNumber - 1;
  disabledPage(pageNumber);
  renderJobs(pageNumber, search);
  highlightSelectedPage(pageNumber);
});

pageFirst.addEventListener("click", () => {
  pageNumber = 1;
  disabledPage(pageNumber);
  renderJobs(pageNumber, search);
  highlightSelectedPage(pageNumber);
});

searchInput.addEventListener("input", () => {
  search = searchInput.value;
  renderJobs(pageNumber, search);
});
