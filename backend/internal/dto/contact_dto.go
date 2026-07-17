package dto

type CreateContactRequest struct {
	SenderName  string  `json:"sender_name" binding:"required"`
	SenderEmail string  `json:"sender_email" binding:"required,email"`
	SenderPhone *string `json:"sender_phone"`
	Subject     string  `json:"subject" binding:"required"`
	Message     string  `json:"message" binding:"required"`
}
