package handler

import (
	"backend/internal/model"
	"backend/internal/service"
	"backend/internal/ws"
	"fmt"
	"image"
	"image/jpeg"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/nfnt/resize"
)

func GetFeed(c *gin.Context) {
	tags := c.QueryArray("tag")
	var images, _ = service.ReadMetadata()

	if len(tags) > 0 {
		filteredImages := service.FilterImages(images, tags)
		c.IndentedJSON(http.StatusOK, filteredImages)
	} else {
		c.IndentedJSON(http.StatusOK, images)
	}
}

func PostUpload(hub *ws.Hub) gin.HandlerFunc {
	return func(c *gin.Context) {
		var imageForm model.ImageForm
		if err := c.ShouldBind(&imageForm); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		uploadedFile, err := file.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		img, _, err := image.Decode(uploadedFile)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Normalize image
		resizedImg := resize.Resize(700, 0, img, resize.Lanczos3)

		newImage, imageFileName := service.CreateNewImage(file.Filename, imageForm.Title, imageForm.Tags)

		dst := filepath.Join("../storage/images", filepath.Base(imageFileName))

		out, err := os.Create(dst)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		defer out.Close()

		err = jpeg.Encode(out, resizedImg, &jpeg.Options{Quality: 85})
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		service.SaveMetadata(newImage)

		hub.Broadcast(websocket.TextMessage, []byte("new image"))

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", imageFileName))
	}
}
