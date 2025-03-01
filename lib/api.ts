import { v4 as uuidv4 } from "uuid"
import type { Cat, Weight, VetVisit, Vaccination } from "./types"

// Mock data for demo purposes
let cats: Cat[] = [
  {
    id: "1",
    name: "Whiskers",
    breed: "Maine Coon",
    age: 3,
    birthDate: "2020-05-15",
    imageUrl: "/placeholder.svg?height=200&width=200",
    specialNeeds: false,
    notes: "Loves to play with string toys",
    feedingSchedule: "Morning: 1/4 cup dry food, Evening: 1/2 can wet food",
    weights: [
      { id: "w1", value: 4.2, date: "2023-01-15", notes: "Healthy weight" },
      { id: "w2", value: 4.5, date: "2023-03-20", notes: "Slight increase" },
      { id: "w3", value: 4.8, date: "2023-06-10", notes: "Continued growth" },
      { id: "w4", value: 5.0, date: "2023-09-05", notes: "Target weight reached" },
      { id: "w5", value: 5.1, date: "2023-12-20", notes: "Maintaining well" },
    ],
    vetVisits: [
      {
        id: "v1",
        date: "2023-02-10",
        reason: "Annual checkup",
        notes: "All tests normal",
        vetName: "Dr. Smith",
      },
      {
        id: "v2",
        date: "2023-08-15",
        reason: "Dental cleaning",
        notes: "Minor tartar buildup removed",
        vetName: "Dr. Johnson",
      },
    ],
    vaccinations: [
      {
        id: "vac1",
        name: "Rabies",
        date: "2023-02-10",
        dueDate: "2024-02-10",
        notes: "3-year vaccine",
      },
      {
        id: "vac2",
        name: "FVRCP",
        date: "2023-02-10",
        dueDate: "2024-02-10",
        notes: "Annual booster",
      },
    ],
  },
  {
    id: "2",
    name: "Shadow",
    breed: "Siamese",
    age: 5,
    birthDate: "2018-09-22",
    imageUrl: "/placeholder.svg?height=200&width=200",
    specialNeeds: true,
    notes: "Requires special diet for urinary health",
    feedingSchedule: "Three small meals daily of prescription urinary food",
    weights: [
      { id: "w6", value: 3.8, date: "2023-01-10", notes: "Slightly underweight" },
      { id: "w7", value: 4.0, date: "2023-04-15", notes: "Improving" },
      { id: "w8", value: 4.2, date: "2023-07-20", notes: "Healthy weight" },
      { id: "w9", value: 4.1, date: "2023-10-25", notes: "Slight decrease" },
      { id: "w10", value: 4.3, date: "2024-01-05", notes: "Back to healthy range" },
    ],
    vetVisits: [
      {
        id: "v3",
        date: "2023-03-05",
        reason: "Urinary issue checkup",
        notes: "Prescribed special diet",
        vetName: "Dr. Wilson",
      },
      {
        id: "v4",
        date: "2023-09-12",
        reason: "Follow-up",
        notes: "Condition improved with diet",
        vetName: "Dr. Wilson",
      },
    ],
    vaccinations: [
      {
        id: "vac3",
        name: "Rabies",
        date: "2023-03-05",
        dueDate: "2026-03-05",
        notes: "3-year vaccine",
      },
      {
        id: "vac4",
        name: "FVRCP",
        date: "2023-03-05",
        dueDate: "2024-03-05",
        notes: "Annual booster",
      },
    ],
  },
]

// API functions
export async function fetchCats(): Promise<Cat[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return cats
}

export async function fetchCat(id: string): Promise<Cat | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return cats.find((cat) => cat.id === id)
}

export async function createCat(catData: any): Promise<Cat> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newCat: Cat = {
    id: uuidv4(),
    name: catData.name,
    breed: catData.breed,
    age: catData.age,
    birthDate: catData.birthDate ? catData.birthDate.toISOString().split("T")[0] : undefined,
    imageUrl: catData.imageUrl,
    specialNeeds: catData.specialNeeds || false,
    notes: catData.notes,
    feedingSchedule: catData.feedingSchedule,
    weights: [],
    vetVisits: [],
    vaccinations: [],
  }

  cats = [...cats, newCat]
  return newCat
}

export async function updateCat(id: string, catData: any): Promise<Cat> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const catIndex = cats.findIndex((cat) => cat.id === id)
  if (catIndex === -1) throw new Error("Cat not found")

  const updatedCat = {
    ...cats[catIndex],
    name: catData.name,
    breed: catData.breed,
    age: catData.age,
    birthDate: catData.birthDate ? catData.birthDate.toISOString().split("T")[0] : undefined,
    imageUrl: catData.imageUrl,
    specialNeeds: catData.specialNeeds || false,
    notes: catData.notes,
    feedingSchedule: catData.feedingSchedule,
  }

  cats[catIndex] = updatedCat
  return updatedCat
}

export async function deleteCat(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  cats = cats.filter((cat) => cat.id !== id)
}

// Weight tracking
export async function addWeight(catId: string, weightData: any): Promise<Weight> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const catIndex = cats.findIndex((cat) => cat.id === catId)
  if (catIndex === -1) throw new Error("Cat not found")

  const newWeight: Weight = {
    id: uuidv4(),
    value: weightData.value,
    date: weightData.date.toISOString().split("T")[0],
    notes: weightData.notes,
  }

  cats[catIndex].weights.push(newWeight)
  return newWeight
}

export async function deleteWeight(catId: string, weightId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const catIndex = cats.findIndex((cat) => cat.id === catId)
  if (catIndex === -1) throw new Error("Cat not found")

  cats[catIndex].weights = cats[catIndex].weights.filter((w) => w.id !== weightId)
}

// Vet visits
export async function addVetVisit(catId: string, visitData: any): Promise<VetVisit> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const catIndex = cats.findIndex((cat) => cat.id === catId)
  if (catIndex === -1) throw new Error("Cat not found")

  const newVisit: VetVisit = {
    id: uuidv4(),
    date: visitData.date.toISOString().split("T")[0],
    reason: visitData.reason,
    notes: visitData.notes,
    vetName: visitData.vetName,
  }

  cats[catIndex].vetVisits.push(newVisit)
  return newVisit
}

export async function deleteVetVisit(catId: string, visitId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const catIndex = cats.findIndex((cat) => cat.id === catId)
  if (catIndex === -1) throw new Error("Cat not found")

  cats[catIndex].vetVisits = cats[catIndex].vetVisits.filter((v) => v.id !== visitId)
}

// Vaccinations
export async function addVaccination(catId: string, vaccinationData: any): Promise<Vaccination> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const catIndex = cats.findIndex((cat) => cat.id === catId)
  if (catIndex === -1) throw new Error("Cat not found")

  const newVaccination: Vaccination = {
    id: uuidv4(),
    name: vaccinationData.name,
    date: vaccinationData.date.toISOString().split("T")[0],
    dueDate: vaccinationData.dueDate.toISOString().split("T")[0],
    notes: vaccinationData.notes,
  }

  cats[catIndex].vaccinations.push(newVaccination)
  return newVaccination
}

export async function deleteVaccination(catId: string, vaccinationId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const catIndex = cats.findIndex((cat) => cat.id === catId)
  if (catIndex === -1) throw new Error("Cat not found")

  cats[catIndex].vaccinations = cats[catIndex].vaccinations.filter((v) => v.id !== vaccinationId)
}

// Image upload (mock)
export async function uploadImage(file: File): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // In a real app, this would upload to a storage service and return the URL
  return `/placeholder.svg?height=200&width=200`
}

