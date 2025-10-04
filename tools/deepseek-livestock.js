// Example: Loading and using livestock requirements
class LivestockManager {
  constructor() {
    this.requirements = null
    this.loadRequirements()
  }

  async loadRequirements() {
    try {
      const response = await fetch("livestock_requirements.json")
      this.requirements = await response.json()
      this.initializeApp()
    } catch (error) {
      console.error("Error loading requirements:", error)
    }
  }

  initializeApp() {
    // Populate livestock categories
    const categories = this.requirements.livestock_categories
    this.populateCategorySelector(categories)
  }

  populateCategorySelector(categories) {
    const selector = document.getElementById("livestock-category")
    categories.forEach((category) => {
      const option = document.createElement("option")
      option.value = category.category_id
      option.textContent = category.category_name
      selector.appendChild(option)
    })
  }

  getRequirements(categoryId) {
    return this.requirements.livestock_categories.find((category) => category.category_id === categoryId)
  }

  getSeasonalTips(season) {
    return this.requirements.seasonal_considerations[season] || []
  }
}

// Usage example
const manager = new LivestockManager()

// Get requirements for dairy cattle
const dairyRequirements = manager.getRequirements("dairy_cattle")
console.log("Dairy cattle space requirement:", dairyRequirements.requirements.housing.space_per_animal)

// Get summer tips
const summerTips = manager.getSeasonalTips("summer")
console.log("Summer considerations:", summerTips)
