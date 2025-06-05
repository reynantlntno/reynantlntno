<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden">
    <canvas
      ref="canvasRef"
      class="absolute top-0 left-0 w-full h-full"
      :width="canvasWidth"
      :height="canvasHeight"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  particleCount: {
    type: Number,
    default: 50
  },
  particleColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.1)'
  },
  lineColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.05)'
  },
  particleSpeed: {
    type: Number,
    default: 0.5
  },
  connectionDistance: {
    type: Number,
    default: 100
  }
})

const containerRef = ref(null)
const canvasRef = ref(null)
const canvasWidth = ref(0)
const canvasHeight = ref(0)
const animationFrame = ref(null)
const particles = ref([])

class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.vx = (Math.random() - 0.5) * props.particleSpeed
    this.vy = (Math.random() - 0.5) * props.particleSpeed
    this.radius = Math.random() * 2 + 1
    this.opacity = Math.random() * 0.5 + 0.2
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1

    // Keep particles within bounds
    this.x = Math.max(0, Math.min(this.canvas.width, this.x))
    this.y = Math.max(0, Math.min(this.canvas.height, this.y))
  }

  draw(ctx) {
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = props.particleColor
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

const initParticles = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  particles.value = []
  for (let i = 0; i < props.particleCount; i++) {
    particles.value.push(new Particle(canvas))
  }
}

const drawConnections = (ctx) => {
  for (let i = 0; i < particles.value.length; i++) {
    for (let j = i + 1; j < particles.value.length; j++) {
      const dx = particles.value[i].x - particles.value[j].x
      const dy = particles.value[i].y - particles.value[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < props.connectionDistance) {
        const opacity = (1 - distance / props.connectionDistance) * 0.5
        ctx.globalAlpha = opacity
        ctx.strokeStyle = props.lineColor
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(particles.value[i].x, particles.value[i].y)
        ctx.lineTo(particles.value[j].x, particles.value[j].y)
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }
  }
}

const animate = () => {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Update and draw particles
  particles.value.forEach(particle => {
    particle.update()
    particle.draw(ctx)
  })

  // Draw connections
  drawConnections(ctx)

  animationFrame.value = requestAnimationFrame(animate)
}

const handleResize = () => {
  nextTick(() => {
    if (containerRef.value) {
      canvasWidth.value = containerRef.value.offsetWidth
      canvasHeight.value = containerRef.value.offsetHeight
      
      if (canvasRef.value) {
        canvasRef.value.width = canvasWidth.value
        canvasRef.value.height = canvasHeight.value
        initParticles()
      }
    }
  })
}

onMounted(() => {
  handleResize()
  initParticles()
  animate()
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
  window.removeEventListener('resize', handleResize)
})
</script>