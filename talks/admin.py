from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Guest)
admin.site.register(Genre)
admin.site.register(Notification)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Votes)
