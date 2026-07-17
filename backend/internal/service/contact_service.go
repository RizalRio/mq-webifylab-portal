package service

import (
	"math"

	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/model"
	"github.com/RizalRio/webifylab-backend/internal/repository"
)

type ContactService interface {
	SubmitMessage(req dto.CreateContactRequest) error
	GetAllMessages(params dto.PaginationQueryParams) (dto.PagedResponse, error)
	GetMessageByID(id uint) (model.ContactMessage, error)
	MarkMessageAsRead(id uint) error
	DeleteMessage(id uint) error
}

type contactService struct {
	repo repository.ContactRepository
}

func NewContactService(repo repository.ContactRepository) ContactService {
	return &contactService{repo}
}

func (s *contactService) SubmitMessage(req dto.CreateContactRequest) error {
	msg := model.ContactMessage{
		SenderName:  req.SenderName,
		SenderEmail: req.SenderEmail,
		SenderPhone: req.SenderPhone,
		Subject:     req.Subject,
		Message:     req.Message,
		IsRead:      false, // Default untuk pesan baru
	}
	return s.repo.Create(&msg)
}

func (s *contactService) GetAllMessages(params dto.PaginationQueryParams) (dto.PagedResponse, error) {
	var response dto.PagedResponse

	// Ambil data dan total count dari repository
	messages, totalData, err := s.repo.FindAll(params)
	if err != nil {
		return response, err
	}

	// Hitung total halaman yang tersedia
	totalPage := int64(math.Ceil(float64(totalData) / float64(params.Limit)))
	if totalPage == 0 {
		totalPage = 1
	}

	// Bungkus ke dalam format PagedResponse DTO
	response.TotalData = totalData
	response.TotalPage = totalPage
	response.CurrentPage = params.Page
	response.Limit = params.Limit
	response.Data = messages

	return response, nil
}

func (s *contactService) GetMessageByID(id uint) (model.ContactMessage, error) {
	return s.repo.FindByID(id)
}

func (s *contactService) MarkMessageAsRead(id uint) error {
	return s.repo.MarkAsRead(id)
}

func (s *contactService) DeleteMessage(id uint) error {
	return s.repo.Delete(id)
}
