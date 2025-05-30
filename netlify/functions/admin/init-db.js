const { connectToDatabase, getModels } = require('../utils/db');

/**
 * Admin function to initialize the database and create collections if they don't exist
 */
exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: JSON.stringify({ message: 'Preflight request successful' }),
    };
  }

  // Simple authorization check
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' })
    };
  }
  
  const token = authHeader.split(' ')[1];
  
  // Check against environment variable
  if (token !== process.env.ADMIN_API_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid token' })
    };
  }
  
  try {
    // Connect to database
    await connectToDatabase();
    const { BlogPost, Appointment, Message } = getModels();
    
    // Check if collections exist by counting documents
    const collections = {
      blogPosts: await BlogPost.countDocuments(),
      appointments: await Appointment.countDocuments(),
      messages: await Message.countDocuments()
    };
    
    // Create sample blog post if none exists
    if (collections.blogPosts === 0) {
      const samplePost = new BlogPost({
        title: 'Getting Started with Vue 3 and Tailwind CSS',
        slug: 'getting-started-with-vue-3-and-tailwind-css',
        content: `
# Getting Started with Vue 3 and Tailwind CSS

Vue 3 and Tailwind CSS make a powerful combination for modern web development. In this article, we'll explore how to set them up together and create a simple project.

## Setting up the project

First, let's create a new Vue project using the Vue CLI:

\`\`\`bash
npm init vue@latest my-project
cd my-project
\`\`\`

Next, install Tailwind CSS:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## Configuring Tailwind

Edit your tailwind.config.js file to include your Vue template files:

\`\`\`javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

## Adding Tailwind to your CSS

Create a CSS file and add the Tailwind directives:

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

## Start building!

Now you can use Tailwind classes in your Vue components:

\`\`\`vue
<template>
  <div class="p-4 bg-blue-500 text-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold">Hello, Vue 3 + Tailwind CSS!</h1>
    <p class="mt-2">This is just the beginning of your journey.</p>
  </div>
</template>
\`\`\`

Happy coding!
        `,
        excerpt: 'Learn how to set up a project with Vue 3 and Tailwind CSS for efficient and beautiful web development.',
        author: 'Reynan Tolentino',
        coverImage: 'https://picsum.photos/seed/vue-tailwind/800/400',
        tags: ['Vue.js', 'Tailwind CSS', 'Web Development', 'Frontend'],
        published: true,
        featured: true
      });
      
      await samplePost.save();
      collections.blogPosts = 1;
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Database initialized successfully',
        collections
      })
    };
  } catch (error) {
    console.error('Error initializing database:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error initializing database',
        error: error.message
      })
    };
  }
};