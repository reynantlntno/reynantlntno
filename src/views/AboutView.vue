<template>
  <div>
    <!-- Hero Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold mb-6">About Me</h1>
            <p class="text-lg text-dark-muted dark:text-light-muted mb-6">
              Hi, I'm Reynan Tolentino, a passionate software developer with a focus on creating modern web experiences. I specialize in building fast, accessible, and user-friendly applications using the latest technologies.
            </p>
            <p class="text-lg text-dark-muted dark:text-light-muted mb-6">
              With over 5 years of experience in web development, I've worked on a variety of projects ranging from small business websites to complex enterprise applications. I'm particularly interested in the intersection of great design and technical excellence.
            </p>
            <p class="text-lg text-dark-muted dark:text-light-muted">
              When I'm not coding, you can find me exploring new hiking trails, reading about technology trends, or experimenting with new development frameworks.
            </p>
          </div>
          <div class="flex justify-center">
            <div class="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden glass-card p-3">
              <!-- Replace with your actual profile image -->
              <div class="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Skills Section -->
    <section class="py-16 bg-light-muted dark:bg-dark-muted">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">My Skills</h2>
          <p class="text-lg text-dark-muted dark:text-light-muted max-w-2xl mx-auto">
            Technologies and tools I work with to bring ideas to life.
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <SkillsSection />
        </div>
      </div>
    </section>
    
    <!-- Experience Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
          <p class="text-lg text-dark-muted dark:text-light-muted max-w-2xl mx-auto">
            My professional journey in the world of software development.
          </p>
        </div>
        
        <div class="space-y-12">
          <!-- Experience Item -->
          <div class="glass-card">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold">Senior Frontend Developer</h3>
                <p class="text-primary dark:text-primary-light font-medium">Tech Innovations Inc.</p>
              </div>
              <div class="mt-2 md:mt-0 text-dark-muted dark:text-light-muted">
                January 2020 - Present
              </div>
            </div>
            <p class="text-dark-muted dark:text-light-muted">
              Led the development of multiple high-traffic web applications using Vue.js and React. Improved site performance by 40% through code optimization and modern best practices. Mentored junior developers and collaborated with design teams to create intuitive user experiences.
            </p>
          </div>
          
          <!-- Experience Item -->
          <div class="glass-card">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold">Web Developer</h3>
                <p class="text-primary dark:text-primary-light font-medium">Digital Solutions Ltd.</p>
              </div>
              <div class="mt-2 md:mt-0 text-dark-muted dark:text-light-muted">
                June 2017 - December 2019
              </div>
            </div>
            <p class="text-dark-muted dark:text-light-muted">
              Developed responsive websites and web applications for various clients across industries. Implemented modern frontend frameworks and improved existing codebases. Worked closely with backend teams to integrate APIs and ensure seamless data flow.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Education Section -->
    <section class="py-16 bg-light-muted dark:bg-dark-muted">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Education</h2>
          <p class="text-lg text-dark-muted dark:text-light-muted max-w-2xl mx-auto">
            My academic background and continuous learning journey.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Education Item -->
          <div class="glass-card">
            <div class="flex items-center mb-4">
              <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary dark:text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold">Bachelor of Science in Computer Science</h3>
                <p class="text-primary dark:text-primary-light">University of Technology</p>
                <p class="text-dark-muted dark:text-light-muted">Graduated: 2017</p>
              </div>
            </div>
          </div>
          
          <!-- Certifications -->
          <div class="glass-card">
            <h3 class="text-xl font-bold mb-4">Certifications</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary dark:text-primary-light mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>AWS Certified Solutions Architect</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary dark:text-primary-light mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>MongoDB Certified Developer</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary dark:text-primary-light mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Vue.js Advanced Certification</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="glass-card text-center p-8 md:p-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Interested in Working Together?</h2>
          <p class="text-lg text-dark-muted dark:text-light-muted max-w-2xl mx-auto mb-8">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/appointment">
              <BaseButton size="lg">Schedule a Call</BaseButton>
            </router-link>
            <router-link to="/contact">
              <BaseButton size="lg" variant="outline">Get in Touch</BaseButton>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import BaseButton from '@/components/shared/BaseButton.vue';
import SkillsSection from '@/components/About/SkillsSection.vue';
</script>