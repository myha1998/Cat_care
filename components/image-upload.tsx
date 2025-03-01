"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/api"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onUploading: (isUploading: boolean) => void
}

export function ImageUpload({ value, onChange, onUploading }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      onUploading(true)

      // In a real app, this would upload to a storage service
      const imageUrl = await uploadImage(file)
      onChange(imageUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
      onUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32 border-2">
        <AvatarImage src={value || "/placeholder.svg?height=128&width=128"} alt="Cat image" />
        <AvatarFallback className="bg-primary/10">
          <Camera className="h-10 w-10 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" className="relative" disabled={isUploading}>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <Upload className="h-4 w-4 mr-2" />
          {value ? "Change Photo" : "Upload Photo"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}

