import os
from celery import Celery
from celery.schedules import crontab
import yagmail
import os
from dotenv import load_dotenv
load_dotenv()  

os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1') #for windows

app = Celery(__name__, broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Example: Runs every minute
    sender.add_periodic_task(crontab(minute='*/1'), send_email.s("Every minute"), name='add every minute')


@app.task
def send_email(email_data):
    try:
        yag = yagmail.SMTP(user=os.environ.get("EMAIL_USER"), password=os.environ.get("EMAIL_PASSWORD")) #Get credentials from environment variables
        yag.send(
            to=email_data["recipient"],
            subject=email_data["subject"],
            contents=email_data["body"],
        )
        print(f"Email sent successfully to {email_data['recipient']}")
    except Exception as e:
        print(f"Error sending email: {e}")