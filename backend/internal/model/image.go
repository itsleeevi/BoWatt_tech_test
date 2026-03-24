package model

import (
	"time"
)

type Image struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	URL       string    `json:"url"`
	Tags      []string  `json:"tags"`
	CreatedAt time.Time `json:"createdAt"`
}

type ImageForm struct {
	Title string   `form:"title" binding:"required"`
	Tags  []string `form:"tags" binding:"required"`
}
