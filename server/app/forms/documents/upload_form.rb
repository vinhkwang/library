module Documents
  class UploadForm
    include ActiveModel::Model

    MAX_SIZE_BYTES = 10.megabytes
    ALLOWED_CONTENT_TYPES = %w[
      application/pdf
      image/png
      image/jpeg
      image/gif
      text/plain
    ].freeze

    attr_accessor :user
    attr_reader :documents, :uploads

    def uploads=(value)
      @uploads = Array(value)
    end

    def private=(value)
      @private = value
    end

    validate :validate_uploads

    def save
      return false unless valid?

      @documents = ActiveRecord::Base.transaction do
        uploads.map do |upload|
          user.documents.create!(name: upload.original_filename, file: upload, private: @private)
        end
      end

      true
    end

    private

    def validate_uploads
      return errors.add(:base, "no files given") if uploads.empty?

      uploads.each do |upload|
        errors.add(upload.original_filename, "is too large") if upload.size > MAX_SIZE_BYTES
        errors.add(upload.original_filename, "has an invalid content type") unless ALLOWED_CONTENT_TYPES.include?(upload.content_type)
      end
    end
  end
end
