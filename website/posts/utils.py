from django.conf import settings
from django.urls import reverse


def get_api_url_by_slug(slug):
    api_url_path = reverse('wagtailapi:posts:detail', kwargs={'slug': slug})
    return f"http://{settings.FRONTEND_URL}{api_url_path}"