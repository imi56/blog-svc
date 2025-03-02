class TagsController < ApplicationController
  require 'net/http'

  def index
    # Make a request to the tagging service
    uri = URI('http://tagging-svc.tagging-namespace.svc.cluster.local:8080/tags')

    begin
      response = Net::HTTP.get_response(uri)

      if response.is_a?(Net::HTTPSuccess)
        render json: response.body
      else
        render json: { error: 'Failed to fetch tags' }, status: :service_unavailable
      end
    rescue => e
      Rails.logger.error("Error fetching tags: #{e.message}")
      render json: { error: 'Service unavailable' }, status: :service_unavailable
    end
  end
end
