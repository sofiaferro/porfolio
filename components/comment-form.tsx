"use client"

import type React from "react"

import { useState } from "react"
import { addComment } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function CommentForm({ postId }: { postId: string }) {
  const [authorName, setAuthorName] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authorName.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Por favor completa todos los campos" })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await addComment(postId, authorName, content)

      if (result.success) {
        setMessage({ type: "success", text: "¡Comentario añadido con éxito!" })
        setAuthorName("")
        setContent("")
      } else {
        setMessage({ type: "error", text: result.error || "Error al añadir el comentario" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al procesar la solicitud" })
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-serif mb-4">Deja un comentario</h3>

      <div className="space-y-2">
        <Label htmlFor="author-name">Nombre</Label>
        <Input
          id="author-name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Tu nombre"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment-content">Comentario</Label>
        <Textarea
          id="comment-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu comentario aquí..."
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      {message && (
        <div
          className={`p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="font-mono">
        {isSubmitting ? "Enviando..." : "Enviar comentario"}
      </Button>
    </form>
  )
}

