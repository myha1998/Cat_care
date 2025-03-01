"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { createCat, updateCat } from "@/lib/api"
import type { Cat } from "@/lib/types"
import { ImageUpload } from "@/components/image-upload"

const catFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.coerce.number().min(0, "Age must be a positive number"),
  birthDate: z.date().optional(),
  imageUrl: z.string().optional(),
  specialNeeds: z.boolean().default(false),
  notes: z.string().optional(),
  feedingSchedule: z.string().optional(),
})

type CatFormValues = z.infer<typeof catFormSchema>

interface CatFormProps {
  cat?: Cat
}

export function CatForm({ cat }: CatFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [imageUploading, setImageUploading] = useState(false)

  const defaultValues: Partial<CatFormValues> = cat
    ? {
        name: cat.name,
        breed: cat.breed,
        age: cat.age,
        birthDate: cat.birthDate ? new Date(cat.birthDate) : undefined,
        imageUrl: cat.imageUrl,
        specialNeeds: cat.specialNeeds,
        notes: cat.notes,
        feedingSchedule: cat.feedingSchedule,
      }
    : {
        name: "",
        breed: "",
        age: 0,
        specialNeeds: false,
        notes: "",
        feedingSchedule: "",
      }

  const form = useForm<CatFormValues>({
    resolver: zodResolver(catFormSchema),
    defaultValues,
  })

  const mutation = useMutation({
    mutationFn: (values: CatFormValues) => {
      if (cat) {
        return updateCat(cat.id, { ...values, imageUrl: values.imageUrl || "" })
      } else {
        return createCat({ ...values, imageUrl: values.imageUrl || "" })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] })
      router.push("/")
    },
  })

  function onSubmit(values: CatFormValues) {
    mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center">
                    <FormControl>
                      <ImageUpload value={field.value} onChange={field.onChange} onUploading={setImageUploading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Whiskers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="Maine Coon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (years)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birth Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="feedingSchedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feeding Schedule</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Morning: 1/4 cup dry food, Evening: 1/2 can wet food"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Describe your cat's feeding routine and preferences</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information about your cat"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="specialNeeds"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Special Needs</FormLabel>
                <FormDescription>Does your cat have any special dietary or medical needs?</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending || imageUploading} className="w-full md:w-auto">
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {cat ? "Update Cat" : "Add Cat"}
        </Button>
      </form>
    </Form>
  )
}

