
#   policy.connect_src :self, :https, "http://localhost:3035", "ws://localhost:3035" 
if !Rails.env.development? then
    Rails.application.config.session_store :cookie_store, {
      :key => '_application_session',
      :domain => :all,
      :same_site => :none,
      :secure => :true,
      :tld_length => 2
    }
end