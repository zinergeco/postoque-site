FROM nginx:alpine

# Single static "coming soon" page for postoque.com.
COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80
