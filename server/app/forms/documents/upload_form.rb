module Documents
  class UploadForm
    MAX_SIZE_BYTES = 10.megabytes
    ALLOWED_CONTENT_TYPES = %w[
      application/pdf
      image/png
      image/jpeg
      image/gif
      text/plain
    ].freeze

    def initialize(user:, uploads:, private: false)
      @user = user
      @uploads = Array(uploads)
      @private = private
    end

    def call
      errors = validate_uploads

      return Result.new(success?: false, value: nil, errors: errors) if errors.any?

      documents = ActiveRecord::Base.transaction do
        @uploads.map do |upload|
          @user.documents.create!(name: upload.original_filename, file: upload, private: @private)
        end
      end

      Result.new(success?: true, value: documents, errors: {})
    end

    private

    def validate_uploads
      return { base: ["no files given"] } if @uploads.empty?

      errors = {}

      @uploads.each do |upload|
        file_errors = []
        file_errors << "is too large" if upload.size > MAX_SIZE_BYTES
        file_errors << "has an invalid content type" unless ALLOWED_CONTENT_TYPES.include?(upload.content_type)

        errors[upload.original_filename] = file_errors if file_errors.any?
      end

      errors
    end
  end
end
