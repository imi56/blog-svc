# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration
If you’re using the Docker driver, NodePort won’t be accessible via the Minikube IP by default. Use minikube service blog-svc --url instead.

install minikube

#### Get url to access the service
minikube service blog-svc --url

#### Service up command
kubectl apply -k .

* ...
