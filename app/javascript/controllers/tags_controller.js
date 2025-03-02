// app/javascript/controllers/tags_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dropdownMenu", "search", "options", "selectedContainer", "hiddenField"]

  connect() {
    this.selectedTags = []; // Array to hold selected tag names

    // If hidden field has an initial value (e.g. in an edit form), initialize selectedTags and display badges.
    if (this.hasHiddenFieldTarget && this.hiddenFieldTarget.value) {
      this.selectedTags = this.hiddenFieldTarget.value.split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);
      this.selectedTags.forEach(name => this._addBadge(name));
    }

    // Fetch all available tags from the API once.
    fetch("/api/tags")
      .then(response => response.json())
      .then(tags => {
        // Normalize tags to objects with a 'name' property.
        this.allTags = tags.map(tag => typeof tag === "string" ? { name: tag } : tag);
        // Sort tags alphabetically.
        this.allTags.sort((a, b) => a.name.localeCompare(b.name));
        this._renderTagOptions();
      })
      .catch(error => {
        console.error("Error loading tags:", error);
      });
  }

  // Toggle the visibility of the dropdown menu.
  toggleDropdown(event) {
    event.preventDefault();
    this.dropdownMenuTarget.classList.toggle("show");
    if (this.dropdownMenuTarget.classList.contains("show")) {
      this.searchTarget.focus();
    }
  }

  // Filter tag options based on search input.
  filter() {
    const query = this.searchTarget.value.trim().toLowerCase();
    this.optionsTarget.querySelectorAll(".dropdown-item").forEach(item => {
      const tagName = item.dataset.value.toLowerCase();
      if (query === "" || tagName.includes(query)) {
        item.classList.remove("d-none");
      } else {
        item.classList.add("d-none");
      }
    });
  }

  // Handle click on a tag option.
  selectTag(event) {
    event.preventDefault();
    event.stopPropagation();
    const itemEl = event.currentTarget;
    const tagName = itemEl.dataset.value;
    if (this.selectedTags.includes(tagName)) {
      // If already selected, remove it.
      this._removeTag(tagName);
    } else {
      // Add tag to the selection.
      this.selectedTags.push(tagName);
      this.hiddenFieldTarget.value = this.selectedTags.join(",");
      itemEl.classList.add("active");
      // Move the selected item to the top.
      this.optionsTarget.prepend(itemEl);
      this._addBadge(tagName);
    }
  }

  // Render all tag options in the dropdown.
  _renderTagOptions() {
    this.optionsTarget.innerHTML = ""; // Clear previous options.
    this.allTags.forEach(tag => {
      const name = tag.name || tag.text || tag.value || tag;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dropdown-item";
      btn.textContent = name;
      btn.dataset.value = name;
      if (this.selectedTags.includes(name)) {
        btn.classList.add("active");
      }
      // Attach click handler.
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.selectTag(event);
      });
      this.optionsTarget.appendChild(btn);
    });
    // Move already selected tags to the top.
    this.selectedTags.forEach(name => {
      const el = this.optionsTarget.querySelector(`[data-value="${CSS.escape(name)}"]`);
      if (el) this.optionsTarget.prepend(el);
    });
  }

  // Create and add a badge for a selected tag.
  _addBadge(name) {
    const badge = document.createElement("span");
    badge.className = "badge bg-primary me-1 mb-1";
    badge.dataset.tagName = name; // Store tag name for removal.
    badge.textContent = name + " ";
    // Create a clickable "×" for removal.
    const removeBtn = document.createElement("span");
    removeBtn.setAttribute("role", "button");
    removeBtn.setAttribute("aria-label", `Remove ${name}`);
    removeBtn.innerHTML = "&times;";
    removeBtn.style.cursor = "pointer";
    removeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._removeTag(name);
    });
    badge.appendChild(removeBtn);
    this.selectedContainerTarget.appendChild(badge);
  }

  // Remove a tag from the selection and update the UI and hidden field.
  _removeTag(name) {
    this.selectedTags = this.selectedTags.filter(tag => tag !== name);
    this.hiddenFieldTarget.value = this.selectedTags.join(",");
    // Remove the badge.
    const badge = this.selectedContainerTarget.querySelector(`span.badge[data-tag-name="${name}"]`);
    if (badge) badge.remove();
    // Find the corresponding dropdown item and mark it as unselected.
    const itemEl = this.optionsTarget.querySelector(`[data-value="${CSS.escape(name)}"]`);
    if (itemEl) {
      itemEl.classList.remove("active");
      // Reinsert the item into the options list in sorted order.
      const siblings = Array.from(this.optionsTarget.children).filter(el => !el.classList.contains("active"));
      let insertBeforeEl = null;
      for (let el of siblings) {
        if (el.dataset.value.localeCompare(name) > 0) {
          insertBeforeEl = el;
          break;
        }
      }
      if (insertBeforeEl) {
        this.optionsTarget.insertBefore(itemEl, insertBeforeEl);
      } else {
        this.optionsTarget.appendChild(itemEl);
      }
    }
  }
}
