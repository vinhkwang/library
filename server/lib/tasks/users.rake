namespace :users do
  desc "Create a user from EMAIL and PASSWORD env vars"
  task create: :environment do
    email = ENV.fetch("EMAIL")
    password = ENV.fetch("PASSWORD")

    user = User.create!(email: email, password: password)

    puts "Created user #{user.email} (id #{user.id})"
  end
end
