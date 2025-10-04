import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sprout, Satellite, Droplets, TrendingUp, Shield, BarChart3 } from "lucide-react"
import Link from "next/link"
import MainDashboard from "@/components/dashboard/main-dashboard"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Sprout className="h-16 w-16 text-green-600" />
            <h1 className="text-5xl font-bold text-green-900">Krishi-Sathi</h1>
          </div>

          <h2 className="text-3xl font-semibold text-green-800 text-balance">
            NASA-Powered Agricultural Intelligence for Indian Farmers
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            Transform your farming with real-time satellite data, AI-driven insights, and precision agriculture. Monitor
            multiple crops, optimize resources, and increase yields sustainably.
          </p>

          <div className="flex gap-4">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/farm-navigators">Open Farm Navigators</Link>
            </Button>
          </div>
        </div>

        {/* Live Location Insights */}
        <div className="mt-10">
          <div className="mt-12">
            <MainDashboard />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Satellite className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">NASA Satellite Data</h3>
                <p className="text-sm text-muted-foreground">
                  Access real-time NDVI, soil moisture, and climate data from NASA&apos;s Earth observation satellites
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Droplets className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Smart Irrigation</h3>
                <p className="text-sm text-muted-foreground">
                  Reduce water usage by 20-30% with AI-powered irrigation recommendations based on soil moisture
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold">Yield Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Increase crop yields by 10-15% with precision fertilizer management and growth stage tracking
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">Crop Health Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Early detection of crop stress, pests, and diseases using multispectral satellite imagery
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-teal-100 rounded-full">
                  <BarChart3 className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold">MRV Reporting</h3>
                <p className="text-sm text-muted-foreground">
                  Track sustainability metrics, carbon footprint, and generate compliance reports automatically
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Sprout className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold">Multi-Crop Support</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor wheat, rice, cotton, sugarcane, and 10+ other crops with tailored growth stage insights
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Farm?</h3>
              <p className="text-green-50 mb-6 max-w-2xl mx-auto">
                Join thousands of Indian farmers using NASA data to make smarter decisions, save resources, and increase
                profitability.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link href="/auth/signup">Start Your Free Trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
