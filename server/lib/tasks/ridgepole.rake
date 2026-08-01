namespace :ridgepole do
  desc "Apply db/Schemafile to the database for the current RAILS_ENV"
  task :apply do
    sh "bundle exec ridgepole -c config/database.yml -f db/Schemafile --apply -E #{Rails.env}"
  end
end
