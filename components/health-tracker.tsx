"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { addWeight, addVetVisit, addVaccination, deleteWeight, deleteVetVisit, deleteVaccination } from "@/lib/api"
import type { Cat } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface HealthTrackerProps {
  cat: Cat
}

const weightFormSchema = z.object({
  value: z.coerce.number().min(0.1, "Weight must be greater than 0"),
  date: z.date(),
  notes: z.string().optional(),
})

const vetVisitFormSchema = z.object({
  date: z.date(),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
  vetName: z.string().optional(),
})

const vaccinationFormSchema = z.object({
  name: z.string().min(1, "Vaccination name is required"),
  date: z.date(),
  dueDate: z.date(),
  notes: z.string().optional(),
})

type WeightFormValues = z.infer<typeof weightFormSchema>
type VetVisitFormValues = z.infer<typeof vetVisitFormSchema>
type VaccinationFormValues = z.infer<typeof vaccinationFormSchema>

export function HealthTracker({ cat }: HealthTrackerProps) {
  return (
    <Tabs defaultValue="weight" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="weight">Weight</TabsTrigger>
        <TabsTrigger value="vet-visits">Vet Visits</TabsTrigger>
        <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
      </TabsList>
      <TabsContent value="weight">
        <WeightTracker cat={cat} />
      </TabsContent>
      <TabsContent value="vet-visits">
        <VetVisitTracker cat={cat} />
      </TabsContent>
      <TabsContent value="vaccinations">
        <VaccinationTracker cat={cat} />
      </TabsContent>
    </Tabs>
  )
}

function WeightTracker({ cat }: HealthTrackerProps) {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const weightForm = useForm<WeightFormValues>({
    resolver: zodResolver(weightFormSchema),
    defaultValues: {
      value: undefined,
      date: new Date(),
      notes: "",
    },
  })

  const addWeightMutation = useMutation({
    mutationFn: (values: WeightFormValues) => addWeight(cat.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] })
      weightForm.reset()
      setShowForm(false)
    },
  })

  const deleteWeightMutation = useMutation({
    mutationFn: (weightId: string) => deleteWeight(cat.id, weightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] })
    },
  })

  function onSubmitWeight(values: WeightFormValues) {
    addWeightMutation.mutate(values)
  }

  const sortedWeights = [...cat.weights].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const chartData = [...cat.weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Weight History</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Weight
            </Button>
          </div>
          <CardDescription>Track your cat's weight over time</CardDescription>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Form {...weightForm}>
              <form onSubmit={weightForm.handleSubmit(onSubmitWeight)} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={weightForm.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={weightForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={weightForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any observations about weight change" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          )}

          {chartData.length > 0 ? (
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM d")} />
                  <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} />
                  <Tooltip
                    formatter={(value) => [`${value} kg`, "Weight"]}
                    labelFormatter={(label) => format(new Date(label), "PPP")}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No weight records yet. Add your cat's weight to start tracking.
            </div>
          )}

          {sortedWeights.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Weight (kg)</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedWeights.map((weight) => (
                  <TableRow key={weight.id}>
                    <TableCell>{format(new Date(weight.date), "PPP")}</TableCell>
                    <TableCell>{weight.value} kg</TableCell>
                    <TableCell>{weight.notes || "-"}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete weight record</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this weight record? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteWeightMutation.mutate(weight.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function VetVisitTracker({ cat }: HealthTrackerProps) {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const vetVisitForm = useForm<VetVisitFormValues>({
    resolver: zodResolver(vetVisitFormSchema),
    defaultValues: {
      date: new Date(),
      reason: "",
      notes: "",
      vetName: "",
    },
  })

  const addVetVisitMutation = useMutation({
    mutationFn: (values: VetVisitFormValues) => addVetVisit(cat.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] })
      vetVisitForm.reset()
      setShowForm(false)
    },
  })

  const deleteVetVisitMutation = useMutation({
    mutationFn: (visitId: string) => deleteVetVisit(cat.id, visitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] })
    },
  })

  function onSubmitVetVisit(values: VetVisitFormValues) {
    addVetVisitMutation.mutate(values)
  }

  const sortedVetVisits = [...cat.vetVisits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Vet Visits</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vet Visit
            </Button>
          </div>
          <CardDescription>Record your cat's veterinary appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Form {...vetVisitForm}>
              <form onSubmit={vetVisitForm.handleSubmit(onSubmitVetVisit)} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={vetVisitForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={vetVisitForm.control}
                    name="vetName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Veterinarian</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={vetVisitForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Visit</FormLabel>
                      <FormControl>
                        <Input placeholder="Annual checkup" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={vetVisitForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Diagnosis, treatments, recommendations" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          )}

          {sortedVetVisits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Veterinarian</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedVetVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>{format(new Date(visit.date), "PPP")}</TableCell>
                    <TableCell>{visit.reason}</TableCell>
                    <TableCell>{visit.vetName || "-"}</TableCell>
                    <TableCell>{visit.notes || "-"}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete vet visit</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this vet visit record? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteVetVisitMutation.mutate(visit.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No vet visits recorded yet. Add your cat's vet visits to start tracking.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function VaccinationTracker({ cat }: HealthTrackerProps) {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const vaccinationForm = useForm<VaccinationFormValues>({
    resolver: zodResolver(vaccinationFormSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      notes: "",
    },
  })

  const addVaccinationMutation = useMutation({
    mutationFn: (values: VaccinationFormValues) => addVaccination(cat.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] })
      vaccinationForm.reset()
      setShowForm(false)
    },
  })

  const deleteVaccinationMutation = useMutation({
    mutationFn: (vaccinationId: string) => deleteVaccination(cat.id, vaccinationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] })
    },
  })

  function onSubmitVaccination(values: VaccinationFormValues) {
    addVaccinationMutation.mutate(values)
  }

  const sortedVaccinations = [...cat.vaccinations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Vaccinations</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vaccination
            </Button>
          </div>
          <CardDescription>Track your cat's vaccination history</CardDescription>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Form {...vaccinationForm}>
              <form onSubmit={vaccinationForm.handleSubmit(onSubmitVaccination)} className="space-y-4 mb-6">
                <FormField
                  control={vaccinationForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vaccination Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Rabies, FVRCP, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={vaccinationForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date Administered</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={vaccinationForm.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={vaccinationForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Batch number, reactions, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          )}

          {sortedVaccinations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaccination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedVaccinations.map((vaccination) => (
                  <TableRow key={vaccination.id}>
                    <TableCell>{vaccination.name}</TableCell>
                    <TableCell>{format(new Date(vaccination.date), "PPP")}</TableCell>
                    <TableCell>{format(new Date(vaccination.dueDate), "PPP")}</TableCell>
                    <TableCell>{vaccination.notes || "-"}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete vaccination record</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this vaccination record? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteVaccinationMutation.mutate(vaccination.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No vaccinations recorded yet. Add your cat's vaccinations to start tracking.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

