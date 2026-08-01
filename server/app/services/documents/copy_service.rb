module Documents
  class CopyService
    def initialize(user:, source_id:)
      @user = user
      @source_id = source_id
    end

    def call
      source = Document.visible_to(@user).find(@source_id)

      document = ActiveRecord::Base.transaction do
        copy = @user.documents.create!(name: source.name)
        copy.file.attach(
          io: StringIO.new(source.file.download),
          filename: source.file.filename,
          content_type: source.file.content_type
        )
        copy
      end

      Result.new(success?: true, value: document, errors: {})
    end
  end
end
