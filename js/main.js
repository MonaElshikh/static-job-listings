var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const url = "https://monaelshikh.github.io/static-job-listings/data/data.json";
let jobs;
let filteredJobs;
let jobsListDiv = document.querySelector(".jobs-list");
let filtersDiv = document.querySelector(".filters");
let boxesDiv = document.querySelector(".boxes");
let clearfilters = document.querySelector(".clear");
let Filters = {
    role: Array(0),
    level: Array(0),
    languages: Array(0),
    tools: Array(0),
};
function addToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function getFromLocalStorage(key) {
    if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key) || "");
    }
    return "";
}
function getJobs() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = (yield fetch(url)).json();
        jobs = yield data;
        filteredJobs = getFromLocalStorage("jobs-list");
        if (!filteredJobs) {
            filteredJobs = jobs;
            addToLocalStorage("jobs-list", jobs);
        }
        addJobsToPage();
    });
}
function addJobsToPage() {
    let jobsList = getFromLocalStorage("jobs-list");
    jobsListDiv.innerHTML = "";
    console.log("jobs from add to page fun>", jobsList);
    if (jobsList.length > 0) {
        jobsList.forEach((job) => {
            let jobDiv = document.createElement("div");
            jobDiv.className = "job";
            let jobDataDiv = document.createElement("div");
            jobDataDiv.className = "job-data";
            let companyLogo = document.createElement("img");
            companyLogo.src = job.logo;
            companyLogo.alt = job.company;
            jobDataDiv.appendChild(companyLogo);
            let InfoDiv = document.createElement("div");
            InfoDiv.className = "info";
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
            let positionDiv = document.createElement("div");
            positionDiv.className = "position";
            let positionNameSpan = document.createElement("span");
            positionNameSpan.innerHTML = job.position;
            positionDiv.appendChild(positionNameSpan);
            InfoDiv.appendChild(positionDiv);
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
            jobDataDiv.appendChild(InfoDiv);
            jobDiv.appendChild(jobDataDiv);
            let jobfiltersDiv = document.createElement("div");
            jobfiltersDiv.className = "job-filters";
            let roleSpan = document.createElement("span");
            roleSpan.className = "filter";
            roleSpan.setAttribute("data-filter", "role");
            roleSpan.innerHTML = job.role;
            roleSpan.addEventListener("click", (event) => {
                addFiletrCriteria(event);
                filterJobs();
            });
            jobfiltersDiv.appendChild(roleSpan);
            let levelSpan = document.createElement("span");
            levelSpan.className = "filter";
            levelSpan.setAttribute("data-filter", "level");
            levelSpan.innerHTML = job.level;
            levelSpan.addEventListener("click", (event) => {
                addFiletrCriteria(event);
                filterJobs();
            });
            jobfiltersDiv.appendChild(levelSpan);
            if (job.languages.length > 0) {
                job.languages.forEach((lang) => {
                    let langSpan = document.createElement("span");
                    langSpan.className = "filter";
                    langSpan.setAttribute("data-filter", "languages");
                    langSpan.innerHTML = lang;
                    langSpan.addEventListener("click", (event) => {
                        addFiletrCriteria(event);
                        filterJobs();
                    });
                    jobfiltersDiv.appendChild(langSpan);
                });
            }
            if (job.tools.length > 0) {
                job.tools.forEach((tool) => {
                    let toolSpan = document.createElement("span");
                    toolSpan.className = "filter";
                    toolSpan.setAttribute("data-filter", "tools");
                    toolSpan.innerHTML = tool;
                    toolSpan.addEventListener("click", (event) => {
                        addFiletrCriteria(event);
                        filterJobs();
                    });
                    jobfiltersDiv.appendChild(toolSpan);
                });
            }
            jobDiv.appendChild(jobfiltersDiv);
            jobsListDiv === null || jobsListDiv === void 0 ? void 0 : jobsListDiv.appendChild(jobDiv);
        });
    }
}
function loadFilters() {
    let preferdFilters = getFromLocalStorage("filters");
    if (preferdFilters) {
        Filters = preferdFilters;
    }
    addFiltersToPage();
}
function createFilterComponent(key, value) {
    let filterDiv = document.createElement("div");
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
function checkFilter(source = [], match = "") {
    return {
        filterExsists: source.includes(match),
        FiltersLength: Filters["role"].length == 0 &&
            Filters["level"].length == 0 &&
            Filters["languages"].length == 0 &&
            Filters["tools"].length == 0
            ? 0
            : 1,
    };
}
function addFiletrCriteria(event) {
    switch (event.target.dataset.filter) {
        case "role":
            console.log("role is exsists", checkFilter(Filters.role, event.target.innerHTML).filterExsists);
            if (checkFilter(Filters.role, event.target.innerHTML).filterExsists) {
                return false;
            }
            else {
                Filters.role.push(event.target.innerHTML);
            }
            break;
        case "level":
            if (checkFilter(Filters.level, event.target.innerHTML).filterExsists) {
                return false;
            }
            else {
                Filters.level.push(event.target.innerHTML);
            }
            break;
        case "languages":
            if (checkFilter(Filters.languages, event.target.innerHTML).filterExsists) {
                return false;
            }
            else {
                Filters.languages.push(event.target.innerHTML);
            }
            break;
        case "tools":
            if (checkFilter(Filters.tools, event.target.innerHTML).filterExsists) {
                return false;
            }
            else {
                Filters.tools.push(event.target.innerHTML);
            }
            break;
    }
    addToLocalStorage("filters", Filters);
    addFiltersToPage();
}
function removeFilter(event) {
    let filterKey = event.target.parentNode.parentNode.dataset.filter;
    let filterValue = event.target.parentNode.parentNode.querySelector("span").innerHTML;
    for (let filter in Filters) {
        if (filterKey == filter) {
            if (Filters[filter].length > 0) {
                Filters[filter] = Filters[filter].filter((item) => item != filterValue);
            }
        }
    }
    addToLocalStorage("filters", Filters);
    addFiltersToPage();
    if (checkFilter().FiltersLength == 0) {
        addToLocalStorage("jobs-list", jobs);
        addJobsToPage();
    }
    else {
        filterJobs();
    }
}
function clearFilters() {
    clearfilters === null || clearfilters === void 0 ? void 0 : clearfilters.addEventListener("click", () => {
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
function addFiltersToPage() {
    if (checkFilter().FiltersLength == 0) {
        filtersDiv.style.display = "none";
    }
    else {
        filtersDiv.style.display = "flex";
        boxesDiv.innerHTML = "";
        for (let filter in Filters) {
            if (Filters[filter].length > 0) {
                Filters[filter].forEach((item) => {
                    boxesDiv === null || boxesDiv === void 0 ? void 0 : boxesDiv.appendChild(createFilterComponent(filter, item));
                });
            }
        }
    }
}
function filterJobs() {
    let _filteredJobs = [];
    console.log("current filters> ", Filters);
    console.log("filters length", checkFilter().FiltersLength);
    _filteredJobs = jobs.filter((job) => Filters["role"].includes(job.role) ||
        Filters["level"].includes(job.level) ||
        job.languages.some((lang) => Filters["languages"].includes(lang)) ||
        job.tools.some((tool) => Filters["tools"].includes(tool)));
    addToLocalStorage("jobs-list", _filteredJobs);
    addJobsToPage();
}
getJobs();
loadFilters();
clearFilters();
export {};
//# sourceMappingURL=main.js.map