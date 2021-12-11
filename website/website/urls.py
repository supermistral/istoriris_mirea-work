from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from wagtail.core import urls as wagtailcore_urls
from wagtail.admin import urls as wagtailadmin_urls
from posts.api import api_router


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('core.urls')),
    path('api-posts/', api_router.urls, name="api_posts"),
    # path('', include('frontend.urls')),
    path('posts/', include(wagtailcore_urls)),
    path('cms/', include(wagtailadmin_urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)