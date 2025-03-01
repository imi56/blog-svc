json.extract! blog, :id, :title, :content, :user_uuid, :created_at, :updated_at
json.url blog_url(blog, format: :json)
