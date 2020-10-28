import django_filters

from .models import Email

class MailFilter(django_filters.FilterSet):
    class meta:
        models = Email
        fields = ['subject']