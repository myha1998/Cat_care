import { notFound } from "next/navigation"
import { fetchCat } from "@/lib/api"
import { CatForm } from "@/components/cat-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditCatPage({ params }: PageProps) {
  try {
    const cat = await fetchCat(params.id)

    if (!cat) {
      notFound()
    }

    return (
      <div className="container py-10">
        <div className="flex items-center gap-2 mb-8">
          <Link href={`/cats/${cat.id}`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Edit {cat.name}</h1>
        </div>

        <CatForm cat={cat} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching cat:', error)
    notFound()
  }
}

