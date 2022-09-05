//#region Declaration
import { Job } from "./job";
// const url = "/data/data.json";
const url = "https://monaelshikh.github.io/static-job-listings/data/data.json";
let jobs: Job[];
let filteredJobs: Job[];
let jobsListDiv = document.querySelector(".jobs-list") as HTMLDivElement;
let filtersDiv = document.querySelector(".filters") as HTMLDivElement;
let boxesDiv = document.querySelector(".boxes") as HTMLDivElement;
let clearfilters = document.querySelector(".clear");
let Filters = {
  role: Array(0),
  level: Array(0),
  languages: Array(0),
  tools: Array(0),
};
//#endregion
//#region Functions
function addToLocalStorage(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}
function getFromLocalStorage(key: string): any {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key) || "");
  }
  return "";
}
async function getJobs(): Promise<void> {
  // get data from api
  let data = (await fetch(url)).json();
  jobs = await data;
  // check if there are jobs list in storage
  filteredJobs = getFromLocalStorage("jobs-list");
  if (!filteredJobs) {
    filteredJobs = jobs;
    addToLocalStorage("jobs-list", jobs);
  }
  addJobsToPage();
}
// function to add jobs to DOM dynamiclly
function addJobsToPage(): void {
  let jobsList: Job[] = getFromLocalStorage("jobs-list");
  jobsListDiv.innerHTML = ""; //reset jobs list
  console.log("jobs from add to page fun>", jobsList);
  if (jobsList.length > 0) {
    jobsList.forEach((job: Job) => {
      // create the job box
      let jobDiv = document.createElement("div");
      jobDiv.className = "job";
      /********** 1- job-data div **********/
      let jobDataDiv = document.createElement("div");
      jobDataDiv.className = "job-data";
      // Job data content
      //--1 logo
      let companyLogo = document.createElement("img");
      companyLogo.src = job.logo;
      companyLogo.alt = job.company;
      jobDataDiv.appendChild(companyLogo);
      //--2 info div
      let InfoDiv = document.createElement("div");
      InfoDiv.className = "info";
      // info div content
      //--1 company div
      let companyDiv = document.createElement("div");
      companyDiv.className = "company";
      let companyNameSpan = document.createElement("span");
      companyDiv.appendChild(companyNameSpan);
      companyNameSpan.innerHTML = job.company;
      if (job.new) {
        let newSpan = document.createElement("span");
        newSpan.innerHTML = "new!";
        companyDiv.appendChild(newSpan);
      }
      if (job.featured) {
        let featureSpan = document.createElement("span");
        featureSpan.innerHTML = "featured";
        companyDiv.appendChild(featureSpan);
      }
      InfoDiv.appendChild(companyDiv);
      //--2 position div
      let positionDiv = document.createElement("div");
      positionDiv.className = "position";
      let positionNameSpan = document.createElement("span");
      positionNameSpan.innerHTML = job.position;
      positionDiv.appendChild(positionNameSpan);
      InfoDiv.appendChild(positionDiv);
      //--3 contract div
      let contractDiv = document.createElement("div");
      contractDiv.className = "contract";
      let splitSpan = document.createElement("span");
      splitSpan.innerHTML = ".";
      let postedAtSpan = document.createElement("span");
      postedAtSpan.innerHTML = job.postedAt;
      let contractSpan = document.createElement("span");
      contractSpan.innerHTML = job.contract;
      let locationSpan = document.createElement("span");
      locationSpan.innerHTML = job.location;
      contractDiv.appendChild(postedAtSpan);
      contractDiv.appendChild(splitSpan);
      contractDiv.appendChild(contractSpan);
      contractDiv.appendChild(splitSpan.cloneNode(true));
      contractDiv.appendChild(locationSpan);
      InfoDiv.appendChild(contractDiv);
      // add info div to data div and data div to job idv
      jobDataDiv.appendChild(InfoDiv);
      jobDiv.appendChild(jobDataDiv);
      /********** End job-data div **********/

      /**********2- filters div **********/
      let jobfiltersDiv = document.createElement("div");
      jobfiltersDiv.className = "job-filters";
      // role
      let roleSpan = document.createElement("span");
      roleSpan.className = "filter";
      roleSpan.setAttribute("data-filter", "role");
      roleSpan.innerHTML = job.role;
      roleSpan.addEventListener("click", (event: any) => {
        addFiletrCriteria(event);
        filterJobs();
      });
      jobfiltersDiv.appendChild(roleSpan);
      // level
      let levelSpan = document.createElement("span");
      levelSpan.className = "filter";
      levelSpan.setAttribute("data-filter", "level");
      levelSpan.innerHTML = job.level;
      levelSpan.addEventListener("click", (event: any) => {
        addFiletrCriteria(event);
        filterJobs();
      });
      jobfiltersDiv.appendChild(levelSpan);
      // check for languages
      if (job.languages.length > 0) {
        job.languages.forEach((lang) => {
          let langSpan = document.createElement("span");
          langSpan.className = "filter";
          langSpan.setAttribute("data-filter", "languages");
          langSpan.innerHTML = lang;
          langSpan.addEventListener("click", (event: any) => {
            addFiletrCriteria(event);
            filterJobs();
          });
          jobfiltersDiv.appendChild(langSpan);
        });
      }
      // check for tools
      if (job.tools.length > 0) {
        job.tools.forEach((tool) => {
          let toolSpan = document.createElement("span");
          toolSpan.className = "filter";
          toolSpan.setAttribute("data-filter", "tools");
          toolSpan.innerHTML = tool;
          toolSpan.addEventListener("click", (event: any) => {
            addFiletrCriteria(event);
            filterJobs();
          });
          jobfiltersDiv.appendChild(toolSpan);
        });
      }
      jobDiv.appendChild(jobfiltersDiv);
      jobsListDiv?.appendChild(jobDiv);
    });
  }
}
//#region Filter Functions
// function to load filters from storage if exsists
function loadFilters(): void {
  let preferdFilters = getFromLocalStorage("filters");
  if (preferdFilters) {
    //if there r stored filters get them and add the filtered jobs to the page
    Filters = preferdFilters;
  }
  addFiltersToPage();
}
// function to add choosen filters to the top of the page.
function addFiltersToPage(): void {
  if (dStructureFilters().length == 0) {
    filtersDiv.style.display = "none";
  } else {
    filtersDiv.style.display = "flex";
    boxesDiv.innerHTML = "";
    for (let filter in Filters) {
      if (Filters[filter].length > 0) {
        Filters[filter].forEach((item: string) => {
          boxesDiv?.appendChild(createFilterComponent(filter, item));
        });
      }
    }
  }
}
// function to store choosen filetrs in Filters Object
function addFiletrCriteria(event: any): false | undefined {
  // add each filter with its type to use it in filter operation.
  let _filters = dStructureFilters();
  if (_filters.includes(event.target.innerHTML)) {
    return false;
  } else {
    switch (event.target.dataset.filter) {
      case "role":
        Filters.role.push(event.target.innerHTML);
        break;
      case "level":
        Filters.level.push(event.target.innerHTML);
        break;
      case "languages":
        Filters.languages.push(event.target.innerHTML);
        break;
      case "tools":
        Filters.tools.push(event.target.innerHTML);
        break;
    }
  }

  addToLocalStorage("filters", Filters);
  addFiltersToPage();
}
// function to create filter component
//and add it on page load or when click on any filter
function createFilterComponent(key: string, value: string): HTMLDivElement {
  let filterDiv = document.createElement("div") as HTMLDivElement;
  filterDiv.className = "filter";
  filterDiv.setAttribute("data-filter", key);
  let filterNameSpan = document.createElement("span");
  filterNameSpan.innerHTML = value;
  let closeSpan = document.createElement("span");
  let closeImg = document.createElement("img");
  closeImg.src = "images/icon-remove.svg";
  closeImg.alt = "Close";
  closeSpan.addEventListener("click", removeFilter);
  closeSpan.appendChild(closeImg);
  filterDiv.appendChild(filterNameSpan);
  filterDiv.appendChild(closeSpan);
  return filterDiv;
}
function filterJobs(): void {
  filteredJobs = jobs.filter((job) => isValidFilter(job));
  console.log("Filtered jobs are > ", filteredJobs);
  addToLocalStorage("jobs-list", filteredJobs);
  addJobsToPage();
}
// function to check if filter is in job
function isValidFilter(item: {
  role: string;
  level: string;
  languages: string[];
  tools: string[];
}) {
  let tags = dStructureFilters();
  console.log("tags are > ", tags);
  let valid = true;
  tags.forEach((tag) => {
    if (
      item.role !== tag &&
      item.level !== tag &&
      !item.languages.includes(tag) &&
      !item.tools.includes(tag)
    ) {
      valid = false;
    }
  });
  return valid;
}
// function to dsturcure filters object and return array of all filters
function dStructureFilters() {
  let { role, level, languages, tools } = Filters;
  let tags = [...role, ...level, ...languages, ...tools];
  return tags;
}
// function to remove filters
function removeFilter(event: any): void {
  let filterKey = event.target.parentNode.parentNode.dataset.filter;
  let filterValue =
    event.target.parentNode.parentNode.querySelector("span").innerHTML;
  for (let filter in Filters) {
    if (filterKey == filter) {
      if (Filters[filter].length > 0) {
        Filters[filter] = Filters[filter].filter(
          (item: string) => item != filterValue
        );
      }
    }
  }
  addToLocalStorage("filters", Filters);
  addFiltersToPage();
  // if all filters removed , fill the storage with the full jobs list and load the page
  if (dStructureFilters().length == 0) {
    addToLocalStorage("jobs-list", jobs);
    addJobsToPage();
  } else {
    // add filters to page and filter records
    filterJobs();
  }
}
// function to clear all filters
function clearFilters(): void {
  clearfilters?.addEventListener("click", () => {
    addToLocalStorage("filters", {
      role: [],
      level: [],
      languages: [],
      tools: [],
    });
    loadFilters();
    addToLocalStorage("jobs-list", jobs);
    addJobsToPage();
  });
}

//#endregion
//#endregion
//#region Calls
getJobs();
loadFilters();
clearFilters();
// getFiltersButtons();
//#endregion
