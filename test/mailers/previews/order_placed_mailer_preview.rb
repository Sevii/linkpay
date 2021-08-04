# Preview all emails at http://localhost:3000/rails/mailers/order_placed_mailer
class OrderPlacedMailerPreview < ActionMailer::Preview
  def order_placed_email
    OrderPlacedMailer.with(order: Order.find(45), inovice: Inovice.find(12)).order_placed_email
  end
  def order_confirmation_email
    OrderPlacedMailer.with(order: Order.find(45), inovice: Inovice.find(12)).order_confirmation_email
  end
end
