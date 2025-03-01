"use client"
import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Cat } from "@/lib/types"
import { fetchCats } from "@/lib/api"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { MoreVertical, ArrowRight } from "lucide-react"

export function CatList() {
  const {
    data: cats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cats"],
    queryFn: fetchCats,
  })

  if (isLoading) {
    return <CatListSkeleton />
  }

  if (error) {
    return <div className="text-red-500">Error loading cats: {error.message}</div>
  }

  if (!cats?.length) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No cats added yet</h3>
        <p className="text-muted-foreground mt-1">Add your first cat to start tracking their health</p>
        <Link href="/cats/new">
          <Button className="mt-4 rounded-full">Add Cat</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {cats.map((cat) => (
        <CatCard key={cat.id} cat={cat} />
      ))}
    </div>
  )
}

function CatCard({ cat }: { cat: Cat }) {
  const lastWeight = cat.weights[cat.weights.length - 1]
  const previousWeight = cat.weights.length > 1 ? cat.weights[cat.weights.length - 2] : null
  const weightChange = previousWeight ? lastWeight.value - previousWeight.value : 0

  return (
    <Card className="overflow-hidden rounded-3xl shadow-md bg-white border-0">
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/10 backdrop-blur-sm hover:bg-black/20">
            <MoreVertical className="h-5 w-5 text-white" />
          </Button>
        </div>
        <div className="h-48 bg-gradient-to-r from-blue-200 to-pink-200 flex items-center justify-center">
          <Avatar className="h-32 w-32 border-4 border-white">
            <AvatarImage src={cat.imageUrl || "/placeholder.svg?height=128&width=128"} alt={cat.name} />
            <AvatarFallback className="text-3xl">{cat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold">{cat.name}</h3>
            <p className="text-gray-500 text-sm">{cat.breed}</p>
          </div>
          {cat.specialNeeds && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 rounded-full px-3">
              Special needs
            </Badge>
          )}
        </div>

        <div className="grid gap-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Age</span>
            <span className="font-medium">{cat.age} years</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Weight</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{lastWeight?.value || "N/A"} kg</span>
              {weightChange !== 0 && (
                <Badge variant={weightChange > 0 ? "default" : "destructive"} className="text-xs rounded-full">
                  {weightChange > 0 ? "+" : ""}
                  {weightChange.toFixed(1)}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Last checkup</span>
            <span className="font-medium">
              {cat.vetVisits.length > 0
                ? formatDistanceToNow(new Date(cat.vetVisits[cat.vetVisits.length - 1].date), { addSuffix: true })
                : "Never"}
            </span>
          </div>
        </div>

        <Link href={`/cats/${cat.id}`} className="mt-5 flex w-full">
          <Button
            variant="outline"
            className="w-full rounded-full border-gray-200 hover:bg-gray-50 mt-2 flex justify-between"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}

function CatListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {[1, 2].map((i) => (
        <Card key={i} className="overflow-hidden rounded-3xl shadow-md bg-white border-0">
          <div className="h-48 bg-gradient-to-r from-blue-200 to-pink-200 flex items-center justify-center">
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>
          <div className="p-5">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-10 w-full mt-4 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  )
}

