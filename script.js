/*
 * script.js
 *
 * This file contains the core logic for the demo location‑services website. A
 * small dataset defines a handful of locations including their name,
 * category, address, description and a list of notable features. The
 * functions exposed here will render the location cards on the library page,
 * filter them based on the user’s search input, and populate the
 * details page with the appropriate record when navigated to with an id
 * query parameter.
 */

// Data model: list of available locations. In a real application this data
// would likely come from a database or API. For the purposes of this
// assignment we define it statically.
const locations = [
  {
    id: 1,
    name: "Modern Luxury Home",
    image: "assets/images/property1.jpg",
    category: "Residential",
    address: "Los Angeles, CA",
    description:
      "A stunning modern home with clean lines, open spaces, and high ceilings. Perfect for contemporary shoots and upscale productions.",
    features: ["3 Bedrooms", "Pool", "Open Floor Plan", "Large Driveway"]
  },
  {
    id: 2,
    name: "Ocean View Living Room",
    image: "assets/images/property2.jpg",
    category: "Interior",
    address: "Santa Monica, CA",
    description:
      "Bright and airy living room overlooking the ocean, featuring modern furnishings and plenty of natural light.",
    features: ["Ocean View", "Modern Furniture", "Open Concept", "Natural Light"]
  },
  {
    id: 3,
    name: "Historic Corridor",
    image: "assets/images/property3.jpg",
    category: "Historic",
    address: "San Francisco, CA",
    description:
      "A grand historic corridor with stone columns, arches, and a red carpet. Ideal for period pieces and elegant sequences.",
    features: ["Stone Columns", "Arched Windows", "Red Carpet", "Historic Charm"]
  },
  {
    id: 4,
    name: "Rustic Barn & Farm",
    image: "assets/images/property4.jpg",
    category: "Rural",
    address: "North Freedom, WI",
    description:
      "Classic red barn surrounded by lush fields and trees. Perfect for rural settings, commercials, or period dramas.",
    features: ["Barn", "Open Fields", "Rustic Setting", "Versatile Exterior"]
  },
  {
    id: 5,
    name: "Rooftop Pool & Cityscape",
    image: "assets/images/property5.jpg",
    category: "Urban",
    address: "Dallas, TX",
    description:
      "Rooftop terrace with pool and panoramic city views. Ideal for nightlife scenes, product shoots, and upscale events.",
    features: ["Pool", "City Skyline", "Lounge Chairs", "Outdoor Terrace"]
  },
  {
    id: 6,
    name: "Elegant Dining Space",
    image: "assets/images/property6.jpg",
    category: "Interior",
    address: "New York, NY",
    description:
      "A sophisticated dining space with designer lighting and refined decor. Suitable for dinner scenes, commercials, and social gatherings.",
    features: ["Modern Lighting", "Round Dining Table", "Elegant Chairs", "Warm Ambiance"]
  }
];

/**
 * Render the list of locations into the supplied container. Creates a
 * Bootstrap card for each entry in the data model. This function is used
 * exclusively on library.html.
 *
 * @param {HTMLElement} container The element that will receive card markup
 * @param {Array} data Array of location objects to render
 */
function renderLocations(container, data = locations) {
  container.innerHTML = "";
  data.forEach((loc) => {
    // Build card markup using template literals. Each card has an image,
    // title, short address, category badge and a call‑to‑action button.
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${loc.image}" class="card-img-top" alt="${loc.name}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${loc.name}</h5>
          <p class="card-text mb-1">${loc.address}</p>
          <span class="badge bg-primary align-self-start mb-3">${loc.category}</span>
          <a href="location-detail.html?id=${loc.id}" class="btn btn-outline-primary mt-auto">View Details</a>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

/**
 * Filter the list of locations by a search term. Matches against the name,
 * category and address fields in a case‑insensitive manner. Returns a new
 * array containing only matching items.
 *
 * @param {string} term Search string entered by the user
 * @returns {Array} Filtered array of location objects
 */
function filterLocations(term) {
  const query = term.trim().toLowerCase();
  if (!query) return locations;
  return locations.filter((loc) => {
    return (
      loc.name.toLowerCase().includes(query) ||
      loc.category.toLowerCase().includes(query) ||
      loc.address.toLowerCase().includes(query)
    );
  });
}

/**
 * Retrieve the value of a query parameter from the current URL. Used on
 * location‑detail.html to identify which record to display. If the parameter
 * is absent or cannot be parsed as a number then NaN is returned.
 *
 * @param {string} key Parameter name
 * @returns {number} Parameter value as integer
 */
function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key);
  return value ? parseInt(value, 10) : NaN;
}

/**
 * Populate the location detail page based on the id present in the URL. If
 * the id is invalid or out of range the user is redirected back to the
 * library page. Otherwise the various content placeholders are filled out
 * with the selected record’s data.
 */
function renderLocationDetail() {
  const id = getQueryParam("id");
  const record = locations.find((loc) => loc.id === id);
  if (!record) {
    // fall back to library if an unknown id was provided
    window.location.href = "library.html";
    return;
  }
  // Update the title and image
  document.getElementById("detailName").textContent = record.name;
  // Update breadcrumb if present
  const breadcrumb = document.getElementById("breadcrumbName");
  if (breadcrumb) breadcrumb.textContent = record.name;
  document.getElementById("detailImage").src = record.image;
  document.getElementById("detailImage").alt = record.name;
  document.getElementById("detailCategory").textContent = record.category;
  document.getElementById("detailAddress").textContent = record.address;
  document.getElementById("detailDescription").textContent = record.description;

  // Build features list
  const list = document.getElementById("detailFeatures");
  list.innerHTML = "";
  record.features.forEach((feat) => {
    const li = document.createElement("li");
    li.textContent = feat;
    list.appendChild(li);
  });
}

/**
 * Attach event listeners when the DOM is ready. This helper is used on
 * multiple pages to avoid global variables and inline handlers.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Library page: handle rendering and searching
  const libraryContainer = document.getElementById("locationsContainer");
  const searchInput = document.getElementById("searchInput");
  if (libraryContainer) {
    renderLocations(libraryContainer);
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const results = filterLocations(e.target.value);
        renderLocations(libraryContainer, results);
      });
    }
  }

  // Detail page: populate content based on id
  if (document.getElementById("detailPage")) {
    renderLocationDetail();
    // attach listener to booking form submit
    const bookingForm = document.getElementById("bookingForm");
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // In a real site this would be sent to a backend; here we just show a message
      alert(
        "Thank you for your booking request! Our team will contact you shortly."
      );
      bookingForm.reset();
    });
  }

  // Contact form: simple submission alert
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert(
        "Thank you for reaching out! We will respond to your message as soon as possible."
      );
      contactForm.reset();
    });
  }

  // List property form: simple submission alert
  const listForm = document.getElementById("listForm");
  if (listForm) {
    listForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert(
        "Thank you for submitting your property! Our team will review your application and be in touch."
      );
      listForm.reset();
    });
  }
});