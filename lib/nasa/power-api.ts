// NASA POWER API Integration
// https://power.larc.nasa.gov/docs/services/api/

export async function fetchNASAPowerData(lat: number, lon: number, startDate: string, endDate: string) {
  const parameters = ["T2M", "PRECTOTCORR", "RH2M", "WS2M", "ALLSKY_SFC_SW_DWN"]

  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${parameters.join(",")}&community=AG&longitude=${lon}&latitude=${lat}&start=${startDate}&end=${endDate}&format=JSON`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`NASA POWER API error: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("[v0] NASA POWER API fetch error:", error)
    throw error
  }
}

export function processNASAPowerData(data: any) {
  const parameters = data.properties.parameter
  const dates = Object.keys(parameters.T2M || {})

  return dates.map((date) => ({
    date,
    temperature: parameters.T2M?.[date] || null,
    precipitation: parameters.PRECTOTCORR?.[date] || null,
    humidity: parameters.RH2M?.[date] || null,
    windSpeed: parameters.WS2M?.[date] || null,
    solarRadiation: parameters.ALLSKY_SFC_SW_DWN?.[date] || null,
  }))
}
