import type React from "react"
import { notFound } from "next/navigation"
import { fetchCat } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { HealthTracker } from "@/components/health-tracker"
import { ArrowLeft, Calendar, CatIcon, Edit } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { DeleteCatButton } from "@/components/delete-cat-button"
import { Badge } from "@/components/ui/badge"

export default async function CatDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  const cat = await fetchCat(id)

  if (!cat) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#ffd9ce]">
      <div className="relative h-64 bg-gradient-to-r from-blue-200 to-pink-200">
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/cats/${cat.id}/edit`}>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30"
              >
                <Edit className="h-5 w-5 text-white" />
              </Button>
            </Link>
            <DeleteCatButton catId={cat.id} catName={cat.name} />
          </div>
        </div>

        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <Avatar className="h-32 w-32 border-4 border-white">
            <AvatarImage src={cat.imageUrl || "/placeholder.svg?height=128&width=128"} alt={cat.name} />
            <AvatarFallback className="text-3xl">{cat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="pt-24 pb-10 px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{cat.name}</h1>
          <p className="text-gray-600">
            {cat.breed} • {cat.age} years old
          </p>

          {cat.specialNeeds && (
            <Badge variant="outline" className="mt-2 bg-amber-100 text-amber-800 hover:bg-amber-100 rounded-full px-3">
              Special needs
            </Badge>
          )}
        </div>

        <Card className="rounded-3xl shadow-sm border-0 bg-white mb-6">
          <CardContent className="p-5">
            <div className="grid gap-4">
              {cat.birthDate && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Birth Date</p>
                    <p className="font-medium">{format(new Date(cat.birthDate), "PPP")}</p>
                  </div>
                </div>
              )}

              {cat.feedingSchedule && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <BowlIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Feeding Schedule</p>
                    <p className="font-medium">{cat.feedingSchedule}</p>
                  </div>
                </div>
              )}

              {cat.notes && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <CatIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium">{cat.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="bg-white rounded-3xl shadow-sm p-5 overflow-hidden">
          <HealthTracker cat={cat} />
        </div>
      </div>
    </div>
  )
}

function BowlIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 17h18c.5 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.2 10.7 14 10 12 10s-6.2.7-8.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.5 1 1 1Z" />
      <path d="M3 17v2c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-2" />
      <path d="M12 10V5c0-1.7-1.3-3-3-3H7" />
      <path d="M5 2h2v3" />
    </svg>
  )
}

