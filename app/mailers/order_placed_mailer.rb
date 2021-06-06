class OrderPlacedMailer < ApplicationMailer
    def hello_email
    mail(
      :subject => 'Hello from Postmark',
      :to  => 'nick@sledgeworx.io.com',
      :from => 'admin@seviipay.com',
      :html_body => 'HTML body goes here',
      :track_opens => 'true')
    end

    def order_placed_email
        @inovice = params[:inovice]
        @order = params[:order]
          mail(
            to: email_address_with_name(@inovice.owner_email, @inovice.seller_name),
            subject: 'Order placed with seviipay'
          )
    end
end
