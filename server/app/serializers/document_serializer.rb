class DocumentSerializer
  def initialize(document)
    @document = document
  end

  def as_json
    {
      id: document.id,
      name: document.name,
      byte_size: document.file.byte_size,
      content_type: document.file.content_type,
      private: document.private,
      created_at: document.created_at,
      owner: document.user.email,
      download_url: Rails.application.routes.url_helpers.rails_blob_path(document.file, only_path: true)
    }
  end

  private

  attr_reader :document
end
