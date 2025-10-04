import Link from "next/link"

export default function Page() {
  const links = [
    {
      href: "/mrv",
      title: "MRV Map & Land Measurement",
      desc: "Draw plots, measure area, toggle NDVI/Rain/Soil layers",
    },
    { href: "/fertilizer", title: "Fertilizer Dashboard", desc: "Create and view fertilizer applications" },
    { href: "/livestock", title: "Livestock Manager", desc: "Reference feed/water needs; add custom types" },
    { href: "/admin", title: "Admin / Researcher", desc: "Upload CSV/GeoJSON datasets" },
    { href: "/dashboard/carbon", title: "Carbon Credits", desc: "Estimate and record carbon credit transactions" }, // new link
  ]
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">NASA Farm Navigators</h1>
      <p className="text-muted-foreground mb-6">
        Data-driven tools for farmers: maps, imagery, weather, and farm management.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="border rounded p-4 hover:bg-muted/50">
            <div className="font-medium">{l.title}</div>
            <div className="text-sm text-muted-foreground">{l.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
