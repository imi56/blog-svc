class BlogsController < ApplicationController
  require 'net/http'

  def index
    @blogs = Blog.all
    tags = fetch_tags
    render json: { blogs: @blogs, tags: tags }
  end

  # POST /blogs or /blogs.json
  def create
    @blog = Blog.new(blog_params)

    if @blog.save
      render json: @blog, status: :created
    else
      render json: { errors: @blog.errors }, status: :unprocessable_entity
    end
  end

  private

  def fetch_tags
    uri = URI('http://tagging-svc.tagging-namespace.svc.cluster.local:8080/tags')
    response = Net::HTTP.get_response(uri)
    if response.is_a?(Net::HTTPSuccess)
      JSON.parse(response.body)
    else
      Rails.logger.error "Failed to fetch tags, response code: #{response.code}"
      []  # Return an empty array if response is unsuccessful.
    end
  rescue => e
    Rails.logger.error "Error fetching tags: #{e.message}"
    []  # Return an empty array if an exception occurs.
  end

  # Only allow a list of trusted parameters through.
  def blog_params
    params.require(:blog).permit(:title, :content, :user_uuid, :tags)
  end
end
