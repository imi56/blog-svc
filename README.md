# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration
If you’re using the Docker driver, NodePort won’t be accessible via the Minikube IP by default. Use minikube service blog-svc --url instead.

#### install and start minikube
install minikube
minikube start --driver=docker

#### Get url to access the service
minikube service blog-svc --namespace blog-namespace --url
#### Service up command
kubectl apply -k .

#### check current namespace
kubectl config view --minify --output 'jsonpath={..namespace}'

#### list sercices
minikube service list

kubectl delete service blog-svc -n blog-namespace

* ...
