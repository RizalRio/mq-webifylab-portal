# Tahap 1: Builder
FROM golang:1.22-alpine AS builder
WORKDIR /app
# Copy dependency list
COPY go.mod go.sum ./
RUN go mod download
# Copy seluruh kode
COPY . .
# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o webify-api ./cmd/main.go

# Tahap 2: Production Image (Sangat Ringan)
FROM alpine:latest
WORKDIR /app
# Install sertifikat SSL root jika API perlu melakukan request ke luar
RUN apk --no-cache add ca-certificates
# Copy hasil build dari tahap 1
COPY --from=builder /app/webify-api .
# Copy folder public/uploads agar bisa melayani file statis
COPY --from=builder /app/public ./public 

EXPOSE 8080
CMD ["./webify-api"]