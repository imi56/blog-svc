require 'opentelemetry/sdk'
require 'opentelemetry/instrumentation/all'

OpenTelemetry::SDK.configure do |c|
  # Automatically registers instrumentation for supported libraries
  c.use_all
end
