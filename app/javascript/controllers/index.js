// Import and register all your controllers from the importmap via controllers/**/*_controller
import { application } from "controllers/application"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
import TagsController from "./tags_controller"
application.register("tags", TagsController)
eagerLoadControllersFrom("controllers", application)
