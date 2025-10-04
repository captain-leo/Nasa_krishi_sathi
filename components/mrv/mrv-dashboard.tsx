"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Leaf, Droplets, Sprout, TrendingUp, Award, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MRVDashboardProps {
  farmId: string
}

export function MRVDashboard({ farmId }: MRVDashboardProps) {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reportPeriod, setReportPeriod] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadMRVReport()
  }, [farmId, reportPeriod])

  const loadMRVReport = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/mrv/report?farmId=${farmId}&startDate=${reportPeriod.startDate}&endDate=${reportPeriod.endDate}`,
      )
      const data = await response.json()
      setMetrics(data.metrics)
    } catch (error) {
      console.error("[v0] Error loading MRV report:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">No MRV data available</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sustainability Score */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Award className="h-6 w-6 text-green-600" />
            Sustainability Score
          </CardTitle>
          <CardDescription>Overall environmental performance rating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#16a34a"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(metrics.sustainability.overallScore / 100) * 351.86} 351.86`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-700">{metrics.sustainability.overallScore}</p>
                    <p className="text-sm text-muted-foreground">/ 100</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                {metrics.sustainability.certificationEligible ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Certification Eligible</p>
                      <p className="text-sm text-muted-foreground">
                        Your farm meets sustainability certification criteria
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-900">Approaching Certification</p>
                      <p className="text-sm text-muted-foreground">
                        Score 70+ to become eligible for sustainability certification
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Reporting Period</p>
                <Badge variant="outline">
                  {new Date(metrics.reportingPeriod.startDate).toLocaleDateString()} -{" "}
                  {new Date(metrics.reportingPeriod.endDate).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carbon Sequestration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              Carbon Sequestration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-700">
                {metrics.carbonSequestration.totalCO2Sequestered.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">kg CO₂ captured</p>
              <div className="pt-2 border-t">
                <p className="text-sm">
                  <span className="font-medium">{metrics.carbonSequestration.perHectare.toFixed(0)}</span>
                  <span className="text-muted-foreground"> kg/hectare</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Water Efficiency */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-600" />
              Water Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-700">{metrics.waterUsage.savedVsTraditional.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">saved vs traditional</p>
              <div className="pt-2 border-t">
                <p className="text-sm">
                  <span className="font-medium">{metrics.waterUsage.totalWaterUsed.toLocaleString()}</span>
                  <span className="text-muted-foreground"> liters used</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organic Inputs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sprout className="h-4 w-4 text-amber-600" />
              Organic Fertilizer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-amber-700">{metrics.fertilizer.organicPercentage.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">organic usage</p>
              <div className="pt-2 border-t">
                <p className="text-sm">
                  <span className="font-medium">{metrics.fertilizer.totalUsed.toFixed(1)}</span>
                  <span className="text-muted-foreground"> kg total</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biodiversity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Biodiversity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-purple-700">{metrics.biodiversity.cropDiversity}</p>
              <p className="text-xs text-muted-foreground">crop varieties</p>
              <div className="pt-2 border-t">
                <p className="text-sm">
                  <span className="font-medium">Soil Health: {metrics.biodiversity.soilHealthScore}</span>
                  <span className="text-muted-foreground">/100</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Carbon Details */}
        <Card>
          <CardHeader>
            <CardTitle>Carbon Sequestration Details</CardTitle>
            <CardDescription>CO₂ capture and climate impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total CO₂ Captured:</span>
                <span className="font-medium">
                  {metrics.carbonSequestration.totalCO2Sequestered.toLocaleString()} kg
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Per Hectare:</span>
                <span className="font-medium">{metrics.carbonSequestration.perHectare.toFixed(2)} kg/ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Methodology:</span>
                <span className="font-medium">{metrics.carbonSequestration.methodology}</span>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                <span className="font-semibold">Climate Impact:</span> Your farm has sequestered the equivalent of{" "}
                {(metrics.carbonSequestration.totalCO2Sequestered / 411).toFixed(1)} trees planted for one year.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Water Details */}
        <Card>
          <CardHeader>
            <CardTitle>Water Management</CardTitle>
            <CardDescription>Water usage and efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Water Used:</span>
                <span className="font-medium">{metrics.waterUsage.totalWaterUsed.toLocaleString()} L</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Per Hectare:</span>
                <span className="font-medium">{metrics.waterUsage.perHectare.toLocaleString()} L/ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Efficiency:</span>
                <span className="font-medium">{metrics.waterUsage.efficiency.toFixed(2)} kg/m³</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Water Savings:</span> You've saved{" "}
                {metrics.waterUsage.savedVsTraditional.toFixed(1)}% water compared to traditional irrigation methods.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {metrics.sustainability.improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Improvement Recommendations</CardTitle>
            <CardDescription>Actions to enhance your sustainability score</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {metrics.sustainability.improvements.map((improvement: string, index: number) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{improvement}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Certification Status */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Certification Readiness
          </CardTitle>
          <CardDescription>Progress towards sustainability certification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Score</span>
              <span className="font-medium">{metrics.sustainability.overallScore}/100</span>
            </div>
            <Progress value={metrics.sustainability.overallScore} className="h-3" />
          </div>

          {metrics.sustainability.certificationEligible ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900 mb-3">
                <span className="font-semibold">Congratulations!</span> Your farm meets the criteria for sustainability
                certification.
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">Apply for Certification</Button>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                You need {70 - metrics.sustainability.overallScore} more points to become eligible for certification.
                Follow the recommendations above to improve your score.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
