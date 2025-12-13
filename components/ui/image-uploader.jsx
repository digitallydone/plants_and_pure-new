"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { toast } from "sonner"

export function ImageUploader({ value, onChange, folder = "plants-and-pure", className }) {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef(null)

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Upload failed")
      }

      const data = await res.json()
      onChange(data.url)
      toast.success("Image uploaded!")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function handleRemove() {
    onChange("")
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleUpload}
        className="hidden"
      />

      {value ? (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
          <img src={value || "/placeholder.svg"} alt="Uploaded" className="object-cover w-full h-full" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8" />
              <span className="text-sm">Click to upload image</span>
              <span className="text-xs">JPEG, PNG, WebP, GIF (max 5MB)</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}

export function MultiImageUploader({ value = [], onChange, folder = "plants-and-pure", maxImages = 5, className }) {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef(null)

  async function handleUpload(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (value.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    setIsUploading(true)
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) throw new Error("Upload failed")
        return res.json()
      })

      const results = await Promise.all(uploadPromises)
      onChange([...value, ...results.map((r) => r.url)])
      toast.success(`${files.length} image(s) uploaded!`)
    } catch (error) {
      toast.error("Some images failed to upload")
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function handleRemove(index) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
            <img src={url || "/placeholder.svg"} alt={`Image ${index + 1}`} className="object-cover w-full h-full" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => handleRemove(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">Add Image</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        {value.length}/{maxImages} images
      </p>
    </div>
  )
}
