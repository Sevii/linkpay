require "application_system_test_case"
require "selenium-webdriver"

class PaymentTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers
  # Make the Capybara DSL available in all integration tests

  test "visiting the payment page" do
     visit payment_url(2)
    click_on "Pay with Ethereum"
  end


  # Reset sessions and driver between tests
  teardown do
    Capybara.reset_sessions!
    Capybara.use_default_driver
  end
end
