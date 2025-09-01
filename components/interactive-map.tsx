'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Minus, Map, Home, User, Code, Briefcase, Mail, BookOpen, Zap, Cpu, Palette, ArrowLeft, Image, FileText, ExternalLink, Calendar } from 'lucide-react'
import MobileMapControls from './mobile-map-controls'
import { useTouchGestures } from './mobile-map-controls'
import { projectsData } from '@/data/projects'
import { getBlogPosts } from '@/lib/blog-actions'
import type { BlogPost } from '@/lib/types'

interface TreeNode {
  id: string
  title: string
  description: string
  position: { x: number; y: number }
  type: 'about' | 'skills' | 'projects' | 'services' | 'contact' | 'blog' | 'project' | 'blogPost' | 'projectComponent' | 'blogComponent'
  connections: string[]
  icon: React.ReactNode
  content?: any
  parentId?: string
  level: number
  children?: TreeNode[]
  action?: () => void
  metadata?: {
    technologies?: string[]
    year?: string
    link?: string
    images?: any[]
    excerpt?: string
    date?: string
  }
}

interface MapPosition {
  x: number
  y: number
  scale: number
}

export default function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [currentLevel, setCurrentLevel] = useState<'main' | 'projects' | 'blog' | 'project' | 'blogPost'>('main')
  const [currentContext, setCurrentContext] = useState<any>(null)
  const hasCenteredRef = useRef(false)
  const hasInitializedRef = useRef(false)
  const initialPositionRef = useRef<{ x: number; y: number; scale: number } | null>(null)
  const [centerPosition, setCenterPosition] = useState({ x: 0, y: 0, scale: 1 })
  
  // Basic debugging
  console.log('InteractiveMap component rendering, currentLevel:', currentLevel, 'hasInitialized:', hasInitializedRef.current, 'initialPosition:', initialPositionRef.current)
  
  // Motion values for pan and zoom - not used anymore, keeping for compatibility
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  
  // Transform values for smooth animations - not used anymore
  const transformX = useTransform(x, (value) => value)
  const transformY = useTransform(y, (value) => value)
  const transformScale = useTransform(scale, (value) => value)
  
  // Sync motion values with centerPosition state
  useEffect(() => {
    if (hasInitializedRef.current && centerPosition.x !== 0 && centerPosition.y !== 0) {
      console.log('Syncing motion values to:', centerPosition)
      x.set(centerPosition.x)
      y.set(centerPosition.y)
      scale.set(centerPosition.scale)
    }
  }, [centerPosition, x, y, scale])
  
  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const posts = await getBlogPosts()
        setBlogPosts(posts.slice(0, 3))
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      }
    }
    fetchBlogPosts()
  }, [])
  
  // Generate project component nodes
  const generateProjectComponents = (project: any): TreeNode[] => {
    const components: TreeNode[] = []
    
    // Create a more organic, flowing arrangement
    const positions = [
      { x: -200, y: -120 },  // Title - top left
      { x: 200, y: -120 },   // Description - top right
      { x: -200, y: 120 },   // Technologies - bottom left
      { x: 200, y: 120 },    // Link - bottom right
      { x: 0, y: 200 }       // Images - bottom center
    ]
    
    // Title component
    components.push({
      id: `${project.id}-title`,
      title: 'Title',
      description: project.title,
      position: positions[0],
      type: 'projectComponent',
      connections: [`${project.id}-description`],
      icon: <FileText className="w-5 h-5" />,
      parentId: project.id,
      level: 2,
      metadata: { year: project.year }
    })
    
    // Description component
    components.push({
      id: `${project.id}-description`,
      title: 'Description',
      description: project.description.substring(0, 100) + '...',
      position: positions[1],
      type: 'projectComponent',
      connections: [`${project.id}-title`, `${project.id}-technologies`],
      icon: <FileText className="w-5 h-5" />,
      parentId: project.id,
      level: 2
    })
    
    // Technologies component
    components.push({
      id: `${project.id}-technologies`,
      title: 'Technologies',
      description: project.technologies.join(', '),
      position: positions[2],
      type: 'projectComponent',
      connections: [`${project.id}-description`, project.link ? `${project.id}-link` : `${project.id}-images`],
      icon: <Code className="w-5 h-5" />,
      parentId: project.id,
      level: 2,
      metadata: { technologies: project.technologies }
    })
    
    // Link component
    if (project.link) {
      components.push({
        id: `${project.id}-link`,
        title: 'Project Link',
        description: 'View live project',
        position: positions[3],
        type: 'projectComponent',
        connections: [`${project.id}-technologies`, `${project.id}-images`],
        icon: <ExternalLink className="w-5 h-5" />,
        parentId: project.id,
        level: 2,
        metadata: { link: project.link }
      })
    }
    
    // Images component
    if (project.images && project.images.length > 0) {
      components.push({
        id: `${project.id}-images`,
        title: 'Gallery',
        description: `${project.images.length} images`,
        position: positions[4],
        type: 'projectComponent',
        connections: project.link ? [`${project.id}-link`] : [`${project.id}-technologies`],
        icon: <Image className="w-5 h-5" />,
        parentId: project.id,
        level: 2,
        metadata: { images: project.images }
      })
    }
    
    return components
  }
  
  // Generate blog post component nodes
  const generateBlogComponents = (post: BlogPost): TreeNode[] => {
    const components: TreeNode[] = []
    
    // Create a more organic, flowing arrangement
    const positions = [
      { x: -150, y: -80 },   // Title - top left
      { x: 150, y: -80 },    // Excerpt - top right
      { x: 0, y: 0 },        // Content - center
      { x: 0, y: 120 }       // Image - bottom center
    ]
    
    // Title component
    components.push({
      id: `${post.id}-title`,
      title: 'Title',
      description: post.title_en,
      position: positions[0],
      type: 'blogComponent',
      connections: [`${post.id}-excerpt`],
      icon: <FileText className="w-5 h-5" />,
      parentId: post.id,
      level: 2,
      metadata: { date: post.date }
    })
    
    // Excerpt component
    components.push({
      id: `${post.id}-excerpt`,
      title: 'Excerpt',
      description: post.excerpt_en?.substring(0, 80) + '...',
      position: positions[1],
      type: 'blogComponent',
      connections: [`${post.id}-title`, `${post.id}-content`],
      icon: <FileText className="w-5 h-5" />,
      parentId: post.id,
      level: 2
    })
    
    // Content component
    components.push({
      id: `${post.id}-content`,
      title: 'Content',
      description: 'Full article content',
      position: positions[2],
      type: 'blogComponent',
      connections: [`${post.id}-excerpt`, post.image ? `${post.id}-image` : undefined].filter(Boolean) as string[],
      icon: <FileText className="w-5 h-5" />,
      parentId: post.id,
      level: 2
    })
    
    // Image component
    if (post.image) {
      components.push({
        id: `${post.id}-image`,
        title: 'Featured Image',
        description: 'Article image',
        position: positions[3],
        type: 'blogComponent',
        connections: [`${post.id}-content`],
        icon: <Image className="w-5 h-5" />,
        parentId: post.id,
        level: 2,
        metadata: { images: [{ src: post.image, alt: post.title_en }] }
      })
    }
    
    return components
  }
  
  // Generate nodes based on current level
  const generateNodes = (): TreeNode[] => {
    // Calculate centering offset based on current level
    const getCenteringOffset = () => {
      if (currentLevel === 'main') {
        return { x: 0, y: 0 }
      } else if (currentLevel === 'projects' || currentLevel === 'blog') {
        return { x: 0, y: 0 }
      } else {
        // For individual project/blog post views, center the content
        return { x: 0, y: 0 }
      }
    }
    
    const centeringOffset = getCenteringOffset()
    
    switch (currentLevel) {
      case 'main':
        return [
          {
            id: 'about',
            title: 'About Me',
            description: 'Software Engineer, AI Engineer, and Creative Technologist',
            position: { x: 0 + centeringOffset.x, y: 0 + centeringOffset.y },
            type: 'about',
            connections: ['skills', 'projects', 'blog', 'services'],
            icon: <User className="w-6 h-6" />,
            level: 0
          },
          {
            id: 'skills',
            title: 'Skills & Expertise',
            description: 'Full-stack development, AI/ML, creative coding, IoT & electronics',
            position: { x: -250 + centeringOffset.x, y: -180 + centeringOffset.y },
            type: 'skills',
            connections: ['about', 'projects', 'services'],
            icon: <Code className="w-6 h-6" />,
            level: 0
          },
          {
            id: 'projects',
            title: 'Portfolio Projects',
            description: `${projectsData.length} creative projects including IoT, literature, and installations`,
            position: { x: 250 + centeringOffset.x, y: -180 + centeringOffset.y },
            type: 'projects',
            connections: ['about', 'skills', 'services'],
            icon: <Briefcase className="w-6 h-6" />,
            level: 0,
            action: () => navigateToLevel('projects')
          },
          {
            id: 'blog',
            title: 'Latest Blog Posts',
            description: `${blogPosts.length} recent articles on tech, creativity, and development`,
            position: { x: -250 + centeringOffset.x, y: 180 + centeringOffset.y },
            type: 'blog',
            connections: ['about', 'skills', 'services'],
            icon: <BookOpen className="w-6 h-6" />,
            level: 0,
            action: () => navigateToLevel('blog')
          },
          {
            id: 'services',
            title: 'Services',
            description: 'Full-stack development, AI consulting, creative coding workshops, IoT projects',
            position: { x: 250 + centeringOffset.x, y: 180 + centeringOffset.y },
            type: 'services',
            connections: ['about', 'skills', 'projects', 'blog'],
            icon: <Zap className="w-6 h-6" />,
            level: 0
          },
          {
            id: 'contact',
            title: 'Get In Touch',
            description: 'Let\'s work together on your next project',
            position: { x: 0 + centeringOffset.x, y: 300 + centeringOffset.y },
            type: 'contact',
            connections: ['about', 'services'],
            icon: <Mail className="w-6 h-6" />,
            level: 0
          }
        ]
      
      case 'projects':
        return [
          {
            id: 'back-to-main',
            title: '← Back to Main',
            description: 'Return to main portfolio view',
            position: { x: 0 + centeringOffset.x, y: -350 + centeringOffset.y },
            type: 'about',
            connections: [],
            icon: <ArrowLeft className="w-6 h-6" />,
            level: 1,
            action: () => navigateToLevel('main')
          },
          ...projectsData.map((project, index) => {
            // Create a more organic, circular arrangement
            const angle = (index / projectsData.length) * 2 * Math.PI
            const radius = 200
            const x = Math.cos(angle) * radius + centeringOffset.x
            const y = Math.sin(angle) * radius + centeringOffset.y
            
            return {
              id: project.id,
              title: project.title,
              description: project.description.substring(0, 100) + '...',
              position: { x, y },
              type: 'project' as const,
              connections: ['back-to-main'],
              icon: <Briefcase className="w-6 h-6" />,
              level: 1,
              content: project,
              action: () => navigateToProject(project)
            }
          })
        ]
      
      case 'blog':
        return [
          {
            id: 'back-to-main',
            title: '← Back to Main',
            description: 'Return to main portfolio view',
            position: { x: 0 + centeringOffset.x, y: -250 + centeringOffset.y },
            type: 'about',
            connections: [],
            icon: <ArrowLeft className="w-6 h-6" />,
            level: 1,
            action: () => navigateToLevel('main')
          },
          ...blogPosts.map((post, index) => {
            // Create a more organic, flowing arrangement
            const angle = (index / blogPosts.length) * 2 * Math.PI
            const radius = 150
            const x = Math.cos(angle) * radius + centeringOffset.x
            const y = Math.sin(angle) * radius + centeringOffset.y
            
            return {
              id: post.id,
              title: post.title_en,
              description: post.excerpt_en?.substring(0, 100) + '...',
              position: { x, y },
              type: 'blogPost' as const,
              connections: ['back-to-main'],
              icon: <BookOpen className="w-6 h-6" />,
              level: 1,
              content: post,
              action: () => navigateToBlogPost(post)
            }
          })
        ]
      
      case 'project':
        if (!currentContext) return []
        return [
          {
            id: 'back-to-projects',
            title: '← Back to Projects',
            description: 'Return to projects overview',
            position: { x: 0 + centeringOffset.x, y: -250 + centeringOffset.y },
            type: 'about',
            connections: [],
            icon: <ArrowLeft className="w-6 h-6" />,
            level: 2,
            action: () => navigateToLevel('projects')
          },
          ...generateProjectComponents(currentContext)
        ]
      
      case 'blogPost':
        if (!currentContext) return []
        return [
          {
            id: 'back-to-blog',
            title: '← Back to Blog',
            description: 'Return to blog overview',
            position: { x: 0 + centeringOffset.x, y: -200 + centeringOffset.y },
            type: 'about',
            connections: [],
            icon: <ArrowLeft className="w-6 h-6" />,
            level: 2,
            action: () => navigateToLevel('blog')
          },
          ...generateBlogComponents(currentContext)
        ]
      
      default:
        return []
    }
  }
  
  const nodes = generateNodes()
  
  // Navigation functions
  const navigateToLevel = (level: typeof currentLevel) => {
    setCurrentLevel(level)
    setCurrentContext(null)
    setSelectedNode(null)
    hasCenteredRef.current = false // Reset centering flag
    // Manually trigger centering after a delay
    setTimeout(() => centerView(), 300)
  }
  
  const navigateToProject = (project: any) => {
    setCurrentLevel('project')
    setCurrentContext(project)
    setSelectedNode(null)
    hasCenteredRef.current = false // Reset centering flag
    // Manually trigger centering after a delay
    setTimeout(() => centerView(), 300)
  }
  
  const navigateToBlogPost = (post: BlogPost) => {
    setCurrentLevel('blogPost')
    setCurrentContext(post)
    setSelectedNode(null)
    hasCenteredRef.current = false // Reset centering flag
    // Manually trigger centering after a delay
    setTimeout(() => centerView(), 300)
  }
  
  // Auto-center view to show all nodes - simplified
  const centerView = useCallback(() => {
    console.log('centerView called')
    
    const currentNodes = generateNodes()
    if (currentNodes.length === 0) return
    
    // Calculate bounds of all nodes (including their size)
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    
    currentNodes.forEach(node => {
      // Account for node size (nodes are roughly 320x160)
      const nodeWidth = 320
      const nodeHeight = 160
      
      minX = Math.min(minX, node.position.x - nodeWidth/2)
      maxX = Math.max(maxX, node.position.x + nodeWidth/2)
      minY = Math.min(minY, node.position.y - nodeHeight/2)
      maxY = Math.max(maxY, node.position.y + nodeHeight/2)
    })
    
    // Calculate content center
    const contentCenterX = (minX + maxX) / 2
    const contentCenterY = (minY + maxY) / 2
    
    // Calculate viewport center
    const viewportCenterX = window.innerWidth / 2
    const viewportCenterY = window.innerHeight / 2
    
    // Calculate offset needed to center content
    const offsetX = viewportCenterX - contentCenterX
    const offsetY = viewportCenterY - contentCenterY
    
    console.log('Centering to:', { x: offsetX, y: offsetY, scale: 1 })
    
    // Update both state and motion values
    setCenterPosition({ x: offsetX, y: offsetY, scale: 1 })
    x.set(offsetX)
    y.set(offsetY)
    scale.set(1)
  }, [x, y, scale])
  
  // Set initial center position - simplified approach
  useEffect(() => {
    console.log('Initial centering useEffect running')
    
    // Simple timeout to ensure component is stable
    const timer = setTimeout(() => {
      const initialCenter = calculateInitialCenter()
      console.log('Setting initial center position:', initialCenter)
      
      // Set both state and motion values
      setCenterPosition(initialCenter)
      x.set(initialCenter.x)
      y.set(initialCenter.y)
      scale.set(initialCenter.scale)
      
      // Mark as initialized
      hasInitializedRef.current = true
      hasCenteredRef.current = true
    }, 300)
    
    return () => clearTimeout(timer)
  }, []) // Only run once on mount
  
  // Simple navigation centering - only when level changes
  useEffect(() => {
    if (hasInitializedRef.current && currentLevel !== 'main') {
      console.log('Level changed, centering view for:', currentLevel)
      setTimeout(() => centerView(), 100)
    }
  }, [currentLevel]) // Only run when currentLevel changes
  
  // Debug: Log when centerPosition changes
  useEffect(() => {
    console.log('centerPosition state changed:', centerPosition)
  }, [centerPosition])
  
  // Calculate initial center position
  const calculateInitialCenter = () => {
    const currentNodes = generateNodes()
    if (currentNodes.length === 0) return { x: 0, y: 0, scale: 1 }
    
    // Calculate bounds of all nodes (including their size)
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    
    currentNodes.forEach(node => {
      // Account for node size (nodes are roughly 320x160)
      const nodeWidth = 320
      const nodeHeight = 160
      
      minX = Math.min(minX, node.position.x - nodeWidth/2)
      maxX = Math.max(maxX, node.position.x + nodeWidth/2)
      minY = Math.min(minY, node.position.y - nodeHeight/2)
      maxY = Math.max(maxY, node.position.y + nodeHeight/2)
    })
    
    // Calculate content center
    const contentCenterX = (minX + maxX) / 2
    const contentCenterY = (minY + maxY) / 2
    
    // Calculate viewport center
    const viewportCenterX = window.innerWidth / 2
    const viewportCenterY = window.innerHeight / 2
    
    // Calculate offset needed to center content
    const offsetX = viewportCenterX - contentCenterX
    const offsetY = viewportCenterY - contentCenterY
    
    return { x: offsetX, y: offsetY, scale: 1 }
  }
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Handle zoom
  const handleZoom = useCallback((delta: number) => {
    const newScale = Math.max(0.5, Math.min(3, scale.get() + delta * 0.1))
    scale.set(newScale)
    setCenterPosition(prev => ({ ...prev, scale: newScale }))
  }, [scale])
  
  // Reset to center
  const resetView = useCallback(() => {
    centerView()
    setSelectedNode(null)
  }, [centerView])
  
  // Handle node selection
  const handleNodeClick = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (node?.action) {
      node.action()
    } else {
      setSelectedNode(selectedNode === nodeId ? null : nodeId)
    }
  }, [selectedNode, nodes])
  
  // Handle wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      handleZoom(e.deltaY > 0 ? -1 : 1)
    }
    
    const mapElement = mapRef.current
    if (mapElement) {
      mapElement.addEventListener('wheel', handleWheel, { passive: false })
      return () => mapElement.removeEventListener('wheel', handleWheel)
    }
  }, [handleZoom])
  
  // Touch gestures for mobile
  const touchHandlers = useTouchGestures(
    (deltaX: number, deltaY: number) => {
      const newX = x.get() + deltaX
      const newY = y.get() + deltaY
      
      x.set(newX)
      y.set(newY)
      setCenterPosition(prev => ({ ...prev, x: newX, y: newY }))
    }, 
    handleZoom
  )
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent">
      {/* Level Indicator */}
      <div className="absolute top-6 left-6 z-40">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="text-white/70 text-sm font-medium">
              {currentLevel === 'main' && 'Main Portfolio'}
              {currentLevel === 'projects' && 'Projects Overview'}
              {currentLevel === 'blog' && 'Blog Posts'}
              {currentLevel === 'project' && `Project: ${currentContext?.title}`}
              {currentLevel === 'blogPost' && `Blog Post: ${currentContext?.title_en}`}
            </span>
            <button
              onClick={centerView}
              className="p-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 rounded-lg text-orange-400 transition-colors"
              title="Center View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Map Canvas */}
      <motion.div
        ref={mapRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing touch-none"
        style={{
          x: transformX,
          y: transformY,
          scale: transformScale,
        }}
        drag={!isMobile}
        dragMomentum={false}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDrag={(event, info) => {
          if (isDragging) {
            const newX = x.get() + info.delta.x
            const newY = y.get() + info.delta.y
            x.set(newX)
            y.set(newY)
            setCenterPosition(prev => ({ ...prev, x: newX, y: newY }))
          }
        }}
        onDragEnd={() => setIsDragging(false)}
        onTouchStart={touchHandlers.handleTouchStart}
        onTouchMove={touchHandlers.handleTouchMove}
        onTouchEnd={touchHandlers.handleTouchEnd}
      >
        {/* Debug: Show current position values */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-0 left-0 bg-black/80 text-white p-2 text-xs z-50">
            Motion: x={x.get().toFixed(1)}, y={y.get().toFixed(1)}, scale={scale.get().toFixed(3)} | State: x={centerPosition.x.toFixed(1)}, y={centerPosition.y.toFixed(1)}, scale={centerPosition.scale.toFixed(3)}
          </div>
        )}
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.map((node) =>
            node.connections.map((connectionId) => {
              const targetNode = nodes.find(n => n.id === connectionId)
              if (!targetNode) return null
              
              const startX = node.position.x + 150
              const startY = node.position.y + 75
              const endX = targetNode.position.x + 150
              const endY = targetNode.position.y + 75
              
              return (
                <motion.line
                  key={`${node.id}-${connectionId}`}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="rgba(255, 165, 0, 0.3)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              )
            })
          )}
        </svg>
        
        {/* Map Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className={`absolute w-80 h-40 p-6 rounded-2xl backdrop-blur-md border border-white/10 cursor-pointer transition-all duration-300 ${
              selectedNode === node.id
                ? 'bg-white/20 border-orange-400/50 shadow-2xl shadow-orange-500/20'
                : 'bg-white/5 hover:bg-white/10 hover:border-orange-300/30'
            } ${isMobile ? 'w-72 h-36 p-4' : ''} ${
              node.level === 0 ? 'border-2' : 
              node.level === 1 ? 'border' : 
              'border border-dashed'
            }`}
            style={{
              left: node.position.x,
              top: node.position.y,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: node.position.x / 1000 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNodeClick(node.id)}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                selectedNode === node.id 
                  ? 'bg-orange-500/20 text-orange-400' 
                  : 'bg-white/10 text-white/70'
              }`}>
                {node.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-white mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  {node.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {node.description}
                </p>
                {node.metadata?.year && (
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">
                      {node.metadata.year}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Expanded content when selected */}
            {selectedNode === node.id && (
              <motion.div
                className="mt-4 pt-4 border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="text-white/80 text-sm">
                  {node.type === 'about' && (
                    <p>Passionate about creating innovative solutions that bridge technology and creativity. Specializing in IoT, creative coding, and AI applications.</p>
                  )}
                  {node.type === 'skills' && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {['React', 'Next.js', 'TypeScript', 'Python', 'AI/ML', 'Three.js', 'Arduino', 'IoT', 'Creative Coding'].map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {node.type === 'projectComponent' && node.metadata?.technologies && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {node.metadata.technologies.map((tech: string) => (
                          <span key={tech} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {node.type === 'projectComponent' && node.metadata?.link && (
                    <div className="mt-2">
                      <a
                        href={node.metadata.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Project
                      </a>
                    </div>
                  )}
                  {node.type === 'blogComponent' && node.metadata?.date && (
                    <div className="mt-2 flex items-center gap-2 text-white/60 text-xs">
                      <Calendar className="w-4 h-4" />
                      {new Date(node.metadata.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Desktop Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3 hidden md:flex">
        <motion.button
          className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleZoom(1)}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleZoom(-1)}
        >
          <Minus className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          className="p-3 bg-orange-500/20 backdrop-blur-md border border-orange-400/30 rounded-xl text-orange-400 hover:bg-orange-500/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetView}
        >
          <Home className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Mobile Controls */}
      <MobileMapControls
        onZoomIn={() => handleZoom(1)}
        onZoomOut={() => handleZoom(-1)}
        onReset={resetView}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />
      
      {/* Mini-map */}
      <div className="absolute top-6 right-6 w-48 h-32 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-3 hidden md:block">
        <div className="flex items-center gap-2 mb-3">
          <Map className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm font-medium">Map View</span>
        </div>
        <div className="relative w-full h-20 bg-white/5 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs">
            {currentLevel === 'main' && 'Main'}
            {currentLevel === 'projects' && 'Projects'}
            {currentLevel === 'blog' && 'Blog'}
            {currentLevel === 'project' && 'Project'}
            {currentLevel === 'blogPost' && 'Post'}
          </div>
        </div>
      </div>
    </div>
  )
}
