import { CatForm } from "@/components/cat-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewCatPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add New Cat</h1>
      </div>
      <CatForm />
    </div>
  )
}

