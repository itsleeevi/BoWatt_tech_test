package service

import (
	"backend/internal/model"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/google/uuid"
)

func CreateNewImage(fileName string, title string, tags []string) (model.Image, string) {
	imageID := uuid.New().String()
	imageFileName := imageID + ".jpg"

	newImage := model.Image{
		ID:        imageID,
		Title:     title,
		URL:       "/images/" + imageFileName,
		Tags:      tags,
		CreatedAt: time.Now(),
	}

	return newImage, imageFileName
}

func SaveMetadata(newImage model.Image) error {
	filename := "../storage/metadata.json"

	file, err := os.ReadFile(filename)
	if err != nil {
		return err
	}

	log.Println("content:", string(file))

	var images []model.Image
	json.Unmarshal(file, &images)

	images = append(images, newImage)

	updatedFile, err := json.MarshalIndent(images, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(filename, updatedFile, 0644)
}

func ReadMetadata() ([]model.Image, error) {
	filename := "../storage/metadata.json"

	file, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var images []model.Image

	err = json.Unmarshal(file, &images)
	if err != nil {
		return nil, err
	}

	return images, nil
}

func FilterImages(images []model.Image, tags []string) []model.Image {
	var filteredImages []model.Image

	for _, image := range images {
		if intersects(image.Tags, tags) {
			filteredImages = append(filteredImages, image)
		}
	}

	return filteredImages
}

func intersects(array1 []string, array2 []string) bool {
	for _, value := range array1 {
		if contains(array2, value) {
			return true
		}
	}

	return false
}

func contains(array []string, value string) bool {
	for _, item := range array {
		if item == value {
			return true
		}
	}

	return false
}
