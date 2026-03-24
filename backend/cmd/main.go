package main

import (
	"backend/internal/handler"
	"backend/internal/ws"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	hub := ws.NewHub()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
	}))

	router.GET("/feed", handler.GetFeed)
	router.POST("/upload", handler.PostUpload(hub))
	router.Static("/images", "../storage/images")
	router.GET("/ws", ws.WebSocket(hub))
	router.Run(":8080")
}
