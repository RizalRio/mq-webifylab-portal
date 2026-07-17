package service

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/model"
	"github.com/RizalRio/webifylab-backend/internal/repository"
)

type MediaService interface {
	UploadMedia(req dto.UploadMediaRequest) (model.MediaAsset, error)
}

type mediaService struct {
	repo repository.MediaRepository
}

func NewMediaService(repo repository.MediaRepository) MediaService {
	return &mediaService{repo}
}

func (s *mediaService) UploadMedia(req dto.UploadMediaRequest) (model.MediaAsset, error) {
	var mediaAsset model.MediaAsset

	// 1. Validasi Ukuran File (Maksimal 2MB = 2 * 1024 * 1024 bytes)
	if req.File.Size > 2*1024*1024 {
		return mediaAsset, errors.New("ukuran file maksimal adalah 2MB")
	}

	// 2. Validasi Tipe File (MIME Type)
	ext := strings.ToLower(filepath.Ext(req.File.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp" {
		return mediaAsset, errors.New("format file tidak didukung (gunakan JPG, PNG, atau WEBP)")
	}

	// 3. Buat Folder Tujuan Jika Belum Ada
	uploadDir := "./public/uploads"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return mediaAsset, errors.New("gagal menyiapkan folder penyimpanan server")
	}

	// 4. Buat Nama File Unik (Mencegah nama file kembar saling menimpa)
	// Format: unix_timestamp_mediabletype_mediableid.ext
	newFileName := fmt.Sprintf("%d_%s_%d%s", time.Now().Unix(), req.MediableType, req.MediableID, ext)
	savePath := filepath.Join(uploadDir, newFileName)

	// 5. Simpan File Fisik ke dalam Server
	src, err := req.File.Open()
	if err != nil {
		return mediaAsset, err
	}
	defer src.Close()

	dst, err := os.Create(savePath)
	if err != nil {
		return mediaAsset, err
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		return mediaAsset, err
	}

	// 6. Simpan Metadata ke Database via Repository
	mediaAsset = model.MediaAsset{
		MediableID:   req.MediableID,
		MediableType: req.MediableType,
		FileName:     newFileName,
		FileURL:      "/public/uploads/" + newFileName, // Path ini yang akan diakses oleh frontend
		MimeType:     req.File.Header.Get("Content-Type"),
		IsPrimary:    req.IsPrimary,
	}

	err = s.repo.Create(&mediaAsset)
	return mediaAsset, err
}
