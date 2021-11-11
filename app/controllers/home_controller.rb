class HomeController < ApplicationController
    def index
    end
    def pricing
    end
    def demo
    end
    def docs
        @user = current_user
    end
    def privacy
    end
    def tos
    end
end
