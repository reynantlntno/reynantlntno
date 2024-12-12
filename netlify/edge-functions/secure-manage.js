// netlify/edge-functions/secure-manage.js

import jwt from 'jsonwebtoken'; 

const secretKey = Deno.env.get("SECRET_KEY");
const jwtSecret = Deno.env.get("JWT_SECRET"); 

export default async (request, context) => {
  const path = new URL(request.url).pathname;

  if (path === "/private/manage.htm") { 
    if (request.method === "GET") {
      // Check for a valid token in cookies
      const cookies = request.headers.get("Cookie");
      const token = cookies?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

      if (token) {
        try {
          // Verify the token
          const decoded = jwt.verify(token, jwtSecret);
          // If valid, allow access to manage.htm
          return context.next(); 
        } catch (err) {
          // Token is invalid or expired
          console.error("Invalid token:", err);
        }
      }

      // If no valid token, serve the login form
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Secure Area</title>
        </head>
        <body>
          <h1>Secure Area</h1>
          <form method="POST">
            <label for="secretKey">Secret Key:</label>
            <input type="password" id="secretKey" name="secretKey" required>
            <button type="submit">Enter</button>
          </form>
        </body>
        </html>
      `, {
        headers: { "Content-Type": "text/html" }
      });
    } else if (request.method === "POST") {
      const formData = await request.formData();
      const submittedKey = formData.get("secretKey");

      if (submittedKey === secretKey) {
        // Generate JWT
        const token = jwt.sign({ }, jwtSecret, { expiresIn: '1h' });

        // Redirect with token in cookie
        return new Response(null, {
          status: 302,
          headers: {
            'Set-Cookie': `token=${token}; HttpOnly; Max-Age=3600; Path=/;`, // Secure; for HTTPS
            'Location': '/private/manage.htm', // Redirect to the protected page
          }
        });
      } else {
        return new Response("Invalid secret key", { status: 401 });
      }
    }
  }

  return context.next();
};