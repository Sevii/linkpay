class OrderPlacedMailer < ApplicationMailer
    def order_confirmation_email
        @inovice = params[:inovice]
        @order = params[:order]
          mail(
            to: email_address_with_name(@order.customer_email, @inovice.seller_name),
            :from => 'payments@www.seviipay.com',
            :subject => 'Order confirmation for ' + @inovice.name
          )
    end

    def order_placed_email
        @inovice = params[:inovice]
        @order = params[:order]
          mail(
            to: email_address_with_name(@inovice.owner_email, @inovice.seller_name),
            :from => 'payments@www.seviipay.com',
            :subject => 'Order placed with seviipay'
          )
    end
end
