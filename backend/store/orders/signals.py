from django.db.models.signals import post_save, post_init
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Order

def send_order_email(subject, message, to_email):
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [to_email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

@receiver(post_init, sender=Order)
def order_post_init(sender, instance, **kwargs):
    """
    Store the original status and shipping details of the order when it is initialized.
    This allows us to track changes in post_save.
    """
    instance._original_status = instance.status
    instance._original_address = instance.address
    instance._original_phone = instance.phone

@receiver(post_save, sender=Order)
def order_status_changed(sender, instance, created, **kwargs):
    # If the order is newly created, we might want to send a 'pending' (placed) email
    # or just return if we only care about updates. 
    # Based on previous logic, 'pending' was a status check. 
    # If created, status is likely default ('pending').
    
    current_status = instance.status
    original_status = getattr(instance, '_original_status', None)
    
    user_email = instance.user.email
    if not user_email:
        return

    # Check if status has changed or if it's a new order with a specific initial status
    if created or current_status != original_status:
        subject = f"Order #{instance.id} Update"
        message = ""
        
        # Email Templates
        if current_status == 'pending':
            message = f"""
    Hello {instance.user.username},

    Your order #{instance.id} has been placed and is waiting for payment.
    Total: {instance.total_price} EGP

    Thank you for shopping with us.
    Moda House.
            """
        elif current_status == 'cancelled':
            message = f"""
    Hello {instance.user.username},

    Your order #{instance.id} has been cancelled at your request.

    Thank you for shopping with us.
    
    Moda House.
            """
        elif current_status == 'paid':
            message = f"""
    Hello {instance.user.username},

    Thank you for your payment for order #{instance.id}.
    Total: {instance.total_price} EGP
    You will get an email once the order is shipped. 
    Thank you for shopping with us.
    Moda House.
            """
        elif current_status == 'cod':
            message = f"""
    Hello {instance.user.username},

    Thank you for you order #{instance.id}.
    Total: {instance.total_price} EGP Cash on Delivery.
    You will get an email once the order is shipped. 
    Kindly Reminder that even if you didn't accept the order after delivery you will pay delivery fees.
    Thank you for shopping with us.
    Moda House.
            """
        elif current_status == 'shipped':
            message = f"""
    Hello {instance.user.username},

    Your Order #{instance.id} has been shipped and it's on its way to you.
    For any problems please contact us at +20123456789.

    Thank you for shopping with us.
    Moda House.
            """
        elif current_status == 'delivered':
            message = f"""
    Hello {instance.user.username},

    Your Order #{instance.id} has been delivered safely.

    For any problems please contact us at +20123456789.
    We look forward to seeing you again!

    Thank you for shopping with us.
    Moda House.
            """
        
        if message:
            send_order_email(subject, message, user_email)

    # Address or Phone Number Change Logic
    original_address = getattr(instance, '_original_address', None)
    original_phone = getattr(instance, '_original_phone', None)

    if not created:
        details_changed = False
        change_message = ""
        
        if instance.address != original_address:
            details_changed = True
            change_message += f"\n- Address updated from '{original_address}' to '{instance.address}'"
        
        if instance.phone != original_phone:
            details_changed = True
            change_message += f"\n- Phone number updated from '{original_phone}' to '{instance.phone}'"
        
        if details_changed:
            subject = f"Order #{instance.id} Details Updated"
            user_message = f"""
    Hello {instance.user.username},

    The shipping details for your order #{instance.id} have been updated:
    {change_message}

    If you did not authorize this change, please contact us immediately.

    Thank you,
    Moda House.
            """
            send_order_email(subject, user_message, user_email)

            # Also notify admin
            admin_subject = f"Order #{instance.id} Shipping Details Updated"
            admin_message = f"""
Order ID: {instance.id}
Customer: {instance.user.username}
Updates: {change_message}
            """
            send_order_email(admin_subject, admin_message, settings.DEFAULT_FROM_EMAIL)

    # Admin Notification Logic (Status Change)
    if not created and current_status != original_status:
        subject = f"Order #{instance.id} Status Updated"
        message = f"""
Order ID: {instance.id}
Customer: {instance.user.username}
Old Status: {original_status}
New Status: {current_status}
Total: {instance.total_price} EGP
        """
        admin_email = settings.DEFAULT_FROM_EMAIL
        send_order_email(subject, message, admin_email)
    
    # Update original values for subsequent saves on the same instance
    instance._original_status = current_status
    instance._original_address = instance.address
    instance._original_phone = instance.phone
