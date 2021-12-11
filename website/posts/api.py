from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.documents.api.v2.views import DocumentsAPIViewSet

from django.core.exceptions import MultipleObjectsReturned
from django.shortcuts import redirect
from django.urls import path, reverse
from django.db.models.functions import Lower

from taggit.models import Tag

from .models import PostPage


class CustomPagesAPIViewSet(PagesAPIViewSet):
    listing_default_fields = [
        'first_published_at',
    ]
    meta_fields = [
        'first_published_at',
        'locale',
    ]
    detail_only_fields = []

    def detail_view(self, request, pk=None, slug=None):
        param = pk
        if slug is not None:
            param = slug
            self.lookup_field = 'slug'

        try:
            return super().detail_view(request, param)
        except MultipleObjectsReturned as e:
            return redirect(reverse("wagtail:posts:listing") + f"?{self.lookup_field}={param}")

    @classmethod
    def get_urlpatterns(cls):
        urlpatterns = super().get_urlpatterns()
        urlpatterns += [
            path('<slug:slug>/', cls.as_view({'get': 'detail_view'}), name="detail"),
        ]
        return urlpatterns


class PostPagesAPIViewSet(CustomPagesAPIViewSet):
    body_fields = [
        'tags',
        'slug',
        'go_live_at',
        'api_url',
    ]
    listing_default_fields = [
        'tags',
        'api_url',
        'go_live_at',
        'slug',
    ]

    model = PostPage
    name = 'posts'

    def get_queryset(self):
        posts = self.model.objects.all().live().public().order_by('-go_live_at')

        tags_string = self.request.GET.get('tags', None)
        if tags_string is not None:
            tags = tags_string.lower().split(';')
            tags_id = Tag.objects.annotate(slug_lower=Lower('slug'))\
                .filter(slug_lower__in=tags).values_list('id', flat=True)
            posts = posts.filter(tags__in=tags_id)

        return posts

    def listing_view(self, request):
        # From wagtail.api.v2.views - BaseAPIViewSet
        # without filter_queryset
        queryset = self.get_queryset()
        self.check_query_parameters(queryset)
        queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    @classmethod
    def get_urlpatterns(cls):
        urlpatterns = super().get_urlpatterns()
        return urlpatterns + [
            path('', cls.as_view({'get': 'listing_view'}), name="listing"),
            path('find/', cls.as_view({'get': 'find_view'}), name='find'),
        ]


api_router = WagtailAPIRouter('wagtailapi')

api_router.register_endpoint('pages', CustomPagesAPIViewSet)
api_router.register_endpoint('posts', PostPagesAPIViewSet)
api_router.register_endpoint('images', ImagesAPIViewSet)
api_router.register_endpoint('documents', DocumentsAPIViewSet)