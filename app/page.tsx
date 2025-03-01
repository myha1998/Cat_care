import { Button } from "@/components/ui/button"
import { CatList } from "@/components/cat-list"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#ffd9ce]">
      <div className="py-10 px-10 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Discover</h1>
            <p className="text-gray-700 mt-1 text-lg">Manage your cats&apos; health and wellbeing</p>
          </div>
          <Link href="/cats/new">
            <Button className="flex items-center gap-2 rounded-full bg-gray-900 hover:bg-gray-800">
              <PlusCircle className="h-4 w-4" />
              Add Cat
            </Button>
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-4 gap-2 mb-6 no-scrollbar">
          <Button
            variant="outline"
            className="rounded-full bg-gray-900 text-white hover:bg-gray-800 px-6 py-2 whitespace-nowrap"
          >
            All Cats
          </Button>
          <Button variant="outline" className="rounded-full bg-white hover:bg-gray-100 px-6 py-2 whitespace-nowrap">
            Needs Checkup
          </Button>
          <Button variant="outline" className="rounded-full bg-white hover:bg-gray-100 px-6 py-2 whitespace-nowrap">
            Recent Updates
          </Button>
          <Button variant="outline" className="rounded-full bg-white hover:bg-gray-100 px-6 py-2 whitespace-nowrap">
            Special Needs
          </Button>
        </div>

        <CatList />

        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="rounded-full bg-white hover:bg-gray-100 px-8 py-2 flex items-center gap-2  mb-10"
          >
            <span className="text-gray-900">See more</span>
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg">
        <div className="flex justify-around items-center h-16 px-6">
          <Link href="/" className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
          </Link>
          <Link href="/search" className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
          </Link>
          <Link href="/profile" className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21a8 8 0 1 0-16 0"></path>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

