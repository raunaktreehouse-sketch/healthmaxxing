"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPost } from "@/app/actions/post-actions"
import { UploadButton } from "@/lib/uploadthing"
import { X, Image, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function NewPostForm({ categories }: { categories: any[] }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase()
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags([...tags, tag])
        setTagInput("")
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !categoryId) {
      setError("Please fill in all required fields")
      return
    }
    setIsSubmitting(true)
    setError("")
    try {
      const post = await createPost({ title, content, categoryId, images, tags })
      router.push(`/forum/post/${post.slug}`)
    } catch (err: any) {
      setError(err.message || "Failed to create post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3">{error}</div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select onValueChange={setCategoryId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your discussion about?"
          maxLength={200}
          required
        />
        <p className="text-xs text-muted-foreground text-right">{title.length}/200</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts, experiences, studies, or questions. Be specific and constructive..."
          className="min-h-[300px] resize-none"
          required
        />
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2"><Image className="w-4 h-4" /> Images (optional)</Label>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg border border-border" />
                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res) setImages([...images, ...res.map(r => r.url)])
            }}
            onUploadError={(err) => setError("Image upload failed: " + err.message)}
            appearance={{
              button: "bg-muted text-foreground hover:bg-muted/80 text-sm px-4 py-2 rounded-lg",
              container: "w-full",
            }}
          />
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WebP — up to 4MB each</p>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2"><Tag className="w-4 h-4" /> Tags (optional)</Label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => setTags(tags.filter(t => t !== tag))}>
              # {tag} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="Add tags (press Enter or comma)"
          disabled={tags.length >= 5}
        />
        <p className="text-xs text-muted-foreground">{tags.length}/5 tags</p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} className="rounded-full px-6">
          {isSubmitting ? "Creating..." : "Create Discussion"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()} className="rounded-full">
          Cancel
        </Button>
      </div>
    </form>
  )
}