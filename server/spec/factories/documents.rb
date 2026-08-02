FactoryBot.define do
  factory :document do
    user
    name { "sample.txt" }
    private { false }

    after(:create) do |document|
      document.file.attach(
        io: File.open(Rails.root.join("spec/fixtures/files/sample.txt")),
        filename: "sample.txt",
        content_type: "text/plain"
      )
    end

    trait :private do
      private { true }
    end
  end
end
