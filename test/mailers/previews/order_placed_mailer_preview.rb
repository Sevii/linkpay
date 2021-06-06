# Preview all emails at http://localhost:3000/rails/mailers/order_placed_mailer
class OrderPlacedMailerPreview < ActionMailer::Preview
  def order_placed_email
    OrderPlacedMailer.with(order: Order.first, inovice: Inovice.first).order_placed_email
  end
end
