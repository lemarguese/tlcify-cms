# --- Stage 1: Build the app ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package.json + yarn.lock first (to cache dependencies)
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Copy rest of the source code
COPY . .

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

ARG VITE_GOOGLE_API_KEY
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY

# Build for production
RUN yarn build


# --- Stage 2: Serve with a lightweight server ---
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
