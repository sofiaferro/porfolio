"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Link,
  List,
  ListOrdered,
  Save,
  Eye,
  Sun,
  Moon,
} from "lucide-react"
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/actions"
import type { BlogPost } from "@/lib/actions"

export default function AdminPage() {
  const { theme, setTheme } = useTheme()
  const [previewMode, setPreviewMode] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [currentPostId, setCurrentPostId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getBlogPosts()
        setBlogPosts(posts)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleSavePost = async () => {
    if (!title.trim() || !content.trim() || !excerpt.trim()) {
      setMessage({ type: "error", text: "Por favor completa todos los campos" })
      return
    }

    setMessage(null)

    try {
      let result

      if (currentPostId) {
        // Update existing post
        result = await updateBlogPost(currentPostId, title, content, excerpt)
      } else {
        // Create new post
        result = await createBlogPost(title, content, excerpt)
      }

      if (result.success) {
        setMessage({ type: "success", text: currentPostId ? "Post actualizado con éxito" : "Post creado con éxito" })

        // Refresh posts list
        const posts = await getBlogPosts()
        setBlogPosts(posts)

        if (!currentPostId) {
          // Clear form if it was a new post
          setTitle("")
          setContent("")
          setExcerpt("")
        }
      } else {
        setMessage({ type: "error", text: result.error || "Error al guardar el post" })
      }
    } catch (error) {
      console.error("Error saving post:", error)
      setMessage({ type: "error", text: "Error al procesar la solicitud" })
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este post?")) {
      return
    }

    try {
      const result = await deleteBlogPost(id)

      if (result.success) {
        setMessage({ type: "success", text: "Post eliminado con éxito" })

        // Refresh posts list
        const posts = await getBlogPosts()
        setBlogPosts(posts)

        // Clear form if the deleted post was being edited
        if (currentPostId === id) {
          setTitle("")
          setContent("")
          setExcerpt("")
          setCurrentPostId(null)
        }
      } else {
        setMessage({ type: "error", text: result.error || "Error al eliminar el post" })
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      setMessage({ type: "error", text: "Error al procesar la solicitud" })
    }
  }

  const handleEditPost = (post: BlogPost) => {
    setTitle(post.title)
    setContent(post.content)
    setExcerpt(post.excerpt)
    setCurrentPostId(post.id)
    setPreviewMode(false)
  }

  const handleNewPost = () => {
    setTitle("")
    setContent("")
    setExcerpt("")
    setCurrentPostId(null)
    setPreviewMode(false)
  }

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 pt-12 pb-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-serif">Área de Administración</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch checked={theme === "dark"} onCheckedChange={toggleDarkMode} id="dark-mode" />
              <Moon className="h-4 w-4" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="font-mono text-xs"
            >
              {previewMode ? (
                <>
                  <Save className="h-3 w-3 mr-2" />
                  EDITAR
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-2" />
                  VISTA PREVIA
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="post" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="post" className="font-mono text-xs">
              PUBLICACIÓN
            </TabsTrigger>
            <TabsTrigger value="posts" className="font-mono text-xs">
              GESTIONAR POSTS
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-mono text-xs">
              AJUSTES
            </TabsTrigger>
          </TabsList>

          <TabsContent value="post" className="space-y-8">
            {!previewMode ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Título de la publicación"
                      className="font-serif text-lg"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Extracto</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Breve descripción de la publicación"
                      className="resize-none h-24"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="content">Contenido</Label>
                      <div className="flex items-center space-x-1 bg-muted p-1 rounded-md">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Underline className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-border mx-1" />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <AlignRight className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-border mx-1" />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Link className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <List className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      id="content"
                      placeholder="Escribe el contenido de tu publicación aquí..."
                      className="min-h-[400px] font-serif"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                </div>

                <div className="md:col-span-4 space-y-6">
                  <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-mono text-sm">PUBLICACIÓN</h3>

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

                    <div className="pt-2">
                      <Button className="w-full font-mono" onClick={handleSavePost}>
                        {currentPostId ? "ACTUALIZAR" : "GUARDAR"}
                      </Button>

                      {currentPostId && (
                        <Button variant="outline" className="w-full font-mono mt-2" onClick={handleNewPost}>
                          NUEVO POST
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-mono text-sm">IMAGEN DESTACADA</h3>
                    <div className="border-2 border-dashed rounded-md p-8 text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Arrastra una imagen o haz clic para seleccionar
                      </p>
                      <Button variant="outline" size="sm" className="font-mono text-xs">
                        SELECCIONAR
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-mono text-sm">CATEGORÍAS Y ETIQUETAS</h3>

                    <div className="space-y-2">
                      <Label htmlFor="categories">Categorías</Label>
                      <select
                        id="categories"
                        className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                        multiple
                      >
                        <option value="software">Desarrollo de Software</option>
                        <option value="ai">Inteligencia Artificial</option>
                        <option value="web">Diseño Web</option>
                        <option value="creative">Tecnología Creativa</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                      <Input id="tags" placeholder="javascript, react, ai..." />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-md p-8">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-3xl md:text-4xl font-serif mb-4">{title || "Vista previa de la publicación"}</h1>
                  <p className="text-sm font-mono text-muted-foreground mb-8">
                    {new Date()
                      .toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                      .toUpperCase()}
                  </p>

                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {content ? (
                      content.split("\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)
                    ) : (
                      <p className="text-muted-foreground">
                        Esta es una vista previa de cómo se verá tu publicación. Añade contenido para verlo aquí.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts" className="space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif">Gestionar Publicaciones</h2>
              <Button onClick={handleNewPost} className="font-mono text-xs">
                NUEVA PUBLICACIÓN
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cargando publicaciones...</p>
              </div>
            ) : blogPosts.length > 0 ? (
              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <div key={post.id} className="p-4 border rounded-md flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{post.title}</h3>
                      <p className="text-xs font-mono text-muted-foreground">
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                        className="font-mono text-xs"
                      >
                        EDITAR
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="font-mono text-xs"
                      >
                        ELIMINAR
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md">
                <p className="text-muted-foreground mb-4">No hay publicaciones disponibles.</p>
                <Button onClick={handleNewPost} className="font-mono text-xs">
                  CREAR PRIMERA PUBLICACIÓN
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6 p-6 border rounded-md">
                <h3 className="text-xl font-serif">Perfil</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" placeholder="Sofia Ferro" defaultValue="Sofia Ferro" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    placeholder="Breve descripción sobre ti"
                    className="resize-none h-24"
                    defaultValue="Software Engineer, AI Engineer & Creative Technologist"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>

                <Button className="font-mono">ACTUALIZAR PERFIL</Button>
              </div>

              <div className="space-y-6 p-6 border rounded-md">
                <h3 className="text-xl font-serif">Preferencias</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Modo Oscuro</h4>
                    <p className="text-sm text-muted-foreground">Cambiar entre modo claro y oscuro</p>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={toggleDarkMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificaciones por Email</h4>
                    <p className="text-sm text-muted-foreground">Recibir notificaciones por email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Vista Previa Automática</h4>
                    <p className="text-sm text-muted-foreground">Mostrar vista previa al escribir</p>
                  </div>
                  <Switch />
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full font-mono">
                    RESTABLECER AJUSTES
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

