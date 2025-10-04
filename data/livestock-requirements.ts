export type LivestockCategory = {
  category_id: string
  category_name: string
  requirements: {
    housing: { space_per_animal: string; flooring: string }
    feeding: { diet: string; daily_intake_kg?: string }
    healthcare: { vaccinations: string[]; notes?: string }
  }
}

export type SeasonalConsiderations = Record<string, string[]>

export type LivestockRequirements = {
  livestock_categories: LivestockCategory[]
  seasonal_considerations: SeasonalConsiderations
}

export const LIVESTOCK_DATA: LivestockRequirements = {
  livestock_categories: [
    {
      category_id: "dairy_cattle",
      category_name: "Dairy Cattle",
      requirements: {
        housing: { space_per_animal: "10–12 m²", flooring: "Non-slip, dry bedding" },
        feeding: { diet: "Green fodder + concentrates + minerals", daily_intake_kg: "3–4% body weight" },
        healthcare: { vaccinations: ["FMD", "HS", "BQ"], notes: "Regular deworming and mastitis checks" },
      },
    },
    {
      category_id: "goat",
      category_name: "Goat",
      requirements: {
        housing: { space_per_animal: "1–1.5 m²", flooring: "Dry, raised platform preferred" },
        feeding: { diet: "Browse + crop residues + legumes", daily_intake_kg: "3% body weight" },
        healthcare: { vaccinations: ["PPR", "ET"], notes: "Control internal parasites; hoof trimming" },
      },
    },
    {
      category_id: "poultry",
      category_name: "Poultry",
      requirements: {
        housing: { space_per_animal: "0.06–0.09 m² per bird", flooring: "Deep litter system" },
        feeding: { diet: "Starter/Grower/Layer feed with grit", daily_intake_kg: "Varies by stage" },
        healthcare: { vaccinations: ["ND", "IBD"], notes: "Maintain biosecurity; clean water always" },
      },
    },
  ],
  seasonal_considerations: {
    summer: ["Provide shade and cool water", "Avoid heat stress with proper ventilation"],
    monsoon: ["Keep housing dry", "Vaccinate as per schedule", "Manage parasites"],
    winter: ["Provide windbreaks and dry bedding", "Monitor for respiratory issues"],
  },
}
