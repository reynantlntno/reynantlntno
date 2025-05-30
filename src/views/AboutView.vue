<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-2">About Me</h1>
      <div class="h-1 w-24 bg-primary mb-6"></div>
      
      <!-- Professional Summary -->
      <div class="mb-12">
        <p class="text-lg mb-4 text-gray-600 dark:text-gray-300">
          I'm Reynan Tolentino, a passionate software developer specializing in building modern web 
          applications and interactive experiences. With expertise in both frontend and backend technologies, 
          I create robust, scalable solutions that deliver exceptional user experiences.
        </p>
        <p class="text-lg mb-4 text-gray-600 dark:text-gray-300">
          My approach combines technical expertise with a keen eye for design and usability. 
          I believe in writing clean, maintainable code and staying up-to-date with the latest industry trends 
          and best practices.
        </p>
      </div>
      
      <!-- Tech Stack -->
      <h2 class="text-2xl font-semibold mb-4">Technical Expertise</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div class="glass-panel p-6">
          <h3 class="text-xl font-medium mb-3 flex items-center">
            <span class="bg-primary/10 p-2 rounded-full mr-3">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </span>
            Frontend Development
          </h3>
          <ul class="space-y-2 text-gray-600 dark:text-gray-400">
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Vue.js (Vue 2 & 3, Composition API, Vuex, Pinia)
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              React (Hooks, Context API, Redux)
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              CSS (Tailwind CSS, SCSS, CSS-in-JS)
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              JavaScript (ES6+), TypeScript
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Responsive Design, Accessibility (WCAG)
            </li>
          </ul>
        </div>
        
        <div class="glass-panel p-6">
          <h3 class="text-xl font-medium mb-3 flex items-center">
            <span class="bg-primary/10 p-2 rounded-full mr-3">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"></path>
              </svg>
            </span>
            Backend Development
          </h3>
          <ul class="space-y-2 text-gray-600 dark:text-gray-400">
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Node.js (Express, Fastify, Nest.js)
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              PHP (Laravel, WordPress)
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              RESTful APIs, GraphQL
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Serverless (AWS Lambda, Netlify Functions)
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Database Design (SQL, NoSQL)
            </li>
          </ul>
        </div>
        
        <div class="glass-panel p-6">
          <h3 class="text-xl font-medium mb-3 flex items-center">
            <span class="bg-primary/10 p-2 rounded-full mr-3">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
            </span>
            Database & Storage
          </h3>
          <ul class="space-y-2 text-gray-600 dark:text-gray-400">
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              MongoDB
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              MySQL, PostgreSQL
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Firebase (Firestore, Realtime DB)
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Redis
            </li>
          </ul>
        </div>
        
        <div class="glass-panel p-6">
          <h3 class="text-xl font-medium mb-3 flex items-center">
            <span class="bg-primary/10 p-2 rounded-full mr-3">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </span>
            DevOps & Deployment
          </h3>
          <ul class="space-y-2 text-gray-600 dark:text-gray-400">
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              CI/CD (GitHub Actions, CircleCI)
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Docker, Containerization
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              AWS (EC2, S3, Lambda, CloudFront)
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Netlify, Vercel, Heroku
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Work Experience -->
      <h2 class="text-2xl font-semibold mb-4">Work Experience</h2>
      <div class="space-y-8 mb-12">
        <div class="glass-panel p-6">
          <div class="flex flex-wrap justify-between mb-2">
            <h3 class="text-xl font-medium">Senior Full Stack Developer</h3>
            <span class="text-primary font-medium">2021 - Present</span>
          </div>
          <h4 class="text-lg text-gray-600 dark:text-gray-400 mb-3">TechInnovate Solutions</h4>
          <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Lead the development of enterprise SaaS applications using Vue.js and Node.js</li>
            <li>Implemented CI/CD pipelines that reduced deployment time by 75%</li>
            <li>Mentored junior developers and conducted code reviews to maintain code quality</li>
            <li>Redesigned database architecture, resulting in a 40% improvement in query performance</li>
          </ul>
        </div>
        
        <div class="glass-panel p-6">
          <div class="flex flex-wrap justify-between mb-2">
            <h3 class="text-xl font-medium">Frontend Developer</h3>
            <span class="text-primary font-medium">2018 - 2021</span>
          </div>
          <h4 class="text-lg text-gray-600 dark:text-gray-400 mb-3">Digital Craft Studios</h4>
          <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Developed responsive web applications for clients in finance, healthcare, and e-commerce</li>
            <li>Built interactive dashboards and data visualization interfaces using React and D3.js</li>
            <li>Improved application loading speed by 60% through optimization techniques</li>
            <li>Collaborated with designers to create intuitive, accessible user interfaces</li>
          </ul>
        </div>
        
        <div class="glass-panel p-6">
          <div class="flex flex-wrap justify-between mb-2">
            <h3 class="text-xl font-medium">Web Developer</h3>
            <span class="text-primary font-medium">2016 - 2018</span>
          </div>
          <h4 class="text-lg text-gray-600 dark:text-gray-400 mb-3">CreativeWeb Agency</h4>
          <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Created custom WordPress themes and plugins for small business clients</li>
            <li>Developed e-commerce solutions using WooCommerce and Shopify</li>
            <li>Implemented SEO best practices, improving client search rankings</li>
            <li>Provided technical support and maintenance for client websites</li>
          </ul>
        </div>
      </div>
      
      <!-- Education -->
      <h2 class="text-2xl font-semibold mb-4">Education</h2>
      <div class="glass-panel p-6 mb-12">
        <div class="flex flex-wrap justify-between mb-2">
          <h3 class="text-xl font-medium">Bachelor of Science in Computer Science</h3>
          <span class="text-primary font-medium">2012 - 2016</span>
        </div>
        <h4 class="text-lg text-gray-600 dark:text-gray-400 mb-3">University of Technology</h4>
        <p class="text-gray-600 dark:text-gray-400">
          Graduated with honors. Specialized in web technologies and software engineering.
          Participated in ACM programming competitions and led the university's web development club.
        </p>
      </div>
      
      <!-- Certifications -->
      <h2 class="text-2xl font-semibold mb-4">Certifications</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div class="glass-panel p-5">
          <h3 class="text-lg font-medium">AWS Certified Developer</h3>
          <p class="text-gray-600 dark:text-gray-400">Amazon Web Services | 2022</p>
        </div>
        <div class="glass-panel p-5">
          <h3 class="text-lg font-medium">Professional Scrum Master</h3>
          <p class="text-gray-600 dark:text-gray-400">Scrum.org | 2021</p>
        </div>
        <div class="glass-panel p-5">
          <h3 class="text-lg font-medium">Google UX Design Professional</h3>
          <p class="text-gray-600 dark:text-gray-400">Google | 2020</p>
        </div>
        <div class="glass-panel p-5">
          <h3 class="text-lg font-medium">MongoDB Certified Developer</h3>
          <p class="text-gray-600 dark:text-gray-400">MongoDB University | 2019</p>
        </div>
      </div>
      
      <!-- Personal Interests -->
      <h2 class="text-2xl font-semibold mb-4">When I'm Not Coding</h2>
      <div class="glass-panel p-6 mb-12">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Outside of development, I'm passionate about photography, hiking, and reading science fiction novels.
          I also contribute to open-source projects and mentor aspiring developers through online communities.
          I believe in continuous learning and staying curious about new technologies and approaches.
        </p>
        <div class="flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">Photography</span>
          <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">Hiking</span>
          <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">Reading</span>
          <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">Open Source</span>
          <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">Mentoring</span>
        </div>
      </div>
      
      <!-- Download Resume -->
      <div class="flex justify-center">
        <a 
          href="#" 
          class="btn-primary flex items-center"
          target="_blank" 
          rel="noopener noreferrer"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
          </svg>
          Download Resume
        </a>
      </div>
    </div>
  </div>
</template>