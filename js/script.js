function escapeHTML(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}
function sanitizeText(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.textContent;
}

const events = [
  {
    title: "An Evening with Maya Rao",
    author: "Maya Rao",
    date: "October 9, 2026",
    time: "6:30 PM",
    location: "Main Reading Room",
    category: "author-talk",
    description: "A conversation about contemporary fiction, writing habits, and the stories behind Maya Rao's latest novel.",
    isDefault: true
  },
  {
    title: "The Art of Book Signing",
    author: "Daniel Brooks",
    date: "October 16, 2026",
    time: "5:00 PM",
    location: "Community Hall",
    category: "book-signing",
    description: "Meet the author, discover the new collection, and take part in an informal signing session.",
    isDefault: true
  },
  {
    title: "Saturday Reading Circle",
    author: "BookEvent Community",
    date: "October 24, 2026",
    time: "11:00 AM",
    location: "Independent Bookstore",
    category: "reading",
    description: "A relaxed community reading session where readers share their favourite books and recommendations.",
    isDefault: true
  },
  {
    title: "Build Your Reading Habit",
    author: "Nisha Kapoor",
    date: "October 31, 2026",
    time: "3:00 PM",
    location: "Workshop Studio",
    category: "workshop",
    description: "A practical session focused on building a sustainable reading routine and discovering new genres.",
    isDefault: true
  },
  {
    title: "Local Writers Community Meetup",
    author: "BookEvent Community",
    date: "November 7, 2026",
    time: "4:30 PM",
    location: "Community Hall",
    category: "community",
    description: "Connect with local readers and writers, exchange ideas, and build new creative connections.",
    isDefault: true
  }
];
const savedEvents = localStorage.getItem("bookevent-events");

if (savedEvents) {
  const storedEvents = JSON.parse(savedEvents);

  storedEvents.forEach(function (event) {
    if (event.isDefault === false) {
      events.push(event);
    }
  });
}

const eventGrid = document.getElementById("event-grid");

function formatTime(time) {
  const [hours, minutes] = time.split(":");
  const hour = Number(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${period}`;
}

function formatDate(dateValue) {
  const date = new Date(dateValue + "T00:00:00");

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function renderEvents(eventList) {
  eventGrid.innerHTML = "";

  eventList.forEach(function (event) {
    const eventCard = document.createElement("article");
    eventCard.className = "event-card";

    eventCard.innerHTML = `
  <div class="event-card-top">
      <span class="event-category">${escapeHTML(event.category)}</span>
      <span class="event-date">${escapeHTML(event.date)}</span>
  </div>

  <h3>${escapeHTML(event.title)}</h3>

  <p class="event-author">By ${escapeHTML(event.author)}</p>

  <p class="event-description">${escapeHTML(event.description)}</p>

  <div class="event-details">
      <span>${escapeHTML(event.time)}</span>
      <span>${escapeHTML(event.location)}</span>
  </div>
`;

if (event.isDefault === false) {
  const deleteButton = document.createElement("button");

  deleteButton.className = "delete-event-button";
  deleteButton.type = "button";
  deleteButton.setAttribute(
    "aria-label",
    `Delete ${event.title}`
  );
  deleteButton.innerHTML = `
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M3 6h18"></path>
    <path d="M8 6V4h8v2"></path>
    <path d="M19 6l-1 14H6L5 6"></path>
    <path d="M10 11v5"></path>
    <path d="M14 11v5"></path>
  </svg>
`;

  deleteButton.addEventListener("click", function () {
    const eventIndex = events.indexOf(event);

    if (eventIndex !== -1) {
      events.splice(eventIndex, 1);

      localStorage.setItem(
        "bookevent-events",
        JSON.stringify(
          events.filter(function (item) {
            return item.isDefault === false;
          })
        )
      );

      filterEvents();
    }
  });

  eventCard.querySelector(".event-card-top").appendChild(deleteButton);
}

    eventGrid.appendChild(eventCard);
  });
}

const searchInput = document.getElementById("event-search");
const categoryFilter = document.getElementById("event-filter");
const resetFilters = document.getElementById("reset-filters");

function filterEvents() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;

  const filteredEvents = events.filter(function (event) {
    const matchesSearch =
  event.title.toLowerCase().includes(searchText) ||
  event.author.toLowerCase().includes(searchText) ||
  event.description.toLowerCase().includes(searchText) ||
  event.date.toLowerCase().includes(searchText) ||
  event.location.toLowerCase().includes(searchText) ||
  event.category.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  const emptyState = document.getElementById("empty-state");

emptyState.hidden = filteredEvents.length !== 0;

  renderEvents(filteredEvents);
}

searchInput.addEventListener("input", filterEvents);
categoryFilter.addEventListener("change", filterEvents);
resetFilters.addEventListener("click", function () {
  searchInput.value = "";
  categoryFilter.value = "all";
  filterEvents();
});

renderEvents(events);

const eventForm = document.getElementById("event-form");
const formStatus = document.getElementById("form-status");

eventForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const titleInput = document.getElementById("event-title");
  const titleField = titleInput.closest(".form-field");
  const titleError = document.getElementById("title-error");
  const title = titleInput.value.trim();

  if (!/^[A-Za-z0-9][A-Za-z0-9 .,'&:!?()\-]{2,99}$/.test(title)) {
    titleField.classList.add("has-error");
    titleError.hidden = false;
    titleError.textContent = "Enter a valid event title.";
    titleInput.focus();
    return;
  }

  titleField.classList.remove("has-error");
  titleError.hidden = true;
  titleError.textContent = "";

  const authorInput = document.getElementById("event-author");
  const authorField = authorInput.closest(".form-field");
  const authorError = document.getElementById("author-error");
  const author = authorInput.value.trim();

  if (!/^[A-Za-z][A-Za-z .'-]{2,79}$/.test(author)) {
    authorField.classList.add("has-error");
    authorError.hidden = false;
    authorError.textContent = "Enter a valid author or host name.";
    authorInput.focus();
    return;
  }

  authorField.classList.remove("has-error");
  authorError.hidden = true;
  authorError.textContent = "";

  const dateInput = document.getElementById("event-date");
  const dateField = dateInput.closest(".form-field");
  const dateError = document.getElementById("date-error");
  const selectedDate = dateInput.value;

  if (!selectedDate) {
    dateField.classList.add("has-error");
    dateError.hidden = false;
    dateError.textContent = "Please select an event date.";
    dateInput.focus();
    return;
  }

  const today = new Date();
  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const eventDate = new Date(selectedDate + "T00:00:00");

  if (eventDate < currentDate) {
    dateField.classList.add("has-error");
    dateError.hidden = false;
    dateError.textContent = "Event date cannot be in the past.";
    dateInput.focus();
    return;
  }

  dateField.classList.remove("has-error");
  dateError.hidden = true;
  dateError.textContent = "";

  const timeInput = document.getElementById("event-time");
  const timeField = timeInput.closest(".form-field");
  const timeError = document.getElementById("time-error");
  const selectedTime = timeInput.value;

  if (!selectedTime) {
    timeField.classList.add("has-error");
    timeError.hidden = false;
    timeError.textContent = "Please select an event time.";
    timeInput.focus();
    return;
  }

  timeField.classList.remove("has-error");
  timeError.hidden = true;
  timeError.textContent = "";

  const locationInput = document.getElementById("event-location");
  const locationField = locationInput.closest(".form-field");
  const locationError = document.getElementById("location-error");
  const location = locationInput.value.trim();

  if (!location || location.length < 2) {
    locationField.classList.add("has-error");
    locationError.hidden = false;
    locationError.textContent = "Enter a valid event location.";
    locationInput.focus();
    return;
  }

  locationField.classList.remove("has-error");
  locationError.hidden = true;
  locationError.textContent = "";

  const categoryInput = document.getElementById("event-category");
  const categoryField = categoryInput.closest(".form-field");
  const categoryError = document.getElementById("category-error");
  const selectedCategory = categoryInput.value;

  if (!selectedCategory) {
    categoryField.classList.add("has-error");
    categoryError.hidden = false;
    categoryError.textContent = "Please select an event category.";
    categoryInput.focus();
    return;
  }

  categoryField.classList.remove("has-error");
  categoryError.hidden = true;
  categoryError.textContent = "";

  const descriptionInput = document.getElementById("event-description");
  const descriptionField = descriptionInput.closest(".form-field");
  const descriptionError = document.getElementById("description-error");
  const description = descriptionInput.value.trim();

  if (!description || description.length < 10) {
    descriptionField.classList.add("has-error");
    descriptionError.hidden = false;
    descriptionError.textContent = "Description must contain at least 10 characters.";
    descriptionInput.focus();
    return;
  }

  descriptionField.classList.remove("has-error");
  descriptionError.hidden = true;
  descriptionError.textContent = "";

  const newEvent = {
  title: sanitizeText(title),
  author: sanitizeText(author),
  date: sanitizeText(formatDate(selectedDate)),
  time: sanitizeText(formatTime(selectedTime)),
  location: sanitizeText(location),
  category: sanitizeText(selectedCategory),
  description: sanitizeText(description),
  isDefault: false
};

  events.push(newEvent);

localStorage.setItem("bookevent-events", JSON.stringify(
  events.filter(function (event) {
    return event.isDefault === false;
  })
));

renderEvents(events);
revealNewEventCards();

  formStatus.textContent = "Event submitted successfully.";
  formStatus.className = "form-status success";

  eventForm.reset();

  console.log("[Analytics] User interacted with Independent Bookstore Events Page");
});
const validationFields = [
  {
    input: document.getElementById("event-title"),
    field: document.getElementById("event-title").closest(".form-field"),
    error: document.getElementById("title-error")
  },
  {
    input: document.getElementById("event-author"),
    field: document.getElementById("event-author").closest(".form-field"),
    error: document.getElementById("author-error")
  },
  {
    input: document.getElementById("event-date"),
    field: document.getElementById("event-date").closest(".form-field"),
    error: document.getElementById("date-error")
  },
  {
    input: document.getElementById("event-time"),
    field: document.getElementById("event-time").closest(".form-field"),
    error: document.getElementById("time-error")
  },
  {
    input: document.getElementById("event-location"),
    field: document.getElementById("event-location").closest(".form-field"),
    error: document.getElementById("location-error")
  },
  {
    input: document.getElementById("event-category"),
    field: document.getElementById("event-category").closest(".form-field"),
    error: document.getElementById("category-error")
  },
  {
    input: document.getElementById("event-description"),
    field: document.getElementById("event-description").closest(".form-field"),
    error: document.getElementById("description-error")
  }
];

validationFields.forEach(function (item) {
  const eventName = item.input.tagName === "SELECT" ? "change" : "input";

  item.input.addEventListener(eventName, function () {
    item.field.classList.remove("has-error");
    item.error.hidden = true;
    item.error.textContent = "";
  });
});
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
    const themeThumb = document.querySelector(".theme-toggle-thumb");

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.setAttribute("aria-pressed", "true");
        themeToggle.setAttribute("aria-label", "Switch to light mode");
        themeThumb.textContent = "☾";
    } else {
        document.body.classList.remove("dark-mode");
        themeToggle.setAttribute("aria-pressed", "false");
        themeToggle.setAttribute("aria-label", "Switch to dark mode");
        themeThumb.textContent = "☀";
    }
}

const savedTheme = localStorage.getItem("bookevent-theme");

if (savedTheme) {
  applyTheme(savedTheme);
}

themeToggle.addEventListener("click", function () {
  const isDarkMode = document.body.classList.contains("dark-mode");

  if (isDarkMode) {
    applyTheme("light");
    localStorage.setItem("bookevent-theme", "light");
  } else {
    applyTheme("dark");
    localStorage.setItem("bookevent-theme", "dark");
  }
});

const navigationLinks = document.querySelectorAll(".nav-link");

function updateActiveNavigation() {
    const sections = [
        document.querySelector("#events"),
        document.querySelector("#add-event")
    ];

    let activeSection = sections[0];

    sections.forEach((section) => {
        if (section && window.scrollY >= section.offsetTop - 160) {
            activeSection = section;
        }
    });

    navigationLinks.forEach((link) => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${activeSection.id}`
        );
    });
}

navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navigationLinks.forEach((item) => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

window.addEventListener("scroll", updateActiveNavigation);

updateActiveNavigation();

const revealElements = document.querySelectorAll(
  ".events-section, .event-card, .add-event-section, .footer-container"
);

const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

revealElements.forEach(function (element) {
  element.classList.add("reveal-element");
  revealObserver.observe(element);
});
function revealNewEventCards() {
  const newCards = document.querySelectorAll(
    ".event-card:not(.reveal-visible)"
  );

  newCards.forEach(function (card) {
    card.classList.add("reveal-element");

    requestAnimationFrame(function () {
      card.classList.add("reveal-visible");
    });
  });
}

const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mainNavigation = document.getElementById("main-navigation");

mobileMenuToggle.addEventListener("click", function () {
    const isOpen = mainNavigation.classList.toggle("menu-open");

    mobileMenuToggle.classList.toggle("active", isOpen);
    mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
    );
});

navigationLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        if (window.innerWidth <= 480) {
            mainNavigation.classList.remove("menu-open");
            mobileMenuToggle.classList.remove("active");
            mobileMenuToggle.setAttribute("aria-expanded", "false");
            mobileMenuToggle.setAttribute("aria-label", "Open menu");
        }
    });
});
document.addEventListener("click", function (event) {
    const clickedInsideMenu =
        mainNavigation.contains(event.target) ||
        mobileMenuToggle.contains(event.target);

    if (!clickedInsideMenu && mainNavigation.classList.contains("menu-open")) {
        mainNavigation.classList.remove("menu-open");
        mobileMenuToggle.classList.remove("active");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        mobileMenuToggle.setAttribute("aria-label", "Open menu");
    }
});

themeToggle.addEventListener("click", function () {
    if (window.innerWidth <= 480) {
        mainNavigation.classList.remove("menu-open");
        mobileMenuToggle.classList.remove("active");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        mobileMenuToggle.setAttribute("aria-label", "Open menu");
    }
});