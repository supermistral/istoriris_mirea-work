from django.db import models
from django.utils import timezone

from wagtail.core.models import Page
from wagtail.admin.edit_handlers import StreamFieldPanel, FieldPanel
from wagtail.core.templatetags import wagtailcore_tags
from wagtail.core.fields import StreamField
from wagtail.core import blocks
from wagtail.api import APIField
from wagtail.images.blocks import ImageChooserBlock
from wagtail.snippets.models import register_snippet

from modelcluster.contrib.taggit import ClusterTaggableManager
from modelcluster.fields import ParentalKey

from taggit.models import TagBase, ItemBase

from .blocks import PostBlock
from .utils import get_api_url_by_slug


@register_snippet
class PostTag(TagBase):
    free_tagging = False

    class Meta:
        verbose_name = "post tag"
        verbose_name_plural = "post tags"


class TaggedPost(ItemBase):
    tag = models.ForeignKey(
        PostTag,
        on_delete=models.CASCADE,
        related_name="tagged_posts",
    )
    content_object = ParentalKey(
        to="posts.PostPage",
        on_delete=models.CASCADE,
        related_name="tagged_items"
    )


class PostPage(Page):
    tags = ClusterTaggableManager(through=TaggedPost)
    content = StreamField(PostBlock, min_num=1)
    
    content_panels = Page.content_panels + [
        StreamFieldPanel('content'),
        FieldPanel('tags'),
    ]

    subpage_types = []

    api_fields = [
        APIField('title'),
        APIField('content'),
        APIField('tags'),
    ]

    class Meta:
        verbose_name = "post"
        verbose_name_plural = "posts"

    def __str__(self):
        return f"{'|'.join([tag.name for tag in self.tags.all()])} {self.go_live_at}"

    def save(self, *args, **kwargs):
        if self.go_live_at is None:
            self.go_live_at = timezone.now()

        tag_slugs = "-".join([tag.slug for tag in self.tags.all()])
        date = self.go_live_at.strftime("%d-%m-%y-%H-%M")
        self.slug = f"{tag_slugs}-{date}"
        
        return super().save(*args, **kwargs)

    @property
    def api_url(self):
        return get_api_url_by_slug(self.slug)


class AuthorPage(Page):
    content = StreamField(PostBlock, min_num=1)

    content_panels = Page.content_panels + [
        StreamFieldPanel('content'),
    ]

    subpage_types = []

    api_fields = [
        APIField('title'),
        APIField('content'),
    ]

    max_count = 1

    class Meta:
        verbose_name = "author page"